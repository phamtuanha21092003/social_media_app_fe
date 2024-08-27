import Client from "@/apis/client/ClientProfile"

const getMe = () => {
    return Client.GET("/me")
}

const updateMe = (data: { name: string; avatar: string }) => {
    return Client.PUT("/me", data)
}

const RepoProfile = { getMe, updateMe }

export default RepoProfile
