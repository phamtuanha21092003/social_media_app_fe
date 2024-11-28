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

const toEntityComment = (comment: any) => {
    return {
        id: comment.id,
        title: comment.title,
        replyCount: comment.reply_count,
        created: comment.created,
        avatar: comment.avatar,
        name: comment.name,
        userId: comment.account_user_id,
    }
}

const toEntityPost = (post: any) => {
    const result = {
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
    } as Post

    if (post.comments) {
        const comments = post.comments

        const keyCommentReplies = post.key_comments

        keyCommentReplies.forEach((key: any) => {
            const commentReplies = post.comments[key]

            comments[key] = commentReplies?.map(toEntityComment)
        })

        result.comments = comments
    }

    return result
}

const RepoFeed = { getPosts, createPost, getPost, toEntityPost }

export default RepoFeed
