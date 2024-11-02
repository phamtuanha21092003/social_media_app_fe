"use server"

import { ApiProfile } from "@/apis/repositories"
import ClientProfile from "@/apis/client/ClientProfile"

export async function getMe() {
    const res = await ApiProfile.getMe()

    const me = await res.json()

    return me?.data
}

export async function updateMe(data: { name: string; avatar: string }) {
    const res = await ApiProfile.updateMe(data)

    const me = await res.json()

    return me?.message
}

export async function getFriendSuggestions(param: {
    page?: number
    perPage?: number
}) {
    const res = await ApiProfile.getFriendSuggestions(param)

    const data = await res.json()

    return [data.data, data.total]
}

export async function addFriend(targetID: number) {
    const res = await ApiProfile.addFriend(targetID)

    const data = await res.json()

    return data?.message
}

export async function getFriendships({
    statues = ["PENDING"],
    perPage = 6,
    page = 1,
    keyword,
}: {
    statues?: string[]
    perPage?: number
    page?: number
    keyword?: string
}) {
    const { data, total } = await ClientProfile.GET("/friendships", {
        status: statues,
        per_page: perPage,
        page: page,
        keyword: keyword,
    }).then((res) => res.json())

    return [data, total]
}

export async function confirmFriendship(creatorId: number) {
    const res = ClientProfile.POST("/friendships", {
        creator_id: creatorId,
    }).then((res) => {
        return res.json()
    })

    ClientProfile.REVALIDATE("/friendships")
    ClientProfile.REVALIDATE("/friend")

    return res
}

export async function deleteFriendship(creatorId: number) {
    const res = ClientProfile.DELETE("/friendships", {
        creator_id: creatorId,
    }).then((res) => {
        return res.json()
    })

    ClientProfile.REVALIDATE("/friendships")

    return res
}

export async function getFriends({
    page,
    perPage = 10,
    keyword,
}: {
    page: number
    perPage: number
    keyword?: string
}) {
    return ClientProfile.GET("/friends", {
        page: page,
        per_page: perPage,
        keyword,
    }).then((res) => res.json())
}
