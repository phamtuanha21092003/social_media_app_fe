"use client"

import React from "react"
import { getPosts, likePost } from "@/actions/feed"
import { useSelector } from "react-redux"
import { selectMe } from "@/stores/me/slice"
import CreatePost from "@/components/feeds/CreatePost"
import Post from "@/components/feeds/Post"
import { useEffectAfterMount } from "@/hooks"
import useScroll from "@/hooks/useScroll"

const Profile = ({ params }: { params: { id: number } }) => {
    const { id } = params

    const me = useSelector(selectMe)

    const [page, setPage] = React.useState(1)

    const [postId, setPostId] = React.useState<number>(0)

    const [total, setTotal] = React.useState(0)

    const [post, setPost] = React.useState<Post>({
        title: "",
        url: "",
        commentCount: 0,
        created: "",
        likeCount: 0,
    })

    const [posts, setPosts] = React.useState<Post[]>([])

    async function fetchPost() {
        const [data, total] = await getPosts(page, 5, id)

        setPosts((posts) => [...posts, ...data])

        setTotal(total)
    }

    useEffectAfterMount(fetchPost, [page])

    useScroll({ total, setPage, quantity: posts.length })

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
        <div className="flex flex-col gap-4">
            {me.id == id && (
                <CreatePost post={post} setPost={setPost} setPosts={setPosts} />
            )}

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
    )
}

export default Profile
