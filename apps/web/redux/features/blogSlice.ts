import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BlogBlock {
  type: "heading1" | "heading2" | "heading3" | "paragraph";
  text: string;
}

export interface Blog {
  title: string;
  description: BlogBlock[];
}

interface BlogState {
  blog: Blog | null;
}

const initialState: BlogState = {
  blog: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlog: (state, action: PayloadAction<{ blog: Blog | null }>) => {
      state.blog = action.payload.blog;
    },
  },
});

export const { setBlog } = blogSlice.actions;
export default blogSlice.reducer;