"use client"

import React from "react"
import { Avatar, Button, MenuProps, message, Input } from "antd"
import Image from "next/image"
import {
    CommentOutlined,
    EyeInvisibleOutlined,
    HeartOutlined,
    HeartTwoTone,
} from "@ant-design/icons"
import { timeDeltaHumanize } from "@/utils/time"
import {
    savePost,
    updatePost,
    likePost as likePostAction,
} from "@/actions/feed"
import { upload } from "@/actions/common"
import { useSelector } from "react-redux"
import { selectMe } from "@/stores/me/slice"
import { Dropdown } from "antd"
import Link from "next/link"

const { TextArea } = Input

const Post = ({
    post,
    likePost = async (postId: number) => {
        await likePostAction(postId)
    },
    setPosts,
}: {
    post: Post
    setPosts?: React.Dispatch<React.SetStateAction<Post[]>>
    setPostId?: React.Dispatch<React.SetStateAction<number>>
    likePost?: (postId: number) => void
}) => {
    const me = useSelector(selectMe)

    const [isOverPost, setIsOverPost] = React.useState(false)

    const [isEditing, setIsEditing] = React.useState(false)

    const refInputFile = React.useRef<HTMLInputElement>(null)

    const [postEditing, setPostEditing] = React.useState<Post>()

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

    async function handleDeletePost(postId: number) {
        if (postId) {
            const { message: resMessage } = await updatePost({
                postId,
                status: "DELETED",
            })

            if (resMessage === "success") {
                message.success("Post deleted")

                if (setPosts)
                    setPosts((posts) => {
                        const postIndex = posts.findIndex(
                            (post) => post.id === postId
                        )

                        return posts.toSpliced(postIndex, 1)
                    })

                return
            }

            message.error("Failed to delete post")
        }
    }

    async function handleToggleIsPrivatePost(postId: number) {
        if (postId) {
            const { message: resMessage, status: resStatus } = await updatePost(
                {
                    postId,
                    status: post.status === "PRIVATE" ? "ACTIVE" : "PRIVATE",
                }
            )

            if (resMessage === "success") {
                message.success("Change status successfully")

                if (setPosts)
                    setPosts((posts) => {
                        const postIndex = posts.findIndex(
                            (post) => post.id === postId
                        )

                        return posts.with(postIndex, {
                            ...posts[postIndex],
                            status: resStatus,
                        })
                    })

                return
            }

            message.error("Failed update status Post")
        }
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const file = e.target.files[0]

            const formData = new FormData()

            formData.append("files", file)

            const urls: string[] = await upload(formData)

            if (urls.length > 0) {
                setPostEditing((post) => ({ ...post, url: urls[0] } as Post))
            }
        }
    }

    async function handleUpdatePost() {
        if (postEditing?.title && postEditing?.id) {
            const { message: resMessage } = await updatePost({
                postId: postEditing.id,
                title: postEditing.title,
                url: postEditing.url,
            })

            if (resMessage === "success") {
                message.success("Update post successfully")

                if (setPosts)
                    setPosts((posts) => {
                        const postIndex = posts.findIndex(
                            (post) => post.id === post.id
                        )

                        return posts.with(postIndex, { ...postEditing })
                    })

                setIsEditing(false)

                return
            }

            message.error("Failed update post")
        }
    }

    return (
        <div
            className="p-4 bg-white rounded-lg flex flex-col gap-4"
            onMouseOver={() => setIsOverPost(true)}
            onMouseLeave={() => setIsOverPost(false)}
        >
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
                    <input
                        type="file"
                        hidden
                        ref={refInputFile}
                        accept="image/jpeg, image/png, image/jpg, image/gif, image/jp2, image/webp"
                        onChange={handleUpload}
                    />

                    <div>
                        <p className="font-bold">{post.name}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {!isEditing ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <Button type="primary" onClick={handleUpdatePost}>
                                Save
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsEditing(false)
                                }}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center">
                    {isEditing ? (
                        postEditing?.url ? (
                            <Image
                                src={postEditing.url}
                                alt="bug"
                                width={180}
                                height={100}
                                onClick={() => {
                                    if (isEditing) {
                                        refInputFile.current?.click()
                                    }
                                }}
                            />
                        ) : (
                            <Button
                                className="bg-[#566070] text-white px-4 py-2"
                                onClick={() => refInputFile.current?.click()}
                            >
                                Attach Image
                            </Button>
                        )
                    ) : (
                        post?.url && (
                            <Image
                                src={post.url}
                                alt="bug"
                                width={180}
                                height={100}
                            />
                        )
                    )}
                </div>
                <div>
                    {!isEditing ? (
                        <p className="text-lg">{post.title}</p>
                    ) : (
                        <TextArea
                            rows={8}
                            placeholder="What are you think about?"
                            value={postEditing?.title || ""}
                            onChange={(e) =>
                                setPostEditing(
                                    (post) =>
                                        ({
                                            ...post,
                                            title: e.target.value,
                                        } as Post)
                                )
                            }
                        />
                    )}
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
                <Link href={`/feed/${post.id}`} className="ml-4">
                    <CommentOutlined />
                </Link>
                <Link href={`/feed/${post.id}`}>
                    {post.commentCount} comments
                </Link>
                {post.status === "PRIVATE" && (
                    <>
                        <div className="ml-4">
                            <EyeInvisibleOutlined />
                        </div>
                        <div>Is Private</div>
                    </>
                )}
                {isOverPost && me.id === post.userId && (
                    <div className="flex-1 flex justify-end">
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: "1",
                                        label: (
                                            <a
                                                onClick={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                Delete Post
                                            </a>
                                        ),
                                        onClick: () => {
                                            if (post.id) {
                                                handleDeletePost(post.id)
                                            }
                                        },
                                    },
                                    {
                                        key: "2",
                                        label: (
                                            <a
                                                onClick={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                Set
                                                {post.status === "ACTIVE"
                                                    ? " Private"
                                                    : " Active"}
                                            </a>
                                        ),
                                        onClick: () => {
                                            if (post.id) {
                                                handleToggleIsPrivatePost(
                                                    post.id
                                                )
                                            }
                                        },
                                    },
                                    {
                                        key: "3",
                                        label: (
                                            <a
                                                onClick={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                Edit
                                            </a>
                                        ),
                                        onClick: () => {
                                            if (post.id) {
                                                setPostEditing(post)
                                                setIsEditing(true)
                                            }
                                        },
                                    },
                                ] as MenuProps["items"],
                            }}
                            placement="bottom"
                        >
                            <Image
                                src={"/dot-dot-dot.svg"}
                                width={20}
                                height={20}
                                alt="err"
                                className="cursor-pointer"
                            />
                        </Dropdown>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Post
