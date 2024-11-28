"use client"

import React from "react"
import { useSelector } from "react-redux"
import { selectReplies } from "@/stores/comment/slice"
import { RootState } from "@/stores"
import Comment from "@/components/feeds/Comment"

const Comments = ({
    replyId = null,
    postId,
}: {
    replyId: number | null
    postId: number
}) => {
    const comments = useSelector((state: RootState) =>
        selectReplies(state, replyId)
    )

    return (
        <div className="flex flex-col gap-4">
            {comments?.map((comment: Comment, index: number) => (
                <div key={`comment_${comment.id}_index_${index}`}>
                    <Comment comment={comment} postId={postId} />
                </div>
            ))}
        </div>
    )
}

export default Comments
