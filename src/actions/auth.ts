"use server"

import { cookies } from "next/headers"
import { ApiAuth } from "@/apis/repositories"

async function handleRefresh() {
    const refreshToken = await getRefreshToken()

    if (!refreshToken) {
        resetAuthCookies()
        window.location.href = "/"
        return
    }

    try {
        const res: Response = await ApiAuth.refresh(refreshToken)

        if (res.ok) {
            const { access_token: accessToken, refresh_token: refreshToken } =
                await res.json()

            cookies().set("accessToken", accessToken)
            cookies().set("refreshToken", refreshToken)

            return accessToken
        }

        resetAuthCookies()

        window.location.href = "/"
    } catch (err) {
        console.log(err)

        resetAuthCookies()

        window.location.href = "/"
    }
}

export async function actionLogin(email: string, password: string) {
    try {
        const res: Response = await ApiAuth.login(email, password)

        if (!res.ok) {
            throw Error("Email, password is invalid")
        }

        const { access_token: accessToken, refresh_token: refreshToken } =
            await res.json()

        cookies().set("accessToken", accessToken)
        cookies().set("refreshToken", refreshToken)
    } catch (err) {
        return {
            err: err instanceof Error ? err.message : "An error occurred",
        }
    }
}

export async function resetAuthCookies() {
    cookies().set("userId", "")
    cookies().set("accessToken", "")
    cookies().set("refreshToken", "")
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
