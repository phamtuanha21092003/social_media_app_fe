"use client"

import React from "react"
import { getPost, getPosts } from "@/actions/feed"
import { useSelector } from "react-redux"
import Image from "next/image"
import { selectMe } from "@/stores/me/slice"
import CreatePost from "@/components/feeds/CreatePost"
import { useEffectAfterMount } from "@/hooks"
import Post from "@/components/feeds/Post"
import { getFriendSuggestions } from "@/actions/profile"
import PeopleYouMayKnow from "@/components/profiles/PeopleYouMayKnow"
import useScroll from "@/hooks/useScroll"

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

    return (
        <div className="grid grid-cols-4 mt-4 gap-4">
            <div className="">
                <div className="bg-white p-4 flex flex-col items-center gap-2 rounded-lg relative">
                    <div className="flex justify-center">
                        <Image
                            className="object-cover"
                            src={
                                me.avatar ||
                                "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                            }
                            alt="avatar"
                            height={200}
                            width={200}
                        />
                    </div>
                    <div className="mx-auto">
                        <p>{me.name}</p>
                    </div>
                    <div></div>
                </div>
            </div>
            <div className="col-span-2 flex flex-col gap-8">
                <CreatePost post={post} setPost={setPost} setPosts={setPosts} />

                {posts?.map((post, index) => (
                    <Post
                        post={post}
                        key={`post_${post.id}_index_${index}`}
                        setPostId={setPostId}
                    />
                ))}
            </div>
            <div>
                <PeopleYouMayKnow />
            </div>
        </div>
    )
}

export default Feed
