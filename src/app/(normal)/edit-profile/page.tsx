"use client"

import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectMe, updateProfile } from "@/stores/me/slice"
import { Input, Button, InputRef, message } from "antd"
import Image from "next/image"
import { upload } from "@/actions/common"
import { updateMe } from "@/actions/profile"
import Link from "next/link"

const EditProfile: React.FC = () => {
    const me = useSelector(selectMe)

    const [urlAvatar, setUrlAvatar] = React.useState<string>("")

    const refInputFile = React.useRef<HTMLInputElement>(null)

    const [isEditProfile, setIsEditProfile] = React.useState<boolean>(false)

    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const refName = React.useRef<InputRef>(null)

    const dispatch = useDispatch()

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const file = e.target.files[0]

            const formData = new FormData()

            formData.append("files", file)

            setIsLoading(true)

            const urls: string[] = await upload(formData)

            setIsLoading(false)

            if (urls.length > 0) {
                setUrlAvatar(urls[0])
                handleChangeEditProfile()
            }
        }
    }

    function handleChangeEditProfile() {
        setIsEditProfile(true)
    }

    async function handleSaveProfile() {
        const avatar = urlAvatar || me.avatar
        const name = refName.current?.input?.value

        if (name && avatar) {
            setIsLoading(true)

            const mess = await updateMe({ name, avatar })

            if (mess === "Updated successfully") {
                setIsEditProfile(false)
                dispatch(updateProfile({ name, avatar }))
                message.success("Updated successfully")
            }

            setIsLoading(false)

            return
        }

        message.error("Name, Avatar is required!")
    }

    return (
        <div className="grid grid-cols-2 mt-4 gap-8">
            <div>
                <div className="bg-white flex flex-col gap-4 p-6 rounded-lg">
                    <p className="text-lg font-bold">Edit profile</p>
                    <Link
                        href={"/edit-password"}
                        className="text-base underline"
                    >
                        Edit password
                    </Link>
                </div>
            </div>
            <div className="bg-white rounded-lg p-8 text-lg font-medium flex flex-col gap-4">
                <p>Name</p>
                {me.isLoading && (
                    <Input
                        defaultValue={me.name}
                        onChange={handleChangeEditProfile}
                        ref={refName}
                    />
                )}
                <p>Avatar</p>
                <div className="flex items-center gap-8">
                    <div>
                        <Image
                            src={
                                urlAvatar ||
                                me.avatar ||
                                "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                            }
                            width={100}
                            height={100}
                            alt="avatar"
                        />
                    </div>
                    <div>
                        <Button
                            disabled={isLoading}
                            loading={isLoading}
                            onClick={() => {
                                refInputFile.current?.click()
                                if (refInputFile.current?.value) {
                                    refInputFile.current.value = ""
                                }
                            }}
                        >
                            Edit Avatar
                        </Button>
                        <input
                            type="file"
                            hidden
                            ref={refInputFile}
                            accept="image/jpeg, image/png, image/jpg, image/gif, image/jp2, image/webp"
                            onChange={handleUpload}
                        />
                    </div>
                </div>
                <div className="w-full">
                    <Button
                        loading={isLoading}
                        type="primary"
                        disabled={!isEditProfile}
                        className="w-full font-bold text-lg py-2"
                        onClick={handleSaveProfile}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default EditProfile
