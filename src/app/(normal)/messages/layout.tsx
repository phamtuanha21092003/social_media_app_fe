import React from "react"
import ClientMessage from "@/apis/client/ClientMessage"
import Emojis from "@/components/messages/Emojis"

async function MessageLayout({ children }: { children: React.ReactNode }) {
    const emojis = await ClientMessage.GET("/emojis")
        .then((response) => response.json())
        .then((data) => data.data)

    return <Emojis emoji={emojis}>{children}</Emojis>
}

export default MessageLayout
