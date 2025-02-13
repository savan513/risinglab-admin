import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchContacts = createAsyncThunk('contact/fetchAll', async () => {
  const response = await axios.get('/api/apps/contact')

  return response.data
})

export const updateContactStatus = createAsyncThunk(
  'contact/updateStatus',
  async ({ id, status }: { id: string; status: string }) => {
    const response = await axios.patch(`/api/apps/contact/${id}`, { status })

    return response.data
  }
)

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    contacts: [] as ContactType[],
    loading: false,
    error: null as string | null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchContacts.pending, state => {
        state.loading = true
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false
        state.contacts = action.payload
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || null
      })
      .addCase(updateContactStatus.fulfilled, (state, action) => {
        const index = state.contacts.findIndex(contact => contact._id === action.payload._id)

        if (index !== -1) {
          state.contacts[index] = action.payload
        }
      })
  }
})

export default contactSlice.reducer

type ContactType = {
  _id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: 'pending' | 'completed'
  createdAt: string
}
