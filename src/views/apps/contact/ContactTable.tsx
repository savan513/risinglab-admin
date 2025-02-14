'use client'

import { useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
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

import { TablePagination, type TextFieldProps } from '@mui/material'

import classNames from 'classnames'

import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import { fetchContacts, updateContactStatus } from '@/redux-store/slices/contactSlice'
import type { AppDispatch, RootState } from '@/redux-store/store'
import TablePaginationComponent from '@/components/TablePaginationComponent'

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

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const ContactTable = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedContact, setSelectedContact] = useState<string | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')

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

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value)

    // Store the itemRank info
    addMeta({
      itemRank
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
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

  const columns = useMemo<ColumnDef<ContactType, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => (
          <Typography className='font-medium truncate w-full' color='text.primary'>
            {row.original.name}
          </Typography>
        )
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
          <Typography sx={{ maxWidth: '200px' }} className='truncate'>
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

  const table = useReactTable({
    data: contacts,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <>
      <h1>Contact Enquiries</h1>
      <Card>
        <div className='flex flex-wrap justify-between gap-4 p-6'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search'
            className='max-sm:is-full'
          />
        </div>
        <div className='overflow-x-auto'>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <table className={tableStyles.table}>
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={classNames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='tabler-chevron-up text-xl' />,
                              desc: <i className='tabler-chevron-down text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
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
