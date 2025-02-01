import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: true
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login (state, action) {
            state.isAuthenticated = true,
            state.user = action.payload.user,
            state.loading = false  // Optional: add explicit loading setter
        },
        logout (state, action) {
            state.isAuthenticated = false,
            state.user = null,
            state.loading = true  // Optional: add explicit loading setter
        },
        
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer