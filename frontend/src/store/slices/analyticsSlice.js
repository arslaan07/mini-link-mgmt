import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    analytics: {},
    loading: false
}

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setAnalytics(state, action) {
            state.analytics = action.payload
        },
        clearAnalytics(state, action) {
            state.analytics = {}
        }
    }
})

export const { setAnalytics, clearAnalytics } = analyticsSlice.actions
export default analyticsSlice.reducer