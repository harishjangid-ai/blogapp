import { createSlice } from "@reduxjs/toolkit";


interface previewState{
    preview: boolean;
    id: string
}

const initialState: previewState = {
    preview: false,
    id: ""
};

const previewSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setPreview: (state, action)=>{
            state.preview = action.payload.preview;
            state.id = action.payload.id;
        }
    }
});

export const { setPreview } = previewSlice.actions;
export default previewSlice.reducer;