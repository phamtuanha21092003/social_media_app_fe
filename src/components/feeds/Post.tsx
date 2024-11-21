import React from "react"
import { Avatar, message } from "antd"
import Image from "next/image"
import { CommentOutlined, HeartOutlined, HeartTwoTone } from "@ant-design/icons"
import { timeDeltaHumanize } from "@/utils/time"
import { savePost } from "@/actions/feed"

const Post = ({
    post,
    setPostId,
    likePost,
    setPosts,
}: {
    post: Post
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>
    setPostId: React.Dispatch<React.SetStateAction<number>>
    likePost: (postId: number) => void
}) => {
    function handleLikePost() {
        if (likePost && post.id) likePost(post.id)
    }

    async function handSavePost(postId: number) {
        if (postId) {
            const { is_saved } = await savePost(postId)

            if (setPosts) {
                setPosts((posts) => {
                    const postIndex = posts.findIndex(
                        (post) => post.id === postId
                    )

                    return posts.with(postIndex, {
                        ...posts[postIndex],
                        isSaved: is_saved,
                    })
                })
            }

            if (is_saved) {
                message.success("Post saved")
                return
            }

            message.success("Post unsaved")
        }
    }

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

                <div className="flex items-center gap-4">
                    <div>
                        <p className="text-[#9e9fa3]">
                            {timeDeltaHumanize(post.created)}
                        </p>
                    </div>
                    <div
                        className="cursor-pointer"
                        onClick={() => handSavePost(post.id ?? 0)}
                    >
                        {post.isSaved ? (
                            <Image
                                src={`/remove-tag.svg`}
                                alt="err"
                                height={24}
                                width={24}
                            />
                        ) : (
                            <Image
                                src={`/save.svg`}
                                alt="err"
                                height={24}
                                width={24}
                            />
                        )}
                    </div>
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
                <div className="cursor-pointer" onClick={handleLikePost}>
                    {post?.isLiked ? (
                        <HeartTwoTone twoToneColor={"red"} />
                    ) : (
                        <HeartOutlined />
                    )}
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
