"use server"

import ClientSearch from "@/apis/client/ClientSearch"

export async function search({
    page = 1,
    perPage = 10,
    type = "ALL",
    keyword,
}: {
    page: number
    perPage?: number
    type?: string
    keyword: string
}) {
    return ClientSearch.GET("/", {
        type: type,
        keyword: keyword ?? "",
        page: page,
        per_page: perPage,
    }).then((response) => response.json())
}
