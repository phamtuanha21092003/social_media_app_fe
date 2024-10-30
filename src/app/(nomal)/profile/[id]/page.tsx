"use client"

import React from "react"
import { getPosts } from "@/actions/feed"
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

    return (
        <div className="flex flex-col gap-4">
            {me.id == id && (
                <CreatePost post={post} setPost={setPost} setPosts={setPosts} />
            )}

            {posts?.map((post: any, index) => (
                <Post
                    post={post}
                    key={`post_${post.id}_index_${index}`}
                    setPostId={setPostId}
                />
            ))}
        </div>
    )
}

export default Profile
