import Client from "@/apis/client/ClientProfile"

const getMe = () => {
    return Client.GET("/me")
}

const updateMe = (data: { name: string; avatar: string }) => {
    const res = Client.PUT("/me", data)

    Client.REVALIDATE("/me")

    return res
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
    const res = Client.POST(`/friend/${targeID}`)

    Client.REVALIDATE("/friend_suggestions")

    return res
}

const RepoProfile = { getMe, updateMe, getFriendSuggestions, addFriend }

export default RepoProfile
