import { createSlice } from "@reduxjs/toolkit";

interface User{
    _id: string,
    role: string,
    userName: string,
    fullName: string,
}
interface authState{
    isAuth: boolean;
    user: User | null;
}

const initialState: authState = {
    isAuth: false,
    user: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setAuth: (state, action)=>{
            state.isAuth = action.payload.isAuth;
            state.user = action.payload.user;
        },
        logoutUser: (state)=>{
            state.isAuth = false,
            state.user = null
        }
    }
});

export const { setAuth, logoutUser } = authSlice.actions;
export default authSlice.reducer;