import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

interface CategoryState {
  fetchCategoriesData: any[]
  createCategoryData: any[]
  updateCategoryData: any[]
  deleteCategoryData: any[]
  loading: boolean
  error: string | null
  selectedCategory: any | null
}

const initialState: CategoryState = {
  createCategoryData: [],
  fetchCategoriesData: [],
  updateCategoryData: [],
  deleteCategoryData: [],
  loading: false,
  error: null,
  selectedCategory: null
}

// Async Thunks
export const fetchCategories = createAsyncThunk('category/fetchAll', async (filter: any = {}, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/apps/category', {
      params: {
        filter: JSON.stringify(filter)
      }
    })

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})

export const createCategory = createAsyncThunk('category/create', async (formData: any, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/apps/category', formData)

    toast.success('Jewellery added successfully')

    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})

export const updateCategory = createAsyncThunk(
  'category/update',
  async ({ id, formData }: { id: string; formData: any }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/apps/category/${id}`, formData)

      toast.success('Category updated successfully')

      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const deleteCategory = createAsyncThunk('category/delete', async (id: string, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/apps/category${id}`)

    return id
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message)
  }
})

const categorySlice = createSlice({
  name: 'category',
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
      .addCase(fetchCategories.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.fetchCategoriesData = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Create Category
      .addCase(createCategory.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false
        state.createCategoryData = action.payload
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Update Category
      .addCase(updateCategory.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false
        state.updateCategoryData = action.payload
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Delete Category
      .addCase(deleteCategory.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false
        state.deleteCategoryData = [action.payload] // Assigning the payload to an array
      })

      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { setSelectedCategory, clearError } = categorySlice.actions
export default categorySlice.reducer
