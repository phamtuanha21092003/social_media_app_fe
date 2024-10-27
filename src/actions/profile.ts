"use server"

import { ApiProfile } from "@/apis/repositories"
import { revalidateTag } from "next/cache"

export async function getMe() {
    const res = await ApiProfile.getMe()

    const me = await res.json()

    return me?.data
}

export async function updateMe(data: { name: string; avatar: string }) {
    const res = await ApiProfile.updateMe(data)

    const me = await res.json()

    if (me?.message === "Updated successfully") {
        revalidateTag("/me")
    }

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

    if (data?.message === "Add friend successfully") {
        revalidateTag(`/friend_suggestions`)
    }

    return data?.message
}
