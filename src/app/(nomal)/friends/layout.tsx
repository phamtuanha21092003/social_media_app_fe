/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React from "react"
import { usePathname } from "next/navigation"

const LayoutFriend = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()

    const fetchDataMenu = React.useCallback(() => {}, [pathname])

    console.log(pathname, "path")

    return (
        <>
            <div className="fixed top-0"></div> {children}
        </>
    )
}

export default LayoutFriend
