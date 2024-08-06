import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/stores"

interface MeState {
    email: string
    name: string
}

const initialState: MeState = {
    email: "",
    name: "",
}

export const meSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        initMe(state, action: PayloadAction<MeState>) {
            return { ...action.payload }
        },
    },
})

export const { initMe } = meSlice.actions

export const selectMe = (state: RootState) => state.me

export default meSlice.reducer
