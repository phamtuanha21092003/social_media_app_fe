interface Post {
    id?: number
    title: string
    url: string
    commentCount: number
    likeCount: number
    comments?: { [key: number | null]: Comment[] }
    avatar?: string
    accountUserId?: int
    name?: string
    created: string
    isLiked?: boolean
    isSaved?: boolean
    status?: string
    userId?: number
}

interface Comment {
    id?: number
    postId?: number
    title: string
    replyCount: number
    created: string
    accountUserId?: int
}
