import { configureStore } from "@reduxjs/toolkit"
import meReducer from "@/stores/me/slice"
import emojiReducer from "@/stores/emoji/slice"
import commentReducer from "@/stores/comment/slice"

export const store = configureStore({
    reducer: { me: meReducer, emoji: emojiReducer, comment: commentReducer },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
