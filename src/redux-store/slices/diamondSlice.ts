import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

interface CategoryState {
  fetchDiamondsData: any[]
  createDiamondData: any[]
  updateDiamondData: any[]
  deleteDiamondData: any[]
  loading: boolean
  error: string | null
  selectedCategory: any | null
}

const initialState: CategoryState = {
  createDiamondData: [],
  fetchDiamondsData: [],
  updateDiamondData: [],
  deleteDiamondData: [],
  loading: false,
  error: null,
  selectedCategory: null
}

// Async Thunks
export const fetchDiamonds = createAsyncThunk<[any], void>('diamond/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/apps/diamond')

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})

export const createDiamond = createAsyncThunk('diamond/create', async (formData: any, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/apps/diamond', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    toast.success('New Diamond added successfully')

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})

export const updateDiamond = createAsyncThunk(
  'diamond/update',
  async ({ id, formData }: { id: string; formData: any }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/apps/diamond/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success('Diamond updated successfully')

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const deleteDiamond = createAsyncThunk('diamond/delete', async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/apps/diamond/${id}`)

    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})

const diamondSlice = createSlice({
  name: 'diamond',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<any | null>) => {
      state.selectedCategory = action.payload
    },
    clearError: state => {
      state.error = null
    }
  },
  extraReducers: builder => {
    builder

      // Fetch Categories
      .addCase(fetchDiamonds.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDiamonds.fulfilled, (state, action) => {
        state.loading = false
        state.fetchDiamondsData = action.payload
      })
      .addCase(fetchDiamonds.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Create Category
      .addCase(createDiamond.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(createDiamond.fulfilled, (state, action) => {
        state.loading = false
        state.createDiamondData = action.payload
      })
      .addCase(createDiamond.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update Category
      .addCase(updateDiamond.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(updateDiamond.fulfilled, (state, action) => {
        state.loading = false
        state.updateDiamondData = action.payload
      })
      .addCase(updateDiamond.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Delete Category
      .addCase(deleteDiamond.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteDiamond.fulfilled, (state, action) => {
        state.loading = false
        state.deleteDiamondData = [action.payload] // Assigning the payload to an array
      })

      .addCase(deleteDiamond.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { setSelectedCategory, clearError } = diamondSlice.actions
export default diamondSlice.reducer
