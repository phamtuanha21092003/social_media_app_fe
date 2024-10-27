import Client from "@/apis/client/ClientFeed"

const getPosts = (page: number, perPage: number, userID?: number) => {
    return Client.GET("/posts", { page, per_page: perPage, user_id: userID })
}

const createPost = (title: string, url?: string) => {
    return Client.POST("/posts", { url, title })
}

const getPost = (postId: number) => {
    return Client.GET(`/post/${postId}`)
}

const toEntityPost = (post: any) => ({
    id: post.id,
    title: post.title,
    avatar: post.avatar,
    url: post.url,
    commentCount: post.comment_count,
    // TODO: remove || 0 next line
    likeCount: post.like_count || 0,
    created: post.created,
})

const RepoFeed = { getPosts, createPost, getPost, toEntityPost }

export default RepoFeed
