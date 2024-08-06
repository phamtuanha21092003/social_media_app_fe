"use client"

import * as React from "react"
import { Provider } from "react-redux"
import { store } from "@/stores"

const Config = ({ children }: { children: React.ReactNode }) => {
    return <Provider store={store}>{children}</Provider>
}

export default Config
