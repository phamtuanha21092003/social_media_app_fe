import React from "react"
import { getUserId } from "@/actions/auth"
import Image from "next/image"
import Info from "@/components/profiles/Info"
import Client from "@/apis/client/ClientProfile"
import Link from "next/link"

const layout = async ({
    children,
    params,
}: {
    children: React.ReactNode
    params: { id: string }
}) => {
    const userId = await getUserId()

    const { id } = params

    const { data: profile } = await Client.GET(`/${id}`).then((res) =>
        res.json()
    )

    const { total: totalFriends, data: friends } = await Client.GET(
        "/friends",
        {
            per_page: 9,
        }
    ).then((res) => res.json())

    return (
        <div className="grid grid-cols-4 mt-4 gap-4">
            <div>
                <Info profile={userId === id ? undefined : profile} />
                {userId && userId === id && (
                    <div className="bg-white p-4 rounded-lg relative mt-8">
                        <div className="flex justify-between items-center">
                            <div className="font-bold text-lg">Friend</div>
                            <Link href={`${userId}/friends`}>
                                See all friend
                            </Link>
                        </div>
                        <div className="text-[#65676b]">
                            {totalFriends} Friends
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {friends.map((friend: any, index: number) => (
                                <div
                                    className=""
                                    key={`friend_${friend.id}_i_${index}`}
                                >
                                    <Link href={`/profile/${friend.id}`}>
                                        <Image
                                            className="rounded-md"
                                            src={
                                                friend.avatar ||
                                                "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                                            }
                                            alt="err"
                                            width={100}
                                            height={100}
                                        />
                                        <div className="text-center mt-2">
                                            {friend.name}
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="col-span-3">{children}</div>
        </div>
    )
    return children
}

export default layout
