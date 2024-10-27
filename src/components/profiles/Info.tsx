"use client"

import React from "react"
import Image from "next/image"
import { useSelector } from "react-redux"
import { selectMe } from "@/stores/me/slice"

const Info = ({ profile }: { profile: any }) => {
    const me = useSelector(selectMe)

    return (
        <div className="">
            <div className="bg-white p-4 flex flex-col items-center gap-2 rounded-lg relative">
                <div className="flex justify-center">
                    <Image
                        className="object-cover"
                        src={
                            (profile ? profile.avatar : me.avatar) ||
                            "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                        }
                        alt="avatar"
                        height={200}
                        width={200}
                    />
                </div>
                <div className="mx-auto">
                    <p>{profile ? profile.name : me.name}</p>
                </div>
                <div></div>
            </div>
        </div>
    )
}

export default Info
