import { getAccessToken } from "@/actions/auth"
import { HOST } from "@/utils/constants"

const upload = async (data: FormData) => {
    const headers = new Headers()

    headers.set("Authorization", `Bearer ${await getAccessToken()}`)

    return fetch(`${HOST}/uploads`, {
        method: "POST",
        body: data,
        headers: headers,
    })
}

const RepoCommon = { upload }

export default RepoCommon
