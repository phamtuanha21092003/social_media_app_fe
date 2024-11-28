import React from "react"
import ClientMessage from "@/apis/client/ClientMessage"
import DispatchEmojis from "@/components/emojis"

async function DetailFeedLayout({ children }: { children: React.ReactNode }) {
    const emojis = await ClientMessage.GET("/emojis", { is_detail_post: true })
        .then((response) => response.json())
        .then((data) => data.data)

    return <DispatchEmojis emojis={emojis}>{children}</DispatchEmojis>
}

export default DetailFeedLayout
