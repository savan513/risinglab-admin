'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import type { TextFieldProps } from '@mui/material/TextField'
import type { ButtonProps } from '@mui/material/Button'
import Switch from '@mui/material/Switch'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
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
import type { RankingInfo } from '@tanstack/match-sorter-utils'

import { useDispatch, useSelector } from 'react-redux'

import { Box, CircularProgress } from '@mui/material'

import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'

// Component Imports
import AddDiamondCategory from '@components/dialogs/add-diamond'
import type { AppDispatch, RootState } from '@/redux-store/store'
import { deleteDiamond, fetchDiamonds, updateDiamond } from '@/redux-store/slices/diamondSlice'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

export type categoryType = {
  _id: any
  id: number
  diamondName?: string
  brand?: string
  color?: string
  size?: string
  description?: any
  images?: any
  diamondType?: string
  weight?: string
  clarity?: string
  shape?: string
  cut?: string
  status?: any
}

type CategoryWithActionsType = categoryType & {
  actions?: string
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

// Column Definitions
const columnHelper = createColumnHelper<CategoryWithActionsType>()

const DiamondTable = () => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  const dispatch = useDispatch<AppDispatch>()

  // Useselector
  const { loading, fetchDiamondsData, createDiamondData, updateDiamondData, deleteDiamondData } = useSelector(
    (state: RootState) => ({
      fetchDiamondsData: state.diamondSlice.fetchDiamondsData,
      createDiamondData: state.diamondSlice.createDiamondData,
      updateDiamondData: state.diamondSlice.updateDiamondData,
      deleteDiamondData: state.diamondSlice.deleteDiamondData,
      loading: state.diamondSlice.loading
    })
  )

  useEffect(() => {
    dispatch(fetchDiamonds())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createDiamondData, updateDiamondData, deleteDiamondData])

  // Vars
  const buttonProps: ButtonProps = {
    variant: 'contained',
    children: 'Add Diamond Category',
    startIcon: <i className='tabler-plus' />
  }

  const iconButtonProps = {
    children: <i className='tabler-edit text-textSecondary' />
  }

  const handleClick = async (id: any) => {
    // Show SweetAlert2 confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      // Proceed with deletion logic here
      // For example, you could make an API call to delete the item
      dispatch(deleteDiamond(id)).then(res => {
        if (res.type === 'category/delete/fulfilled') {
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
        }
      })
    }
  }

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

      await dispatch(
        updateDiamond({
          id,
          formData: { status: newStatus }
        })
      ).unwrap()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const columns = useMemo<ColumnDef<CategoryWithActionsType, any>[]>(
    () => [
      // {
      //   id: 'select',
      //   header: ({ table }) => (
      //     <Checkbox
      //       {...{
      //         checked: table.getIsAllRowsSelected(),
      //         indeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler()
      //       }}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       {...{
      //         checked: row.getIsSelected(),
      //         disabled: !row.getCanSelect(),
      //         indeterminate: row.getIsSomeSelected(),
      //         onChange: row.getToggleSelectedHandler()
      //       }}
      //     />
      //   )
      // },
      columnHelper.accessor('diamondName', {
        header: 'Diamond Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-3' style={{ maxWidth: '250px' }}>
            <img src={row.original.images[0]} width={38} height={38} className='rounded bg-actionHover' />
            <div className='flex flex-col items-start overflow-hidden'>
              <Typography className='font-medium truncate w-full' color='text.primary'>
                {row.original.diamondName}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('diamondType', {
        header: 'Diamond Type',
        cell: ({ row }) => <Typography>{row.original.diamondType}</Typography>
      }),
      columnHelper.accessor('brand', {
        header: 'Brand',
        cell: ({ row }) => <Typography>{row.original.brand}</Typography>
      }),
      columnHelper.accessor('color', {
        header: 'Color',
        cell: ({ row }) => <Typography>{row.original.color}</Typography>
      }),
      columnHelper.accessor('shape', {
        header: 'Shape',
        cell: ({ row }) => <Typography>{row.original.shape}</Typography>
      }),
      columnHelper.accessor('weight', {
        header: 'Weight',
        cell: ({ row }) => <Typography>{row.original.weight}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <Switch
              checked={row.original.status === 'active'}
              onChange={() => handleStatusToggle(row.original._id, row.original.status)}
              color='success'
            />
            <Typography className='mis-2 capitalize'>{row.original.status || 'active'}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <OpenDialogOnElementClick
              element={IconButton}
              elementProps={iconButtonProps}
              dialog={AddDiamondCategory}
              dialogProps={row.original}
            />
            <IconButton onClick={() => handleClick(row.original._id)}>
              <i className='tabler-trash text-textSecondary' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  )

  const table = useReactTable({
    data: fetchDiamondsData as any[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
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
      <h1 className=''>Diamond Management</h1>
      <Card>
        <div className='flex flex-wrap justify-between gap-4 p-6'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search'
            className='max-sm:is-full'
          />
          <div className='flex max-sm:flex-col items-start sm:items-center gap-4 max-sm:is-full'>
            <CustomTextField
              select
              value={table.getState().pagination.pageSize}
              onChange={e => table.setPageSize(Number(e.target.value))}
              className='flex-auto max-sm:is-full sm:is-[70px]'
            >
              <MenuItem value='10'>10</MenuItem>
              <MenuItem value='15'>15</MenuItem>
              <MenuItem value='25'>25</MenuItem>
            </CustomTextField>
            <OpenDialogOnElementClick element={Button} elementProps={buttonProps} dialog={AddDiamondCategory} />
          </div>
        </div>
        <div className='overflow-x-auto'>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingY: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <table className={tableStyles.table}>
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id}>
                          {header.isPlaceholder ? null : (
                            <>
                              <div
                                className={classnames({
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
                            </>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                {table.getFilteredRowModel().rows.length === 0 ? (
                  <tbody>
                    <tr>
                      <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                        No data available
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {table
                      .getRowModel()
                      .rows.slice(0, table.getState().pagination.pageSize)
                      .map(row => {
                        return (
                          <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                            {row.getVisibleCells().map(cell => (
                              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                            ))}
                          </tr>
                        )
                      })}
                  </tbody>
                )}
              </table>
            </>
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
    </>
  )
}

export default DiamondTable
