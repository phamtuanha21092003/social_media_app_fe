"use server"

import { ApiCommon } from "@/apis/repositories"

export async function upload(data: FormData) {
    const res = await ApiCommon.upload(data)

    const upload = await res.json()

    return upload?.urls
}
