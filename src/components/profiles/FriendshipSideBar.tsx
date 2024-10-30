"use client"

import React from "react"
import Image from "next/image"
import { Button, message } from "antd"
import Link from "next/link"
import {
    confirmFriendship,
    deleteFriendship,
    getFriendships,
} from "@/actions/profile"
import { useEffectAfterMount } from "@/hooks"
import { usePathname } from "next/navigation"

const FriendshipSideBar = (props: { userId: any }) => {
    const pathname = usePathname()

    const { userId } = props

    const [friendships, setFriendships] = React.useState([])

    const [total, setTotal] = React.useState(0)

    async function fetchFriendships() {
        const [friendships, total] = await getFriendships({})

        setFriendships(friendships)
        setTotal(total)
    }

    useEffectAfterMount(fetchFriendships, [])

    return (
        friendships.length > 0 &&
        pathname?.split("/").at(-1) !== "friendships" && (
            <div className="bg-white p-4 rounded-lg relative mt-8">
                <div className="flex justify-between items-center">
                    <div className="font-bold text-lg">Friendships</div>
                    <Link href={`/profile/${userId}/friendships`}>
                        See all friendships
                    </Link>
                </div>
                <div className="text-[#65676b]">{total} Friendships</div>
                <div className="flex flex-col mt-2">
                    {friendships?.map((friendship: any, index: number) => {
                        return (
                            <Friendship
                                key={`friendship_${friendship.id}_i_$${index}`}
                                friendship={friendship}
                                fetchFriendships={fetchFriendships}
                            />
                        )
                    })}
                </div>
            </div>
        )
    )
}

export default FriendshipSideBar

export function Friendship({
    friendship,
    fetchFriendships,
}: {
    friendship: any
    fetchFriendships: any
}) {
    async function handleConfirm(creatorId: number) {
        const { message: resMessage } = await confirmFriendship(creatorId)

        if (resMessage === "Friendship has been accepted") {
            message.success(resMessage)
        }

        fetchFriendships()
    }

    async function handleDelete(creatorId: number) {
        const { message: resMessage } = await deleteFriendship(creatorId)

        if (resMessage === "success") {
            message.success("Friendship has been deleted")
        }

        fetchFriendships()
    }

    return (
        <div className="flex items-center gap-4">
            <div className="rounded-full">
                <Image
                    src={
                        friendship.avatar ||
                        "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                    }
                    alt="err"
                    height={60}
                    width={60}
                />
            </div>
            <div className="flex-1">
                <div>{friendship.name}</div>
                <div className="flex gap-4 mt-2">
                    <Button
                        type="primary"
                        onClick={() => handleConfirm(friendship.id)}
                    >
                        Confirm
                    </Button>
                    <Button onClick={() => handleDelete(friendship.id)}>
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    )
}
