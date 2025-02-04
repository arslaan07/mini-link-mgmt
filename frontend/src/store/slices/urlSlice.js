import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    searchQuery: '',
}

const urlSlice = createSlice({
    name: 'url',
    initialState,
    reducers: {
        setSearchQuery(state, action) {
            state.searchQuery = action.payload
        },
        clearSearchQuery(state, action) {
            state.searchQuery = ''
        },
    }
})

export const { setSearchQuery, clearSearchQuery } = urlSlice.actions
export default urlSlice.reducer