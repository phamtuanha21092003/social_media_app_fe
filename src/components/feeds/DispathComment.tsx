"use client"

import React from "react"
import { useDispatch } from "react-redux"
import { addComment } from "@/stores/comment/slice"

function DispatchComment({
    comments,
    postId,
    children,
}: {
    comments: { [replyId: number]: Comment[] }
    postId: number
    children: React.ReactNode
}) {
    const dispatch = useDispatch()

    dispatch(addComment({ comments }))

    return children
}

export default DispatchComment
