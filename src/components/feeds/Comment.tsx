import React from "react"
import Comments from "@/components/feeds/Comments"
import Avatar from "antd/es/avatar/avatar"
import Image from "next/image"
import { timeDeltaHumanize } from "@/utils/time"
import { useSelector } from "react-redux"
import { selectMe } from "@/stores/me/slice"
import { Button, Popover } from "antd"
import {
    addComment,
    editComment,
    deleteComment,
    updateEmojiComment,
    deleteEmojiComment,
} from "@/actions/feed"
import { CloseOutlined } from "@ant-design/icons"
import { selectEmojisDetailPost } from "@/stores/emoji/slice"

const emojiComment = {
    "21": { label: "angry", style: { color: "rgb(233, 113, 15)" } },
    "31": { label: "care", style: { color: "rgb(226 175 53)" } },
    "32": { label: "like", style: { color: "rgb(8, 102, 255)" } },
    "33": { label: "dislike", style: { color: "black" } },
    "34": { label: "love", style: { color: "rgb(243, 62, 88)" } },
    null: { label: "like", style: {} },
}

const Comment = ({ comment, postId }: { comment: Comment; postId: number }) => {
    const me = useSelector(selectMe)

    const emojis = useSelector(selectEmojisDetailPost)

    const [isReplying, setIsReplying] = React.useState(false)

    const [isEditing, setIsEditing] = React.useState(false)

    const [titleEditing, setTitleEditing] = React.useState("")

    const [title, setTitle] = React.useState("")

    const [isHiddenReply, setIsHiddenReply] = React.useState(false)

    async function handleAddComment() {
        await addComment({ postId, title, replyId: comment.id })

        setTitle("")
        setIsReplying(false)
    }

    async function handleEditComment(e: any) {
        e.preventDefault()

        await editComment({
            postId,
            title: titleEditing,
            commentId: comment.id || 0,
        })

        setIsEditing(false)
    }

    async function handleDeleteComment(e: any) {
        e.preventDefault()

        await deleteComment({ postId, commentId: comment.id || 0 })
    }

    async function handleUpdateEmoji(emojiId: number) {
        await updateEmojiComment({
            postId: postId,
            commentId: comment?.id || 0,
            emojiId: emojiId,
        })
    }

    async function handleDeleteEmoji() {
        await deleteEmojiComment({
            commentId: comment?.id || 0,
            postId: postId,
        })
    }

    return (
        <div className="flex gap-4">
            <div>
                <Avatar
                    src={
                        <Image
                            src={
                                comment.avatar ||
                                "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                            }
                            width={40}
                            height={40}
                            alt="avatar"
                        />
                    }
                />
            </div>
            <div className="flex-1">
                <div className="flex gap-2 items-center">
                    <div className="font-bold text-lg">{comment.name}</div>
                    <div>{timeDeltaHumanize(comment.created)}</div>
                </div>
                <div className="text-[14px] leading-[20px]">
                    {isEditing ? (
                        <input
                            placeholder="Write a comment"
                            className="rounded-3xl bg-[#f3f3f3] pr-[35px] pl-4 border-none text-[#000] text-[14px] cursor-text outline-none h-10 w-full"
                            value={titleEditing}
                            onChange={(e) => setTitleEditing(e.target.value)}
                        />
                    ) : (
                        comment.title
                    )}
                </div>

                <div className="flex text-[#65686c] items-center gap-2">
                    {comment.userId !== me.id ? (
                        <>
                            <a
                                className="cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setIsReplying(true)
                                }}
                            >
                                reply
                            </a>

                            <Popover
                                title={null}
                                placement="top"
                                content={
                                    <div className="flex gap-2 flex-wrap w-[196x] justify-center">
                                        {emojis.map((emoji) => (
                                            <div
                                                key={`emoji_${emoji.id}`}
                                                className={`cursor-pointer rounded hover:bg-[#caccd0] ${
                                                    comment.emojiId ===
                                                        +emoji.id &&
                                                    "bg-[#caccd0]"
                                                }`}
                                                onClick={() =>
                                                    handleUpdateEmoji(+emoji.id)
                                                }
                                            >
                                                <Image
                                                    src={emoji.url}
                                                    alt="err"
                                                    height={32}
                                                    width={32}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                }
                            >
                                <a
                                    style={
                                        emojiComment?.[
                                            comment?.emojiId?.toString() || null
                                        ]?.style || {}
                                    }
                                    className="hover:underline cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault()

                                        if (comment?.emojiId) {
                                            handleDeleteEmoji()

                                            return
                                        }

                                        handleUpdateEmoji(32)
                                    }}
                                >
                                    {
                                        emojiComment?.[
                                            comment?.emojiId?.toString() || null
                                        ].label
                                    }
                                </a>
                            </Popover>
                        </>
                    ) : !isEditing ? (
                        <a
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault()
                                setIsEditing(true)
                                setTitleEditing(comment.title)
                            }}
                        >
                            edit
                        </a>
                    ) : (
                        <>
                            <a
                                className="cursor-pointer"
                                onClick={handleEditComment}
                            >
                                save
                            </a>
                            <a
                                className="cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setIsEditing(false)
                                }}
                            >
                                cancel
                            </a>
                        </>
                    )}

                    {comment.userId === me.id && (
                        <a
                            className="cursor-pointer"
                            onClick={handleDeleteComment}
                        >
                            delete
                        </a>
                    )}
                </div>

                {isReplying && (
                    <div className="flex items-center justify-between gap-3">
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
                        <div className="flex-1 mt-1 relative">
                            <input
                                placeholder="Write a comment"
                                className="rounded-3xl bg-[#f3f3f3] pr-[35px] pl-4 border-none text-[#000] text-[14px] cursor-text outline-none h-10 w-full"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <a
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault()

                                    setIsReplying(false)
                                }}
                            >
                                <CloseOutlined style={{ fontSize: "18px" }} />
                            </a>
                        </div>
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
                )}

                {comment.replyCount > 0 && isHiddenReply ? (
                    <a
                        onClick={(e) => {
                            e.preventDefault()

                            setIsHiddenReply(false)
                        }}
                        className="underline text-[#65686c] cursor-pointer"
                    >
                        See all comment
                    </a>
                ) : (
                    <div className="flex mt-1">
                        <button
                            className="border-none outline-none w-[15px] -translate-x-1/2 p-0 bg-[#9ca1de]"
                            onClick={() => setIsHiddenReply(true)}
                        ></button>
                        <div className="flex-1 pl-4">
                            <Comments
                                postId={postId}
                                replyId={comment.id || 0}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Comment
