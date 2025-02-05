import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    urls: {}
}

const urlSlice = createSlice({
    name: 'url',
    initialState,
    reducers: {
        setUrls(state, action) {
            state.urls = action.payload
        }
    }
})

export const { setUrls } = urlSlice.actions
export default urlSlice.reducer