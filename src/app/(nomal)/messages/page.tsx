"use client"

import React from "react"
import {
    getConversations,
    getConversation,
    sendMessage,
    deleteMessage,
    updateEmoji,
} from "@/actions/messages"
import { useEffectAfterMount } from "@/hooks"
import { timeDeltaHumanize, formatTime } from "@/utils/time"
import Image from "next/image"
import Link from "next/link"
import {
    DeleteOutlined,
    FrownOutlined,
    RightCircleTwoTone,
} from "@ant-design/icons"
import { selectMe } from "@/stores/me/slice"
import { useSelector } from "react-redux"
import { message, Popover } from "antd"
import { selectEmoji, selectEmojis } from "@/stores/emoji/slice"

function Messages() {
    const me = useSelector(selectMe)

    const [conversations, setConversations] = React.useState([])

    const containerRef = React.useRef<HTMLDivElement>(null)

    const [conversationId, setConversationId] = React.useState<number>(0)

    const [conversation, setConversation] = React.useState<{
        name: string
        avatar: string
        messages: any[]
        lastLogin: boolean | null
        isActive: boolean | null
        userId: number | null
    }>({
        name: "",
        avatar: "",
        messages: [],
        lastLogin: null,
        isActive: false,
        userId: null,
    })

    async function fetchConversations() {
        const data = await getConversations()

        const conversationId = data[0].id

        setConversationId(conversationId)

        setConversations(data)
    }

    useEffectAfterMount(fetchConversations)

    async function fetchConversation() {
        if (conversationId === 0) {
            return
        }

        const data = await getConversation(conversationId)

        setConversation((preState) => ({
            ...preState,
            ...data,
            messages: [...(data?.messages || [])],
        }))
    }

    useEffectAfterMount(fetchConversation, [conversationId])

    function handClickConversation(_conversationId: number) {
        if (_conversationId === conversationId) {
            return
        }

        setConversationId(_conversationId)
        setConversation({
            name: "",
            avatar: "",
            messages: [],
            lastLogin: null,
            isActive: false,
            userId: null,
        })
    }

    const [content, setContent] = React.useState("")

    async function handleSendMessage(content: string) {
        const res = await sendMessage(conversationId, content)

        if (res.message === "success") {
            setContent("")
            fetchConversation()
            fetchConversations()
        }
    }

    const refEndMessage = React.useRef<HTMLDivElement>(null)
    const refContainer = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (refEndMessage.current && conversation.messages.length > 0) {
            refEndMessage.current?.scrollIntoView({
                behavior: "instant",
                block: "start",
            })
        }
    }, [conversation])

    async function handleDeleteMessage(messageId: number) {
        const res = await deleteMessage(messageId)

        if (res.message === "success") {
            message.success("Message deleted successfully")
            fetchConversation()
            fetchConversations()
        }
    }

    async function handleUpdateEmoji(messageId: number, emojiId: number) {
        const res = await updateEmoji(messageId, emojiId)

        if (res.message === "success") {
            message.success("Emoji updated successfully")
            fetchConversation()
            fetchConversations()
        }
    }

    return (
        <div
            className={`mt-4 relative h-[calc(100vh_-_80px)]`}
            ref={containerRef}
        >
            <div className="bg-white h-full overflow-y-auto absolute top-0 bottom-0 w-[360px] left-0 rounded-lg">
                {conversations?.map((conversation: any, index) => (
                    <div
                        key={`conversation_${conversation?.id}_${index}`}
                        className="flex gap-4 m-4 hover:bg-slate-200 rounded-lg p-2 cursor-pointer"
                        onClick={() => handClickConversation(conversation.id)}
                    >
                        <div>
                            <Image
                                src={conversation.avatar}
                                alt="err"
                                height={56}
                                width={56}
                                className="rounded-full"
                            />
                        </div>
                        <div>
                            <div className="font-bold text-lg">
                                {conversation.name}
                            </div>
                            <div className="text-[#65686c] text-sm flex items-center gap-2">
                                <span
                                    className=""
                                    style={{ wordWrap: "break-word" }}
                                >
                                    {conversation.content.length > 14
                                        ? `${conversation.content.substring(
                                              0,
                                              14
                                          )} ...`
                                        : conversation.content}
                                </span>
                                {"    "}
                                <span>
                                    {timeDeltaHumanize(conversation.created)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="ml-[380px] relative bg-white h-full rounded-lg">
                <div className="sticky top-0 right-0 left-0 flex items-center shadow-[0_0_4px_#0003] py-3 px-4 rounded-lg gap-4 z-[99999] bg-white">
                    <Link href={`/profile/${conversation.userId}`}>
                        <Image
                            src={
                                conversation.avatar ||
                                "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                            }
                            alt="err"
                            height={56}
                            width={56}
                            className="rounded-full"
                        />
                    </Link>
                    <div>
                        <div className="font-bold text-lg">
                            {conversation.name}
                        </div>
                        <div>{conversation.isActive && "Active Now"}</div>
                    </div>
                </div>
                <div
                    ref={refContainer}
                    className="overflow-y-auto flex flex-col-reverse p-4 gap-2"
                >
                    <div ref={refEndMessage}></div>
                    {conversation.messages.map((message, index) => (
                        <Message
                            key={`message_in_${index}_mess_${message.id}`}
                            message={message}
                            handleDeleteMessage={handleDeleteMessage}
                            handleUpdateEmoji={handleUpdateEmoji}
                            me={me}
                        />
                    ))}
                </div>
                <div className="sticky bottom-0 right-0 left-0 flex items-center px-2 gap-4 bg-white z-auto pb-2">
                    <div className="flex-1 rounded-3xl">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full border-0 p-2 rounded-3xl focus:outline-none  bg-[#f0f2f5]"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div
                        className="cursor-pointer"
                        onClick={() => handleSendMessage(content)}
                    >
                        <RightCircleTwoTone style={{ fontSize: "28px" }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages

function Message({
    me,
    message,
    handleDeleteMessage,
    handleUpdateEmoji,
}: {
    me: any
    message: any
    handleDeleteMessage: (messageId: number) => void
    handleUpdateEmoji: (messageId: number, emojiId: number) => void
}) {
    const emojis = useSelector(selectEmojis)

    const emoji = useSelector((state: any) =>
        selectEmoji(state, message.emojiId)
    )

    const [isMountOver, setIsMountOver] = React.useState<boolean>(false)

    return (
        <div
            className={`w-full flex max-w-md cursor-pointer ${
                me.id === message.creatorId
                    ? "justify-end ml-auto"
                    : "justify-start items-center gap-1"
            }`}
            onMouseOver={() => setIsMountOver(true)}
            onMouseLeave={() => setIsMountOver(false)}
        >
            {me.id !== message.creatorId && (
                <div>
                    <Image
                        src={message.avatar}
                        alt="err"
                        height={40}
                        width={40}
                        className="object-cover rounded-full"
                    />
                </div>
            )}
            <div
                className={`flex items-center gap-4 ${
                    me.id !== message.creatorId && "flex-row-reverse"
                }`}
            >
                {isMountOver && message.status !== "DELETED" && (
                    <div className="flex items-center gap-2">
                        {message.creatorId !== me.id ? (
                            <Popover
                                title={null}
                                placement="top"
                                content={
                                    <div className="flex gap-2 flex-wrap w-[288px] justify-center">
                                        {emojis.map((emoji) => (
                                            <div
                                                key={`emoji_${emoji.id}`}
                                                className={`cursor-pointer rounded hover:bg-[#caccd0] ${
                                                    message.emojiId ===
                                                        emoji.id &&
                                                    "bg-[#caccd0]"
                                                }`}
                                                onClick={() =>
                                                    handleUpdateEmoji(
                                                        message.id,
                                                        +emoji.id
                                                    )
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
                                <FrownOutlined />
                            </Popover>
                        ) : (
                            <DeleteOutlined
                                onClick={() => handleDeleteMessage(message.id)}
                            />
                        )}
                    </div>
                )}
                <div className="mt-2 overflow-x-visible">
                    <div
                        className={`py-2 px-3 rounded-2xl flex relative overflow-x-visible ${
                            me.id === message.creatorId
                                ? "justify-end bg-[#3373ff] text-white "
                                : "bg-[#f0f0f0]"
                        } ${
                            message.status === "DELETED" && "italic opacity-30"
                        }`}
                    >
                        {message.content}
                        {emoji && (
                            <div
                                className="absolute bottom-0 right-0 p-[2px] bg-white translate-y-2 rounded-full cursor-pointer"
                                onClick={() =>
                                    handleUpdateEmoji(
                                        message.id,
                                        message.emojiId
                                    )
                                }
                            >
                                <Image
                                    alt="err"
                                    src={emoji}
                                    height={16}
                                    width={16}
                                />
                            </div>
                        )}
                    </div>
                    <div
                        className={`text-xs text-[#6b7280] leading-none ${
                            emoji ? "mt-2" : "mt-1"
                        }`}
                    >
                        {timeDeltaHumanize(message.created)}
                    </div>
                </div>
            </div>
        </div>
    )
}
