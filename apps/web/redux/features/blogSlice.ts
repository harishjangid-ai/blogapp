import { createSlice } from "@reduxjs/toolkit";

interface Blog{
    title: string
    description: string,
}
interface blogState{
    blog: Blog | null;
}

const initialState: blogState = {
    blog: null
};

const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers:{
        setBlog: (state, action)=>{
            state.blog = action.payload.blog;
        }
    }
});

export const { setBlog } = blogSlice.actions;
export default blogSlice.reducer;