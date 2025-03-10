import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    urlCount: 0,
}

const urlSlice = createSlice({
    name: 'url',
    initialState,
    reducers: {
        incrementUrlCount(state) {
            state.urlCount += 1
        },
        decrementUrlCount(state) {
            state.urlCount -= 1
        },
        setUrlCount(state, action) {
            state.urlCount = action.payload
        },
        
    }
})

export const { incrementUrlCount, decrementUrlCount, setUrlCount } = urlSlice.actions
export default urlSlice.reducer