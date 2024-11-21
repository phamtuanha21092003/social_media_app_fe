"use client"

import React from "react"
import { Input } from "antd"
import { search } from "@/actions/search"
import { likePost } from "@/actions/feed"
import Post from "@/components/feeds/Post"
import { useScroll, useDebounce, useEffectAfterMount } from "@/hooks"
import Image from "next/image"
import Link from "next/link"

const Search = () => {
    const [keyword, setKeyword] = React.useState("")

    const keywordDebounce = useDebounce(keyword)

    const [page, setPage] = React.useState(1)

    const [users, setUsers] = React.useState<any[]>([])

    const [posts, setPosts] = React.useState<any[]>([])
    const [totalPosts, setTotalPosts] = React.useState(0)

    const [postId, setPostId] = React.useState(0)

    function handleChangeKeyword(e: React.ChangeEvent<HTMLInputElement>) {
        setKeyword(e.target.value)
    }

    async function fetchSearch() {
        const { users, posts } = await search({
            page: page,
            type: page === 1 ? "ALL" : "POST",
            keyword: keyword,
        })

        setUsers((perState) => [
            ...perState,
            ...(users.data?.map((user: any) => ({
                ...user,
                isFriend: user.is_friend,
            })) || []),
        ])

        setPosts((preState) => [...preState, ...(posts.data || [])])
        setTotalPosts(posts.total || 0)
    }

    useEffectAfterMount(() => {
        setUsers([])

        setPosts([])
        setTotalPosts(0)
    }, [keywordDebounce])

    useEffectAfterMount(fetchSearch, [page, keywordDebounce])

    useScroll({ total: totalPosts, setPage, quantity: users.length })

    async function handleLikePost(postId: number) {
        const { is_liked, like_count } = await likePost(postId)

        const postIndex = posts.findIndex((post) => post.id === postId)

        if (postIndex !== -1) {
            setPosts((preState) =>
                preState.with(postIndex, {
                    ...preState[postIndex],
                    likeCount: like_count,
                    isLiked: is_liked,
                })
            )
        }
    }

    return (
        <div>
            <div className="p-4 rounded-lg bg-white flex gap-4">
                <Input
                    value={keyword}
                    placeholder="What are you looking for?"
                    style={{ backgroundColor: "#f3f4f6", padding: "20px" }}
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
                    <Link
                        href={`/search/people?q=${keyword}`}
                        className="m-4 rounded-lg flex flex-col items-center p-2"
                    >
                        <div className="h-full w-full flex items-center justify-center">
                            <button className="px-2 py-4 rounded-lg bg-[#1777ff] text-white">
                                See more
                            </button>
                        </div>
                    </Link>
                </div>
            )}

            <div className="col-span-2 flex flex-col gap-8 mt-8">
                {posts?.map((post: any, index) => (
                    <Post
                        key={`post_${post.id}_index_${index}`}
                        post={post}
                        setPosts={setPosts}
                        setPostId={setPostId}
                        likePost={handleLikePost}
                    />
                ))}
            </div>
        </div>
    )
}

export default Search
