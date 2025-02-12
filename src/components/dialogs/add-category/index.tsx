'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'

// Third-party Imports

import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import { useDispatch, useSelector } from 'react-redux'

import { CircularProgress } from '@mui/material'

import type { CustomInputVerticalData } from '@core/components/custom-inputs/types'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import type { AppDispatch, RootState } from '@/redux-store/store'
import { createCategory, updateCategory } from '@/redux-store/slices/categorySlice'
import ProductImage from '@components/dialogs/add-jewellery/ProductImage'

type AddCategoryData = {
  _id: any
  name?: string
  parent?: any
  slug?: string
  images?: File[] | string[]
}

type AddCategoryProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: AddCategoryData
}

const customInputData: CustomInputVerticalData[] = [
  {
    title: 'Home',
    content: 'Delivery Time (7am - 9pm)',
    value: 'home',
    isSelected: true,
    asset: 'tabler-home'
  },
  {
    title: 'Office',
    content: 'Delivery Time (10am - 6pm)',
    value: 'office',
    asset: 'tabler-building-skyscraper'
  }
]

const AddCategory = ({ open, setOpen, data }: AddCategoryProps) => {
  // Vars
  const initialSelected: string = customInputData?.find(item => item.isSelected)?.value || ''

  // Useselector
  const { loading } = useSelector((state: RootState) => ({
    loading: state.categorySlice.loading
  }))

  // States
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selected, setSelected] = useState<string>(initialSelected)
  const dispatch = useDispatch<AppDispatch>()

  const [categoryData, setCategoryData] = useState<AddCategoryData>({
    _id: '',
    name: '',
    parent: '',
    slug: '',
    images: []
  })

  // const [category, setCategory] = useState<AddCategoryProps['data']>(initialAddressData)

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<AddCategoryData>({
    defaultValues: {
      name: '',
      parent: '',
      slug: ''
    }
  })

  useEffect(() => {
    if (open && data) {
      // Reset form data
      reset({
        name: data.name || '',
        parent: data.parent || '',
        slug: data.slug || ''
      })

      // Reset category data including images
      setCategoryData({
        _id: data._id || '',
        name: data.name || '',
        parent: data.parent || '',
        slug: data.slug || '',
        images: data.images || [] // This will set the existing images
      })
    } else if (open) {
      // Reset both form and category data to initial values
      reset({
        name: '',
        parent: '',
        slug: ''
      })
      setCategoryData({
        _id: '',
        name: '',
        parent: '',
        slug: '',
        images: []
      })
    }
  }, [open, data, reset])

  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    try {
      const form = new FormData()

      // Append non-file form data
      for (const key in formData) {
        if (formData.hasOwnProperty(key) && key !== '_id' && key !== 'images') {
          form.append(key, formData[key])
        }
      }

      // Handle images
      if (categoryData.images?.length) {
        categoryData.images.forEach((image: File | string) => {
          if (image instanceof File) {
            form.append('images', image)
          } else if (typeof image === 'string') {
            form.append('existingImages', image)
          }
        })
      }

      if (data?._id) {
        dispatch(updateCategory({ id: data._id, formData: form }))
      } else {
        dispatch(createCategory(form))
      }

      setOpen(false)
      reset()
    } catch (error: any) {
      console.log('Error posting data:', error)

      // Optionally handle error (show error message, etc.)
    }
  }

  return (
    <Dialog
      open={open}
      maxWidth='md'
      scroll='body'
      onClose={() => {
        setOpen(false)
        setSelected(initialSelected)
      }}
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {data ? 'Edit Category' : 'Add New Category'}
        <Typography component='span' className='flex flex-col text-center'>
          {data ? 'Edit Category' : 'Add newest launched Category'}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='pbs-0 sm:pli-16'>
          <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
          <Grid container spacing={6}>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='name'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    placeholder='Category Name'
                    label='Category Name'
                    variant='outlined'
                    {...(errors.name && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='slug'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Slug'
                    variant='outlined'
                    placeholder='Slug'
                    {...(errors.slug && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='parent'
                control={control}
                render={({ field }) => (
                  <CustomTextField fullWidth label='Parent' variant='outlined' placeholder='Parent' {...field} />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ProductImage setJewelleryData={setCategoryData} jewelleryData={categoryData} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button
            variant='contained'
            disabled={loading} // Disable button while loading
            startIcon={loading && <CircularProgress size={20} color='inherit' />}
            /* onClick={() => setOpen(false)} */ type='submit'
          >
            {loading ? 'Submitting...' : data ? 'Update' : 'Submit'}
          </Button>
          <Button
            variant='tonal'
            color='secondary'
            disabled={loading}
            onClick={() => {
              setOpen(false)
              setSelected(initialSelected)
            }}
            type='reset'
          >
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddCategory
