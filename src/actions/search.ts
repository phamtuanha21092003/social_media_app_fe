"use server"

import ClientSearch from "@/apis/client/ClientSearch"

export async function search({
    type = "ALL",
    keyword,
}: {
    type?: string
    keyword: string
}) {
    return await ClientSearch.GET("/", { type: type, keyword: keyword }).then(
        (response) => response.json()
    )
}
