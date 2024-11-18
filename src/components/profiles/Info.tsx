"use client"

import React from "react"
import Image from "next/image"
import { useSelector } from "react-redux"
import { selectMe } from "@/stores/me/slice"
import { Button, Dropdown, message } from "antd"
import type { MenuProps, DropdownProps } from "antd"
import {
    confirmFriendship,
    cancelFriendship,
    addFriend,
    deleteFriend,
} from "@/actions/profile"
import { getOrCreateConversation } from "@/actions/messages"
import { UsergroupDeleteOutlined } from "@ant-design/icons"
import { useRouter } from "next/navigation"

const items: MenuProps["items"] = [
    {
        label: (
            <a>
                <UsergroupDeleteOutlined />
                <span>Unfriend</span>
            </a>
        ),
        key: "0",
    },
]

const Info = ({ profile }: { profile: any }) => {
    const me = useSelector(selectMe)

    const router = useRouter()

    async function handleConfirm(creatorId: number) {
        const { message: resMessage } = await confirmFriendship(creatorId)

        if (resMessage === "Friendship has been accepted") {
            message.success(resMessage)
        }
    }

    async function handleCancel(targetId: number) {
        const { message: resMessage } = await cancelFriendship(targetId)

        if (resMessage === "success") {
            message.success("Cancelled successfully!")
        }
    }

    async function handleAddFriend(targetId: number) {
        const res = await addFriend(targetId)
        if (res === "Add friend successfully") {
            message.success("Added friend successfully")
        }
    }

    const [openDropdown, setOpenDropdown] = React.useState(false)

    const handleOpenChangeDropdown: DropdownProps["onOpenChange"] = (
        nextOpen,
        info
    ) => {
        if (info.source === "trigger" || nextOpen) {
            setOpenDropdown(nextOpen)
        }
    }

    const handleMenuClick: MenuProps["onClick"] = async (e) => {
        if (e.key === "0") {
            const { message: resMessage } = await deleteFriend(
                profile.friend_id
            )

            if (resMessage === "success") {
                message.success("Delete friend successfully")
            }

            setOpenDropdown(false)
        }
    }

    async function handleGetOrCreateConversation(userId: number) {
        console.log("click")
        const { id } = await getOrCreateConversation(userId)
        console.log(id, "id")

        router.push(`/messages?c=${id}`)
    }

    return (
        <div className="">
            <div className="bg-white p-4 flex flex-col items-center gap-2 rounded-lg relative">
                <div className="flex justify-center">
                    <Image
                        className="object-cover"
                        src={
                            (profile ? profile.avatar : me.avatar) ||
                            "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                        }
                        alt="avatar"
                        height={200}
                        width={200}
                    />
                </div>
                <div className="mx-auto">
                    <p>{profile ? profile.name : me.name}</p>
                </div>
                {profile && (
                    <div>
                        {profile?.is_sent_request ? (
                            profile?.from_id == me.id ? (
                                <div className="flex gap-4 mt-2">
                                    <Button
                                        type="primary"
                                        onClick={() => handleCancel(profile.id)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            handleGetOrCreateConversation(
                                                profile.id
                                            )
                                        }
                                    >
                                        Message
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-4 mt-2">
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            handleConfirm(profile.id)
                                        }
                                    >
                                        Confirm
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            handleGetOrCreateConversation(
                                                profile.id
                                            )
                                        }
                                        type="primary"
                                    >
                                        Message
                                    </Button>
                                </div>
                            )
                        ) : profile?.is_friend ? (
                            <div className="flex gap-4 mt-2">
                                <Dropdown
                                    menu={{ items, onClick: handleMenuClick }}
                                    trigger={["click"]}
                                    placement="bottom"
                                    onOpenChange={handleOpenChangeDropdown}
                                    open={openDropdown}
                                >
                                    <Button
                                        onClick={() =>
                                            handleConfirm(profile.id)
                                        }
                                        style={{ backgroundColor: "#e4e6ea" }}
                                    >
                                        Friends
                                    </Button>
                                </Dropdown>
                                <Button
                                    type="primary"
                                    onClick={() =>
                                        handleGetOrCreateConversation(
                                            profile.id
                                        )
                                    }
                                >
                                    Message
                                </Button>
                            </div>
                        ) : (
                            <div className="flex gap-4 mt-2">
                                <Button
                                    onClick={() => handleAddFriend(profile.id)}
                                    type="primary"
                                >
                                    Add friend
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() =>
                                        handleGetOrCreateConversation(
                                            profile.id
                                        )
                                    }
                                >
                                    Message
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Info
