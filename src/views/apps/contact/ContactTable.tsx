'use client'

import { useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { createColumnHelper } from '@tanstack/react-table'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import { toast } from 'react-toastify'
import Backdrop from '@mui/material/Backdrop'
import { useTheme } from '@mui/material/styles'

import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import { fetchContacts, updateContactStatus } from '@/redux-store/slices/contactSlice'
import type { AppDispatch, RootState } from '@/redux-store/store'

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

const columnHelper = createColumnHelper<ContactType>()

const ContactTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)

  const { loading, contacts } = useSelector((state: RootState) => ({
    loading: state.contactSlice.loading,
    contacts: state.contactSlice.contacts
  }))

  const theme = useTheme()

  useEffect(() => {
    dispatch(fetchContacts())
  }, [dispatch])

  const handleStatusClick = (event: React.MouseEvent<HTMLElement>, contactId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedContact(contactId)
  }

  const handleStatusChange = async (newStatus: 'pending' | 'completed') => {
    if (selectedContact) {
      try {
        setStatusLoading(true)
        await dispatch(updateContactStatus({ id: selectedContact, status: newStatus })).unwrap()
        toast.success('Status updated successfully')
      } catch (error) {
        toast.error('Failed to update status')
      } finally {
        setStatusLoading(false)
        setAnchorEl(null)
        setSelectedContact(null)
      }
    }
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => <Typography>{row.original.name}</Typography>
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Typography>{row.original.email}</Typography>
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: ({ row }) => <Typography>{row.original.phone}</Typography>
      }),
      columnHelper.accessor('subject', {
        header: 'Subject',
        cell: ({ row }) => <Typography>{row.original.subject}</Typography>
      }),
      columnHelper.accessor('message', {
        header: 'Message',
        cell: ({ row }) => (
          <Typography
            sx={{
              maxWidth: '200px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {row.original.message}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={row.original.status}
              color={row.original.status === 'completed' ? 'success' : 'warning'}
              size='small'
            />
            <IconButton size='small' onClick={e => handleStatusClick(e, row.original._id)}>
              <i className='tabler-edit text-textSecondary' />
            </IconButton>
          </Box>
        )
      }),
      columnHelper.accessor('createdAt', {
        header: 'Date',
        cell: ({ row }) => <Typography>{new Date(row.original.createdAt).toLocaleDateString()}</Typography>
      })
    ],
    []
  )

  return (
    <>
      <h1>Contact Enquiries</h1>
      <Card>
        <div className='overflow-x-auto'>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  {columns.map((column: any) => (
                    <th key={column._id}>{typeof column.header === 'function' ? column.header({}) : column.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.map(contact => (
                  <tr key={contact._id}>
                    {columns.map((column: any) => (
                      <td key={column._id}>{column.cell({ row: { original: contact } } as any)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => handleStatusChange('pending')}>Pending</MenuItem>
        <MenuItem onClick={() => handleStatusChange('completed')}>Completed</MenuItem>
      </Menu>

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: theme => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.7)'
        }}
        open={statusLoading}
      >
        <CircularProgress color='primary' />
      </Backdrop>
    </>
  )
}

export default ContactTable
