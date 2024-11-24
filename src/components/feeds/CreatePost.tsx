import React from "react"
import { Button, Checkbox, Input, message } from "antd"
import { upload } from "@/actions/common"
import Image from "next/image"
import { createPost } from "@/actions/feed"
import { CloseSquareTwoTone } from "@ant-design/icons"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { selectMe } from "@/stores/me/slice"

const { TextArea } = Input

function CreatePost(props: {
    post: Post
    setPost: React.Dispatch<React.SetStateAction<Post>>
    setPosts: React.Dispatch<React.SetStateAction<any>>
}) {
    const { post, setPost, setPosts } = props

    const [isPrivate, setIsPrivate] = React.useState(false)

    const router = useRouter()

    const me = useSelector(selectMe)

    const refInputFile = React.useRef<HTMLInputElement>(null)

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const file = e.target.files[0]

            const formData = new FormData()

            formData.append("files", file)

            const urls: string[] = await upload(formData)

            if (urls.length > 0) {
                setPost((prevState: Post) => ({
                    ...prevState,
                    url: urls[0],
                }))
            }
        }
    }

    async function handlePost() {
        const postRes = await createPost(post.title, post.url, isPrivate)

        if (postRes) {
            message.success("created post successfully")

            if (isPrivate) {
                router.push(`/profile/${me.id}`)
            }

            setPosts((prePosts: any) => [postRes, ...prePosts])

            setPost({
                title: "",
                url: "",
                commentCount: 0,
                created: "",
                likeCount: 0,
            })
        }
    }

    return (
        <div className="py-4 px-8 round-lg bg-white">
            {post.url && (
                <div className="flex justify-center gap-4">
                    <Image src={post.url} alt="err" width={200} height={120} />
                    <div
                        className="cursor-pointer"
                        onClick={() => {
                            setPost((prevState: Post) => ({
                                ...prevState,
                                url: "",
                            }))
                        }}
                    >
                        <CloseSquareTwoTone />
                    </div>
                </div>
            )}
            <div className={`${post.url && "mt-4"}`}>
                <TextArea
                    rows={8}
                    placeholder="What are you think about?"
                    value={post.title}
                    onChange={(e) =>
                        setPost((prevState: Post) => ({
                            ...prevState,
                            title: e.target.value,
                        }))
                    }
                />
            </div>
            <div className="flex justify-between w-full mt-4 items-center">
                <div className="flex items-center gap-4">
                    <Button
                        className="bg-[#566070] text-white px-4 py-2"
                        onClick={() => refInputFile.current?.click()}
                    >
                        Attach Image
                    </Button>
                    <Checkbox
                        onChange={() =>
                            setIsPrivate((prePrivate) => !prePrivate)
                        }
                        checked={isPrivate}
                    >
                        Private
                    </Checkbox>
                </div>
                <input
                    type="file"
                    hidden
                    ref={refInputFile}
                    accept="image/jpeg, image/png, image/jpg, image/gif, image/jp2, image/webp"
                    onChange={handleUpload}
                />
                <Button
                    className="bg-[#9445e4] text-white px-4 py-2"
                    onClick={handlePost}
                >
                    Post
                </Button>
            </div>
        </div>
    )
}

export default CreatePost
