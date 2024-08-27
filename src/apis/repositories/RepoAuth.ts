import { HOST } from "@/utils/constants"

const login = (email: string, password: string): Promise<Response> => {
    return fetch(`${HOST}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
    })
}

const signUp = (
    email: string,
    password: string,
    name: string
): Promise<Response> => {
    return fetch(`${HOST}/auth/sign_up`, {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
        headers: { "Content-Type": "application/json" },
    })
}

const refresh = (refreshToken: string): Promise<Response> => {
    return fetch(`${HOST}/auth/refresh`, {
        method: "POST",
        body: JSON.stringify({ refresh_token: refreshToken }),
        headers: { "Content-Type": "application/json" },
    })
}

const RepoAuth = { login, signUp, refresh }

export default RepoAuth
