import React from "react"
import { Avatar, Button, message } from "antd"
import Image from "next/image"
import { getFriendSuggestions } from "@/actions/profile"
import { useEffectAfterMount } from "@/hooks"
import { addFriend } from "@/actions/profile"

const PeopleYouMayKnow: React.FC = () => {
    const [friendSuggestions, setFriendSuggestions] = React.useState<User[]>([])

    const fetchFriendSuggestions = React.useCallback(async () => {
        const [friendSuggestions] = await getFriendSuggestions({
            perPage: 5,
        })

        setFriendSuggestions(friendSuggestions)
    }, [])

    useEffectAfterMount(fetchFriendSuggestions)

    return (
        friendSuggestions.length > 0 && (
            <div className="bg-white p-4 rounded-lg mt-4">
                <p>People you may know</p>

                <div className="flex flex-col gap-2">
                    {friendSuggestions?.map((suggestion, index) => (
                        <FriendSuggestion
                            key={`${suggestion.id}_id_index${index}`}
                            suggestion={suggestion}
                            fetchFriendSuggestions={fetchFriendSuggestions}
                        />
                    ))}
                </div>
            </div>
        )
    )
}

function FriendSuggestion({
    suggestion,
    fetchFriendSuggestions,
}: {
    suggestion: User
    fetchFriendSuggestions: () => Promise<void>
}) {
    async function handleAddFriend(userId: number) {
        const res = await addFriend(userId)
        if (res === "Add friend successfully") {
            message.success("Added friend successfully")
        }

        await fetchFriendSuggestions()
    }

    return (
        <div className="flex items-center py-2 justify-between">
            <div className="flex gap-2 items-center">
                <Avatar
                    src={
                        <Image
                            src={
                                suggestion.avatar ||
                                "http://localhost:9000/wey-bucket/453178253_471506465671661_2781666950760530985_n.png"
                            }
                            width={40}
                            height={40}
                            alt="avatar"
                        />
                    }
                />
                <p>{suggestion.name}</p>
            </div>

            <div>
                <Button
                    type="primary"
                    onClick={() => handleAddFriend(suggestion.id)}
                >
                    Add Friend
                </Button>
            </div>
        </div>
    )
}

export default PeopleYouMayKnow
