import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import categorySlice from '@/redux-store/slices/categorySlice'
import diamondSlice from '@/redux-store/slices/diamondSlice'
import jewllerySlice from '@/redux-store/slices/jewellerySlice'
import contactSlice from './slices/contactSlice'

export const store = configureStore({
  reducer: {
    categorySlice,
    diamondSlice,
    jewllerySlice,
    contactSlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
