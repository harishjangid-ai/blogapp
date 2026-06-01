import { createSlice } from "@reduxjs/toolkit";


interface chatPreviewState{
    chatPreview: boolean;
    id: string
}

const initialState: chatPreviewState = {
    chatPreview: false,
    id: ""
};

const chatPreviewSlice = createSlice({
    name: "chat",
    initialState,
    reducers:{
        setChatPreview: (state, action)=>{
            state.chatPreview = action.payload.chatPreview;
            state.id = action.payload.id;
        }
    }
});

export const { setChatPreview } = chatPreviewSlice.actions;
export default chatPreviewSlice.reducer;
