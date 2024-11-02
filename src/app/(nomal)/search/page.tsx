"use client"

import React from "react"
import { Input } from "antd"
import { SearchOutlined } from "@ant-design/icons"

const Search = () => {
    const [keyword, setKeyword] = React.useState("")

    function handleChangeKeyword(e: React.ChangeEvent<HTMLInputElement>) {
        setKeyword(e.target.value)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        console.log(e, "event keydown")
    }

    return (
        <div>
            <div className="p-4 rounded-lg bg-white flex gap-4">
                <Input
                    value={keyword}
                    placeholder="What are you looking for?"
                    style={{ backgroundColor: "#f3f4f6" }}
                    onChange={handleChangeKeyword}
                    onKeyDown={handleKeyDown}
                />
                <button className="bg-[#1777ff] rounded-lg p-4">
                    <SearchOutlined style={{ color: "white" }} />
                </button>
            </div>
        </div>
    )
}

export default Search
