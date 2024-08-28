import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/stores"

interface MeState {
    id: number
    email: string
    name: string
    avatar: string
    isLoading: boolean
}

const initialState: MeState = {
    id: 0,
    email: "",
    name: "",
    avatar: "",
    isLoading: false,
}

export const meSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        initMe(state, action: PayloadAction<MeState>) {
            return { ...action.payload }
        },
        updateProfile(
            state,
            action: PayloadAction<{ name: string; avatar: string }>
        ) {
            return { ...state, ...action.payload }
        },
    },
})

export const { initMe, updateProfile } = meSlice.actions

export const selectMe = (state: RootState) => state.me

export default meSlice.reducer
