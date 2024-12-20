"use client"

import React from "react"
import { Input, Button, InputRef, message } from "antd"
import { useRouter } from "next/navigation"
import { actionSignUp } from "@/actions/auth"

export default function SignUp() {
    const router = useRouter()

    const refEmail = React.useRef<InputRef>(null)

    const refName = React.useRef<InputRef>(null)

    const refPassword = React.useRef<InputRef>(null)

    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    async function handleLogin(): Promise<void> {
        const email = refEmail.current?.input?.value

        const password = refPassword.current?.input?.value

        const name = refName.current?.input?.value

        if (email && password && name) {
            setIsLoading(true)
            const data = await actionSignUp(email, password, name)
            setIsLoading(false)

            if (data?.err) {
                message.error(data?.err)
                return
            }

            message.info("Signup successfully!")

            router.push("/")
            return
        }

        message.error("Email, password is required!")
    }

    return (
        <main className="px-8 py-6 flex items-center justify-center">
            <div className="grid grid-cols-2 max-w-[1280px] w-4/5 gap-4">
                <div className=""></div>
                <div className="p-16 bg-[#fefefe] flex flex-col gap-4 rounded-lg">
                    <div>
                        <Input
                            className="p-2"
                            placeholder="Name"
                            ref={refName}
                        />
                    </div>
                    <div>
                        <Input
                            id="email"
                            className="p-2"
                            placeholder="Email"
                            ref={refEmail}
                        />
                    </div>
                    <div>
                        <Input.Password
                            id="password"
                            className="p-2"
                            placeholder="Password"
                            ref={refPassword}
                        />
                    </div>
                    <div>
                        <Button
                            className="w-full bg-[#0866ff] py-4 text-lg font-bold text-white"
                            onClick={handleLogin}
                            loading={isLoading}
                        >
                            Sign Up
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    )
}
