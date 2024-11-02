"use server"

import { ApiFeed } from "@/apis/repositories"

export async function getPosts(page: number, perPage: number, userID?: number) {
    const res = await ApiFeed.getPosts(page, perPage, userID)

    const posts = await res.json()

    return [posts?.data?.map(ApiFeed.toEntityPost), posts.total]
}

export async function createPost(title: string, url?: string) {
    const res = await ApiFeed.createPost(title, url)

    const data = await res.json()

    return data.data
}

export async function getPost(postId: number) {
    const res = await ApiFeed.getPost(postId)

    const data = await res.json()

    return ApiFeed.toEntityPost(data.data)
}
