import Client from "@/apis/client/ClientProfile"

const getMe = () => {
    return Client.GET("/me")
}

const updateMe = (data: { name: string; avatar: string }) => {
    return Client.PUT("/me", data)
}

const getFriendSuggestions = ({
    page,
    perPage,
}: {
    page?: number
    perPage?: number
}) => {
    return Client.GET("/friend_suggestions", { page: page, per_page: perPage })
}

const addFriend = (targeID: number) => {
    return Client.POST(`/friend/${targeID}`)
}

const RepoProfile = { getMe, updateMe, getFriendSuggestions, addFriend }

export default RepoProfile
