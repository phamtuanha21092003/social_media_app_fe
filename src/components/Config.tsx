"use client"

import React from "react"
import { Provider } from "react-redux"
import { store } from "@/stores"
import { AntdRegistry } from "@ant-design/nextjs-registry"

const Config = ({ children }: { children: React.ReactNode }) => {
    return (
        <AntdRegistry>
            <Provider store={store}>{children}</Provider>
        </AntdRegistry>
    )
}

export default Config
