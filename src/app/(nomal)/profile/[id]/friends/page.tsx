"use client"

import React from "react"
import { SearchOutlined } from "@ant-design/icons"
import { Input } from "antd"
import { useDebounce, useEffectAfterMount, useScrollbar } from "@/hooks"
import { getFriends } from "@/actions/profile"
import Image from "next/image"
import Link from "next/link"

const Friends = () => {
    const [keyword, setKeyword] = React.useState<string>("")

    const keywordDebounce = useDebounce(keyword)

    const [page, setPage] = React.useState(1),
        perPage = 20

    const [total, setTotal] = React.useState(0)

    const [friends, setFriends] = React.useState<User[]>([])

    async function fetchFriends() {
        const { total, data: friends } = await getFriends({
            page: page,
            perPage: perPage,
            keyword: keywordDebounce === "" ? undefined : keywordDebounce,
        })

        setFriends((perFriends) => [...perFriends, ...friends])
        setTotal(total)
    }

    useEffectAfterMount(async () => {
        setFriends([])
    }, [keywordDebounce])

    useEffectAfterMount(fetchFriends, [page, keywordDebounce])

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setKeyword(e.target.value)
        setTotal(0)
        setPage(1)
    }

    useScrollbar({ total, setPage, quantity: friends.length })

    return (
        <div className="bg-white p-8 rounded-lg">
            <div className="flex justify-between">
                <div className="font-bold text-lg">Friend</div>
                <div>
                    <Input
                        className="rounded-lg"
                        style={{ backgroundColor: "#f0f2f5" }}
                        prefix={<SearchOutlined />}
                        placeholder="Search"
                        size="large"
                        value={keyword}
                        onChange={handleSearch}
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
                {friends?.map((friend, index) => (
                    <Link
                        href={`/profile/${friend.id}`}
                        key={`index_friend_${index}`}
                        className="rounded-lg p-4 shadow-[0_0_2px_#0000001a] flex items-center gap-4 group"
                    >
                        <Image
                            src={
                                friend.avatar ||
                                "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                            }
                            className="rounded-lg"
                            alt="err"
                            height={80}
                            width={80}
                        />
                        <div className="font-semibold group-hover:text-blue">
                            {friend.name}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Friends
