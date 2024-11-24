import Client from "@/apis/client/ClientFeed"

const getPosts = (page: number, perPage: number, userID?: number) => {
    return Client.GET("/posts", { page, per_page: perPage, user_id: userID })
}

const createPost = (
    title: string,
    url?: string,
    isPrivate: boolean = false
) => {
    const res = Client.POST("/posts", { url, title, is_private: isPrivate })

    Client.REVALIDATE("/posts")

    return res
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
    name: post.name,
    likeCount: post.like_count,
    created: post.created,
    isLiked: post.is_liked,
    isSaved: post.is_saved,
    status: post.status,
    userId: post.account_user_id,
})

const RepoFeed = { getPosts, createPost, getPost, toEntityPost }

export default RepoFeed
