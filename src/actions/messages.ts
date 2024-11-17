"use server"

import ClientMessage from "@/apis/client/ClientMessage"

export async function getConversations() {
    const { data } = await ClientMessage.GET("/conversations").then((res) =>
        res.json()
    )

    return data
}

// TODO: add paging to this api
export async function getConversation(conversationId: number) {
    const res = await ClientMessage.GET(`/messages/${conversationId}`, {})
        .then((res) => res.json())
        .then((data) => ({
            name: data.name,
            avatar: data.avatar,
            messages: data.messages?.map((message: any) => ({
                ...message,
                creatorId: message.creator_id,
            })),
            lastLogin: data.last_login,
            isActive: data.is_active,
            userId: data.user_id,
        }))

    return res
}

export async function sendMessage(conversationId: number, content: string) {
    const res = await ClientMessage.POST(`/messages/${conversationId}`, {
        content: content,
    }).then((res) => res.json())

    ClientMessage.REVALIDATE(`/messages/${conversationId}`)
    ClientMessage.REVALIDATE("/conversations")

    return res
}

export async function deleteMessage(messageId: number) {
    const res = await ClientMessage.DELETE(
        `/messages/${messageId}/delete`
    ).then((res) => res.json())

    ClientMessage.REVALIDATE(`/messages/${messageId}`)
    ClientMessage.REVALIDATE("/conversations")

    return res
}
