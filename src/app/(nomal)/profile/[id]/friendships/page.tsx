"use client"

import React from "react"
import { getFriendships } from "@/actions/profile"
import { useDebounce, useEffectAfterMount, useScroll } from "@/hooks"
import { Input } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { Friendship } from "@/components/profiles/FriendshipSideBar"

function Friendships() {
    const [friendships, setFriendships] = React.useState<User[]>([])

    const [keyword, setKeyword] = React.useState<string>("")

    const keywordDebounce = useDebounce(keyword)

    const [page, setPage] = React.useState(1),
        perPage = 10

    const [total, setTotal] = React.useState(0)

    async function fetchFriendships() {
        const [friendships, total] = await getFriendships({
            page,
            perPage,
            keyword: keywordDebounce === "" ? undefined : keywordDebounce,
        })

        setFriendships((preFriendships) => [...preFriendships, ...friendships])
        setTotal(total)
    }

    useEffectAfterMount(async () => {
        setFriendships([])
        setTotal(0)
    }, [keywordDebounce])

    useEffectAfterMount(fetchFriendships, [page, keywordDebounce])

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setKeyword(e.target.value)
        setPage(1)
    }

    useScroll({ total, setPage, quantity: friendships.length })

    return (
        <div className="bg-white p-8 rounded-lg">
            <div className="flex justify-between">
                <div className="font-bold text-lg">Friendships</div>
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
                {friendships?.map((friendship: any, index) => (
                    <Friendship
                        key={`ship_friendship${friendship.id}_i_${index}`}
                        friendship={friendship}
                        fetchFriendships={() => {
                            setPage(1)
                            setFriendships([])
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default Friendships
