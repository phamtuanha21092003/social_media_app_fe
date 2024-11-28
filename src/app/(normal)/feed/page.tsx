"use client"

import React, { Children } from "react"
import { getPost, getPosts, likePost } from "@/actions/feed"
import { useSelector } from "react-redux"
import Image from "next/image"
import { selectMe } from "@/stores/me/slice"
import CreatePost from "@/components/feeds/CreatePost"
import { useEffectAfterMount } from "@/hooks"
import Post from "@/components/feeds/Post"
import { getFriendSuggestions } from "@/actions/profile"
import PeopleYouMayKnow from "@/components/profiles/PeopleYouMayKnow"
import useScroll from "@/hooks/useScroll"
import Link from "next/link"
import { LikeOutlined, TeamOutlined } from "@ant-design/icons"
import Avatar from "antd/es/avatar/avatar"

const Feed: React.FC = () => {
    const me = useSelector(selectMe)

    const [postId, setPostId] = React.useState<number>(0)

    const [postDetail, setPostDetail] = React.useState<Post>()

    const [post, setPost] = React.useState<Post>({
        title: "",
        url: "",
        commentCount: 0,
        created: "",
        likeCount: 0,
    })

    const [posts, setPosts] = React.useState<Post[]>([])

    const [page, setPage] = React.useState<number>(1),
        perPage = 10

    const [total, setTotal] = React.useState<number>(0)

    const [friendSuggestions, setFriendSuggestions] = React.useState<User[]>([])

    useScroll({ total, setPage, quantity: posts.length })

    const fetchPosts = React.useCallback(async () => {
        const [data, total] = await getPosts(page, perPage)

        setTotal(total)

        setPosts((posts) => [...posts, ...data])
    }, [page])

    const fetchPost = React.useCallback(async () => {
        if (postId) {
            const data = await getPost(postId)

            setPostDetail(data)
        }
    }, [postId])

    const fetchFriendSuggestions = React.useCallback(async () => {
        const [friendSuggestions] = await getFriendSuggestions({
            perPage: 5,
        })

        setFriendSuggestions(friendSuggestions)
    }, [])

    useEffectAfterMount(fetchPosts, [page])

    useEffectAfterMount(fetchPost, [postId])

    useEffectAfterMount(fetchFriendSuggestions)

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
        <div className="grid grid-cols-4 mt-4 gap-4">
            <div className="col-span-3 flex flex-col gap-8">
                <CreatePost post={post} setPost={setPost} setPosts={setPosts} />

                {posts?.map((post, index) => (
                    <Post
                        key={`post_${post.id}_index_${index}`}
                        post={post}
                        setPosts={setPosts}
                        setPostId={setPostId}
                        likePost={handleLikePost}
                    />
                ))}
            </div>
            <div>
                <div className="bg-white py-4 flex flex-col items-center gap-2 rounded-lg relative px-10">
                    <Link
                        href={`/profile/${me.id}`}
                        className="flex items-center w-full gap-4 hover:bg-slate-200 px-2 py-1 rounded-lg"
                    >
                        <Avatar
                            size={{ sm: 36 }}
                            src={
                                <Image
                                    className="object-cover"
                                    src={
                                        me.avatar ||
                                        "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                                    }
                                    alt="avatar"
                                    height={36}
                                    width={36}
                                />
                            }
                        />
                        <p>{me.name}</p>
                    </Link>
                    <Link
                        href={"/feed/post_liked"}
                        className="flex items-center w-full gap-4 hover:bg-slate-200 px-2 py-1 rounded-lg"
                    >
                        <div>
                            <LikeOutlined style={{ fontSize: "30px" }} />
                        </div>
                        <div>Liked</div>
                    </Link>
                    <Link
                        href={"/feed/post_saved"}
                        className="flex items-center w-full gap-4 hover:bg-slate-200 px-2 py-1 rounded-lg"
                    >
                        <div>
                            <i
                                style={{
                                    backgroundImage:
                                        "url('http://localhost:9000/wey-bucket/icons8-remove-tag-24.png')",
                                    backgroundPosition: "0 -185px",
                                    backgroundSize: "37px 592px",
                                    width: "30px",
                                    height: "30px",
                                    backgroundRepeat: "no-repeat",
                                    display: "inline-block",
                                }}
                            ></i>
                        </div>
                        <div>Saved</div>
                    </Link>
                    <Link
                        href={`/profile/${me.id}/friends`}
                        className="flex items-center w-full gap-4 hover:bg-slate-200 px-2 py-1 rounded-lg"
                    >
                        <div>
                            <TeamOutlined style={{ fontSize: "30px" }} />
                        </div>
                        <div>Friend ({me.countFiend})</div>
                    </Link>
                </div>

                <PeopleYouMayKnow />
            </div>
        </div>
    )
}

export default Feed
