import React from "react"
import { Avatar } from "antd"
import Image from "next/image"
import { CommentOutlined, HeartOutlined } from "@ant-design/icons"
import { timeDeltaHumanize } from "@/utils/time"

const Post = ({
    post,
    setPostId,
}: {
    post: Post
    setPostId: React.Dispatch<React.SetStateAction<number>>
}) => {
    return (
        <div className="p-4 bg-white rounded-lg flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Avatar
                        src={
                            <Image
                                src={
                                    post.avatar ||
                                    "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                                }
                                width={40}
                                height={40}
                                alt="avatar"
                            />
                        }
                    />
                    <div>
                        <p className="font-bold">{post.name}</p>
                    </div>
                </div>

                <div>
                    <p className="text-[#9e9fa3]">
                        {timeDeltaHumanize(post.created)}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {post?.url && (
                    <div className="flex items-center justify-center">
                        <Image
                            src={post.url}
                            alt="bug"
                            width={180}
                            height={100}
                        />
                    </div>
                )}
                <div>
                    <p className="text-lg">{post.title}</p>
                </div>
            </div>

            <div className="flex gap-2 items-center">
                <div>
                    <HeartOutlined />
                </div>
                <div>
                    <p>{post.likeCount} likes</p>
                </div>
                <div className="ml-4">
                    <CommentOutlined
                        onClick={() => {
                            if (post.id) {
                                setPostId(post.id)
                            }
                        }}
                    />
                </div>
                <div>{post.commentCount} comments</div>
            </div>
        </div>
    )
}

export default Post
