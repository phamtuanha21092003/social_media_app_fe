"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "antd"
import { search } from "@/actions/search"
import { useEffectAfterMount, useDebounce, useScroll } from "@/hooks"
import Image from "next/image"
import Link from "next/link"

const SearchPeople = () => {
    const searchParams = useSearchParams()

    const [keyword, setKeyword] = React.useState(searchParams.get("q") ?? "")

    const keywordDebounce = useDebounce(keyword)

    const [users, setUsers] = React.useState<any[]>([])
    const [totalUsers, setTotalUsers] = React.useState(0)

    const [page, setPage] = React.useState(1),
        perPage = 20

    async function fetchPeople(page: number) {
        const { users } = await search({
            page: page,
            type: "PEOPLE",
            keyword: keyword,
            perPage: perPage,
        })

        setUsers((perState) => [
            ...perState,
            ...(users.data?.map((user: any) => ({
                ...user,
                isFriend: user.is_friend,
            })) || []),
        ])
        setTotalUsers(users.total || 0)
    }

    function handleChangeKeyword(e: React.ChangeEvent<HTMLInputElement>) {
        setKeyword(e.target.value)
    }

    useEffectAfterMount(() => {
        setUsers([])
        setTotalUsers(0)
        setPage(1)
    }, [keywordDebounce])

    useEffectAfterMount(() => fetchPeople(page), [page, keywordDebounce])

    useScroll({ total: totalUsers, setPage, quantity: users.length })

    return (
        <div>
            <div className="p-4 rounded-lg bg-white flex gap-4">
                <Input
                    placeholder="What are you looking for?"
                    style={{ backgroundColor: "#f3f4f6", padding: "20px" }}
                    value={keyword}
                    onChange={handleChangeKeyword}
                />
            </div>

            {users.length > 0 && (
                <div className="grid bg-white grid-cols-5 mt-8 gap-8">
                    {users?.map((user: any, index) => (
                        <Link
                            key={`search_user_${user.id}_index_${index}`}
                            className="m-4 rounded-lg bg-[#f3f4f6] flex flex-col items-center p-2 relative"
                            href={`/profile/${user.id}`}
                        >
                            <div className="relative pt-[100%] w-full">
                                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center justify-center">
                                    <Image
                                        className="rounded-full object-fill"
                                        src={
                                            user?.avatar ||
                                            "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                                        }
                                        alt="err"
                                        width={100}
                                        height={100}
                                    />
                                </div>
                            </div>

                            <div className="mt-2 text-lg">{user.name}</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchPeople
