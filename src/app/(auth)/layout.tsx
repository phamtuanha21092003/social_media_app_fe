import Link from "next/link"
import React from "react"

const LayoutAuth: React.FC<PropsChildren> = ({ children }) => {
    return (
        <>
            <header className="px-8 py-6 bg-white flex items-center justify-center">
                <div className="w-4/5 max-w-[1280px] flex justify-between">
                    <div>
                        <p className="font-bold">Wey</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 rounded-lg bg-slate-700 text-white font-medium">
                            <Link href={"/"}>Log In</Link>
                        </div>
                        <div className="px-4 py-2 rounded-lg bg-red-400 text-white font-medium">
                            <Link href={"/sign_up"}>Sign Up</Link>
                        </div>
                    </div>
                </div>
            </header>

            {children}
        </>
    )
}

export default LayoutAuth
