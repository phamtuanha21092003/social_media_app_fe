"use client"

import React from "react"
import { useDispatch } from "react-redux"
import { initEmoji } from "@/stores/emoji/slice"

function Emojis({
    emoji,
    children,
}: {
    emoji: { [key: string]: string }
    children: React.ReactNode
}) {
    const dispatch = useDispatch()

    dispatch(initEmoji(emoji))

    return children
}

export default React.memo(Emojis)
