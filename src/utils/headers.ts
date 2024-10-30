import { headers } from "next/headers"

export function getPathNameServerComponent(): string | null {
    const heads = headers()

    return heads.get("x-pathname")
}
