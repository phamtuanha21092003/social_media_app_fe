"use client"

import React from "react"
import { Input, Button, message } from "antd"
import { changePassword } from "@/actions/auth"

const EditPassword: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const [oldPassword, setOldPassword] = React.useState("")

    const [newPassword, setNewPassword] = React.useState("")

    const [confirmPassword, setConfirmPassword] = React.useState("")

    async function handleChangePassword() {
        if (newPassword === oldPassword) {
            message.error("Old password cannot be the same as new password!")

            return
        }

        if (newPassword !== confirmPassword) {
            message.error("Passwords do not match!")

            return
        }

        setIsLoading(true)

        const data = await changePassword({
            oldPassword,
            newPassword,
            confirmPassword,
        })

        console.log(data, "data")

        if (data === "success") {
            message.success("Password changed successfully!")

            setIsLoading(false)
            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")
            return
        }

        setIsLoading(false)
        message.error("Failed to change password!")
    }

    return (
        <div className="grid grid-cols-2 mt-4 gap-8">
            <div>
                <div className="bg-white flex flex-col gap-4 p-6 rounded-lg">
                    <p className="text-lg font-bold">Edit password</p>
                </div>
            </div>
            <div className="bg-white rounded-lg p-8 text-lg font-medium flex flex-col gap-4">
                <div>
                    <Input.Password
                        id="old_password"
                        className="p-2"
                        placeholder="Old password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>
                <div>
                    <Input.Password
                        id="new_password"
                        className="p-2"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                <div>
                    <Input.Password
                        id="confirm_password"
                        className="p-2"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div>
                    <Button
                        className="w-full bg-[#0866ff] py-4 text-lg font-bold text-white"
                        loading={isLoading}
                        type="primary"
                        onClick={handleChangePassword}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default EditPassword
