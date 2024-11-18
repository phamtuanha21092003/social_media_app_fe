import { configureStore } from "@reduxjs/toolkit"
import meReducer from "@/stores/me/slice"
import emojiReducer from "@/stores/emoji/slice"

export const store = configureStore({
    reducer: { me: meReducer, emoji: emojiReducer },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
