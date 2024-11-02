import React from "react"

const Search = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid grid-cols-4 mt-4 gap-4">
            <div className="bg-white"></div>
            <div className="col-span-3">{children}</div>
        </div>
    )
}

export default Search
