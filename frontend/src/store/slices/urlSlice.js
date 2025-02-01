import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    urls: [],
    loading: false,
}

const urlSlice = createSlice({
    name: 'url',
    initialState,
    reducers: {
        setUrl(state, action) {
            state.urls = action.payload
        },
        addUrl(state, action) {
            state.urls.push(action.payload)
        },
        deleteUrl(state, action) {
            state.urls = state.urls.filter((url) => url.id !== action.payload)
        }
    }
})

export const { setUrl, addUrl, deleteUrl } = urlSlice.actions
export default urlSlice.reducer