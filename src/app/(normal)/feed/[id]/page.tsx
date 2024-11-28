import React from "react"
import { getPost } from "@/actions/feed"
import Post from "@/components/feeds/Post"
import WriteComment from "@/components/feeds/WriteComment"
import DispatchComment from "@/components/feeds/DispathComment"
import Comments from "@/components/feeds/Comments"

const Feed = async ({ params }: { params: { id: number } }) => {
    const { id } = params

    const post = await getPost(id)

    return (
        <DispatchComment
            comments={post.comments as { [replyId: number]: Comment[] }}
            postId={id}
        >
            <div className="mt-4 bg-white rounded-lg">
                <Post post={post} />

                <div className="p-4">
                    <WriteComment postId={id} />
                </div>

                <div className="p-4">
                    <Comments replyId={null} postId={post?.id || 0} />
                </div>
            </div>
        </DispatchComment>
    )
}

export default Feed
