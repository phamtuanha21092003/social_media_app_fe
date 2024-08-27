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
