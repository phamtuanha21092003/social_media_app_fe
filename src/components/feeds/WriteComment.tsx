"use client"

import React from "react"
import Avatar from "antd/es/avatar/avatar"
import { useSelector } from "react-redux"
import { selectMe } from "@/stores/me/slice"
import Image from "next/image"
import { Button } from "antd"
import { addComment } from "@/actions/feed"

const WriteComment = ({ postId }: { postId: number }) => {
    const me = useSelector(selectMe)

    const [title, setTitle] = React.useState("")

    async function handleAddComment() {
        await addComment({ postId, title })

        setTitle("")
    }

    return (
        <div className="flex items-center justify-between">
            <Avatar
                src={
                    <Image
                        src={
                            me.avatar ||
                            "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                        }
                        width={40}
                        height={40}
                        alt="avatar"
                    />
                }
            />
            <input
                placeholder="Write a comment"
                className="rounded-3xl bg-[#f3f3f3] pr-[35px] pl-4 border-none text-[#000] text-[14px] cursor-pointer outline-none w-full h-10 max-w-[1240px]"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <div className="ml-">
                <Button
                    type="primary"
                    style={{
                        fontWeight: "400",
                    }}
                    disabled={title?.length === 0}
                    onClick={handleAddComment}
                >
                    Post
                </Button>
            </div>
        </div>
    )
}

export default WriteComment
