import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/stores"

interface EmojiState {
    [key: string]: string
}

const initialState: EmojiState = {}

export const emojiSlice = createSlice({
    name: "emoji",
    initialState,
    reducers: {
        initEmoji(state, action: PayloadAction<EmojiState>) {
            return { ...action.payload }
        },
    },
})

export const { initEmoji } = emojiSlice.actions

export const selectEmoji = (state: RootState, key: string) => state.emoji[key]

export const selectEmojis = (state: RootState) =>
    Object.entries(state.emoji).map(([key, value]) => ({ id: key, url: value }))

export const selectEmojisDetailPost = (state: RootState) => {
    const keys = ["32", "33", "34", "31", "21"]

    return keys.map((key) => ({ id: key, url: state.emoji?.[key] || "" }))
}

export default emojiSlice.reducer
