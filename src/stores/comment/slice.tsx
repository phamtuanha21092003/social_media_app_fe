import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/stores"

interface CommentState {
    [replyId: number | null]: Comment[]
}

const initialState: CommentState = {}

export const commentSlice = createSlice({
    name: "comment",
    initialState,
    reducers: {
        addComment(
            state,
            action: PayloadAction<{
                comments: { [replyId: number]: Comment[] }
            }>
        ) {
            return {
                ...action.payload.comments,
            }
        },
    },
})

export const { addComment } = commentSlice.actions

export const selectReplies = (state: RootState, replyId: number | null) =>
    state.comment?.[replyId] || []

export default commentSlice.reducer
