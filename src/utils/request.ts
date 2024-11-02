import { getAccessToken } from "@/actions/auth"
import { revalidateTag } from "next/cache"

type BasicDataObject = {
    [key: string]:
        | string
        | number
        | boolean
        | string[]
        | number[]
        | boolean[]
        | undefined
}

interface InstanceRequest {
    GET: (
        url: string,
        params?: BasicDataObject,
        headers?: Headers
    ) => Promise<Response>

    POST: (url: string, body?: object, headers?: Headers) => Promise<Response>

    PUT: (url: string, body?: object, headers?: Headers) => Promise<Response>

    DELETE: (url: string, body?: object, headers?: Headers) => Promise<Response>

    REVALIDATE: (tag: string) => void
}

export default function getInstanceRequest(baseUrl: string): InstanceRequest {
    async function GET(
        url: string,
        params: BasicDataObject = {},
        headers: Headers = new Headers()
    ): Promise<Response> {
        headers.set("Authorization", `Bearer ${await getAccessToken()}`)

        const urlInstance = new URL(`${baseUrl}${url}`)

        Object.keys(params).forEach((key: string) => {
            if (Array.isArray(params[key])) {
                params[key].forEach((param) =>
                    urlInstance.searchParams.append(
                        `${key}[]`,
                        param.toString()
                    )
                )
            } else {
                if (params[key] !== undefined) {
                    urlInstance.searchParams.append(key, params[key].toString())
                }
            }
        })

        return fetch(urlInstance, {
            headers: headers,
            next: { tags: [baseUrl + url] },
        })
    }

    async function POST(
        url: string,
        body: object = {},
        headers: Headers = new Headers()
    ): Promise<Response> {
        headers.set("Authorization", `Bearer ${await getAccessToken()}`)

        if (headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json")
        }

        return fetch(`${baseUrl}${url}`, {
            method: "POST",
            body: body instanceof FormData ? body : JSON.stringify(body),
            headers: headers,
        })
    }

    async function PUT(
        url: string,
        body: object = {},
        headers: Headers = new Headers()
    ): Promise<Response> {
        headers.set("Authorization", `Bearer ${await getAccessToken()}`)

        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json")
        }

        return fetch(`${baseUrl}${url}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: headers,
        })
    }

    async function DELETE(
        url: string,
        body: object = {},
        headers: Headers = new Headers()
    ): Promise<Response> {
        headers.set("Authorization", `Bearer ${await getAccessToken()}`)

        if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json")
        }

        return fetch(`${baseUrl}${url}`, {
            method: "DELETE",
            body: JSON.stringify(body),
            headers: headers,
        })
    }

    function REVALIDATE(tag: string) {
        revalidateTag(baseUrl + tag)
    }

    return { GET, POST, PUT, DELETE, REVALIDATE: REVALIDATE }
}
