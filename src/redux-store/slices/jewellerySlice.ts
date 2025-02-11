import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

interface Jewelleryprops {
  filter?: any[]
}

interface CategoryState {
  fetchJewelleriesData: any[]
  createJewelleryData: any[]
  updateJewelleryData: any[]
  deleteJewelleryData: any[]
  loading: boolean
  error: string | null
  selectedCategory: any | null
}

const initialState: CategoryState = {
  createJewelleryData: [],
  fetchJewelleriesData: [],
  updateJewelleryData: [],
  deleteJewelleryData: [],
  loading: false,
  error: null,
  selectedCategory: null
}

// Async Thunks
export const fetchJewelleries = createAsyncThunk(
  'jewellery/fetchAll',
  async (filter: Jewelleryprops, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/apps/jewellery', {
        params: {
          filter: JSON.stringify(filter)
        }
      })

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const createJewellery = createAsyncThunk('jewellery/create', async (formData: any, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/apps/jewellery', formData)

    toast.success('Jewellery added successfully')

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})

export const updateJewellery = createAsyncThunk(
  'jewellery/update',
  async ({ id, formData }: { id: string; formData: any }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/apps/jewellery/${id}`, formData)

      toast.success('Jewellery updated successfully')

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const deleteJewellery = createAsyncThunk('jewellery/delete', async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/apps/jewellery/${id}`)

    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})

const jewllerySlice = createSlice({
  name: 'jewellery',
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
      .addCase(fetchJewelleries.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchJewelleries.fulfilled, (state, action) => {
        state.loading = false
        state.fetchJewelleriesData = action.payload
      })
      .addCase(fetchJewelleries.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Create Category
      .addCase(createJewellery.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(createJewellery.fulfilled, (state, action) => {
        state.loading = false
        state.createJewelleryData = action.payload
      })
      .addCase(createJewellery.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update Category
      .addCase(updateJewellery.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(updateJewellery.fulfilled, (state, action) => {
        state.loading = false
        state.updateJewelleryData = action.payload
      })
      .addCase(updateJewellery.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Delete Category
      .addCase(deleteJewellery.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteJewellery.fulfilled, (state, action) => {
        state.loading = false
        state.deleteJewelleryData = [action.payload] // Assigning the payload to an array
      })

      .addCase(deleteJewellery.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { setSelectedCategory, clearError } = jewllerySlice.actions
export default jewllerySlice.reducer
