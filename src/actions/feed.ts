"use server"

import { ApiFeed } from "@/apis/repositories"
import ClientFeed from "@/apis/client/ClientFeed"

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

export async function likePost(postId: number) {
    const res = await ClientFeed.POST(`/posts/like/${postId}`).then((res) =>
        res.json()
    )

    ClientFeed.REVALIDATE("/posts")
    ClientFeed.REVALIDATE(`/post/${postId}`)

    return res
}

export async function getPostsLiked({
    page,
    perPage,
}: {
    page: number
    perPage: number
}) {
    const { data = [], total = 0 } = await ClientFeed.GET(`/posts/liked`, {
        page,
        per_page: perPage,
    }).then((res) => res.json())

    return [data?.map(ApiFeed.toEntityPost), total]
}

export async function savePost(postId: number) {
    const res = await ClientFeed.POST(`/posts/save/${postId}`).then((res) =>
        res.json()
    )

    ClientFeed.REVALIDATE("/posts")
    ClientFeed.REVALIDATE(`/post/${postId}`)

    return res
}

export async function getPostsSaved({
    page,
    perPage,
}: {
    page: number
    perPage: number
}) {
    const { data = [], total = 0 } = await ClientFeed.GET(`/posts/saved`, {
        page,
        per_page: perPage,
    }).then((res) => res.json())

    return [data?.map(ApiFeed.toEntityPost), total]
}
