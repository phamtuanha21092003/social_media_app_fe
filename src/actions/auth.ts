"use server"

import { cookies } from "next/headers"
import { ApiAuth } from "@/apis/repositories"
import { redirect } from "next/navigation"
import Client from "@/apis/client"

export async function handleRefresh() {
    const refreshToken = await getRefreshToken()

    if (!refreshToken) {
        resetAuthCookies()
        redirect("/")
    }

    try {
        const res: Response = await ApiAuth.refresh(refreshToken)

        if (res.ok) {
            const { access_token: accessToken, refresh_token: refreshToken } =
                await res.json()

            setAccessToken(accessToken)
            setRefreshToken(refreshToken)

            return accessToken
        }

        resetAuthCookies()

        redirect("/")
    } catch (err) {
        console.log(err)

        resetAuthCookies()

        redirect("/")
    }
}

export async function actionLogin(email: string, password: string) {
    try {
        const res: Response = await ApiAuth.login(email, password)

        if (!res.ok) {
            throw Error("Email, password is invalid")
        }

        const {
            access_token: accessToken,
            refresh_token: refreshToken,
            user_id: userId,
        } = await res.json()

        setAccessToken(accessToken)
        setRefreshToken(refreshToken)
        setUserId(userId)
    } catch (err) {
        return {
            err: err instanceof Error ? err.message : "An error occurred",
        }
    }
}

export async function actionSignUp(
    email: string,
    password: string,
    name: string
) {
    try {
        const res: Response = await ApiAuth.signUp(email, password, name)

        if (!res.ok) {
            const { error } = await res.json()

            throw Error(error)
        }
    } catch (err) {
        return {
            err: err instanceof Error ? err.message : "An error occurred",
        }
    }
}

export async function resetAuthCookies() {
    cookies().delete("accessToken")
    cookies().delete("refreshToken")
    cookies().delete("userId")
}

export async function setAccessToken(accessToken: string) {
    cookies().set("accessToken", accessToken, { maxAge: 60 * 60 })
}

export async function setRefreshToken(refreshToken: string) {
    cookies().set("refreshToken", refreshToken, { maxAge: 60 * 60 * 24 * 30 })
}

function setUserId(userId: string) {
    cookies().set("userId", userId, { maxAge: 60 * 60 * 24 * 30 })
}

export async function getUserId() {
    const userId = cookies().get("userId")?.value
    return userId
}

export async function getAccessToken() {
    let accessToken = cookies().get("accessToken")?.value

    if (!accessToken) {
        accessToken = await handleRefresh()
    }

    return accessToken
}

export async function getRefreshToken() {
    let refreshToken = cookies().get("refreshToken")?.value

    return refreshToken
}

export async function logout() {
    await Client.POST("/auth/logout")

    resetAuthCookies()
}

export async function changePassword({
    oldPassword,
    newPassword,
    confirmPassword,
}: {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}) {
    const res = await Client.POST("/auth/change_password", {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
    })

    const { message } = await res.json()

    return message
}
