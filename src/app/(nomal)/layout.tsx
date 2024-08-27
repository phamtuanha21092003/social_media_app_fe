"use client"

import React from "react"
import Link from "next/link"
import {
    BellOutlined,
    EditOutlined,
    HomeOutlined,
    MessageOutlined,
    SearchOutlined,
} from "@ant-design/icons"
import { Avatar, Dropdown, MenuProps } from "antd"
import Image from "next/image"
import { getMe } from "@/actions/profile"
import { useDispatch, useSelector } from "react-redux"
import { initMe, selectMe } from "@/stores/me/slice"
import { useRouter } from "next/navigation"

const LayoutAuth: React.FC<PropsChildren> = ({ children }) => {
    const dispatch = useDispatch()

    const me = useSelector(selectMe)

    React.useEffect(() => {
        async function fetchMe() {
            const data = await getMe()

            dispatch(initMe({ ...data, isLoading: true }))
        }

        fetchMe()
    }, [])

    const router = useRouter()

    const items: MenuProps["items"] = [
        {
            label: me.name,
            icon: (
                <Avatar
                    src={
                        <Image
                            src={
                                me.avatar ||
                                "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                            }
                            width={40}
                            height={40}
                            alt="avatar"
                        />
                    }
                />
            ),
            onClick: () => router.push(`/profile/${me.id}`),
            key: "profile",
        },
        {
            label: "Edit Profile",
            icon: <EditOutlined />,
            key: "edit-profile",
            onClick: () => router.push("/edit-profile"),
        },
    ]

    return (
        <>
            <header className="flex items-center justify-center px-8 py-4 bg-white fixed w-full">
                <div className="max-w-[1200px] flex justify-between items-center w-full">
                    <Link href={"/feed"}>
                        <p>Ha</p>
                    </Link>
                    <div className="flex items-center gap-8">
                        <Link href="/feed">
                            <HomeOutlined style={{ fontSize: "28px" }} />
                        </Link>
                        <Link href="/message">
                            <MessageOutlined style={{ fontSize: "28px" }} />
                        </Link>
                        <Link href="/notification">
                            <BellOutlined style={{ fontSize: "28px" }} />
                        </Link>
                        <Link href="/notification">
                            <SearchOutlined style={{ fontSize: "28px" }} />
                        </Link>
                    </div>
                    <div>
                        <Dropdown
                            menu={{ items }}
                            trigger={["click"]}
                            placement="bottom"
                            overlayClassName="w-[280px] text-center"
                        >
                            <Avatar
                                src={
                                    <Image
                                        src={
                                            me.avatar ||
                                            "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                                        }
                                        width={40}
                                        height={40}
                                        alt="avatar"
                                    />
                                }
                            />
                        </Dropdown>
                    </div>
                </div>
            </header>

            <div className="h-16"></div>

            <main className="flex items-center justify-center">
                <div className="max-w-[1200px] w-full">{children}</div>
            </main>
        </>
    )
}

export default LayoutAuth
