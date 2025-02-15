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
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import classnames from 'classnames'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/core'

// Type Import
import { Backdrop, Card, CardContent, CircularProgress, Divider, FormHelperText } from '@mui/material'

import { toast } from 'react-toastify'

import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import { useDispatch, useSelector } from 'react-redux'

import CreatableSelect from 'react-select/creatable'

import type { CustomInputVerticalData } from '@core/components/custom-inputs/types'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import CustomIconButton from '@/@core/components/mui/IconButton'
import ProductImage from './../add-jewellery/ProductImage'
import type { AppDispatch, RootState } from '@/redux-store/store'
import { fetchCategories } from '@/redux-store/slices/categorySlice'
import { createDiamond, updateDiamond } from '@/redux-store/slices/diamondSlice'

type AddDiamondCategoryData = {
  _id?: any
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
  category?: string
}

type AddDiamondCategoryProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: AddDiamondCategoryData
}

const initialAddressData: AddDiamondCategoryProps['data'] = {
  _id: '',
  diamondName: '',
  brand: '',
  color: '',
  size: '',
  description: '',
  images: [],
  diamondType: '',
  weight: '',
  clarity: '',
  shape: '',
  cut: '',
  category: ''
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

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-6 pbe-4 pli-6'>
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className={classnames('tabler-bold', { 'text-textSecondary': !editor.isActive('bold') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className={classnames('tabler-underline', { 'text-textSecondary': !editor.isActive('underline') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className={classnames('tabler-italic', { 'text-textSecondary': !editor.isActive('italic') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className={classnames('tabler-strikethrough', { 'text-textSecondary': !editor.isActive('strike') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i
          className={classnames('tabler-align-left', { 'text-textSecondary': !editor.isActive({ textAlign: 'left' }) })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <i
          className={classnames('tabler-align-center', {
            'text-textSecondary': !editor.isActive({ textAlign: 'center' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <i
          className={classnames('tabler-align-right', {
            'text-textSecondary': !editor.isActive({ textAlign: 'right' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <i
          className={classnames('tabler-align-justified', {
            'text-textSecondary': !editor.isActive({ textAlign: 'justify' })
          })}
        />
      </CustomIconButton>
    </div>
  )
}

const AddDiamondCategory = ({ open, setOpen, data }: AddDiamondCategoryProps) => {
  // Vars
  const initialSelected: string = customInputData?.find(item => item.isSelected)?.value || ''

  // States
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selected, setSelected] = useState<string>(initialSelected)

  const [diamondCategoryData, setDiamondCategoryData] = useState<AddDiamondCategoryProps['data']>(initialAddressData)
  const [categoryData, setCategoryData] = useState<any>([])
  const dispatch = useDispatch<AppDispatch>()

  // Useselector
  const { loading, fetchCategoriesData } = useSelector((state: RootState) => ({
    loading: state.diamondSlice.loading,
    fetchCategoriesData: state.categorySlice.fetchCategoriesData
  }))

  useEffect(() => {
    if (open) {
      const filter = { parent: '67a11386f8bba178b89e62c4' }

      dispatch(fetchCategories(filter)).then(res => {
        if (res.type === 'category/fetchAll/fulfilled') {
          setCategoryData(res.payload)
        }
      })
    }

    if (open) {
      setDiamondCategoryData(data ?? initialAddressData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, data, categoryData.length, dispatch])

  // Hooks
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<AddDiamondCategoryData>({
    defaultValues: {
      category: '',
      diamondName: '',
      brand: '',
      color: '',
      size: '',
      description: data?.description || '',
      diamondType: '',
      weight: '',
      clarity: '',
      shape: '',
      cut: ''
    }
  })

  const editor: any = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something here...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],
    immediatelyRender: false,
    content: data?.description || '<p>Write your description here...</p>',
    onUpdate: ({ editor }) => {
      setValue('description', editor.getHTML())
    }
  })

  useEffect(() => {
    if (open && data) {
      reset({
        _id: data._id || '',
        category: data.category || '',
        diamondName: data.diamondName || '',
        brand: data.brand || '',
        color: data.color || '',
        size: data.size || '',
        description: data.description || '',
        diamondType: data.diamondType || '',
        weight: data.weight || '',
        clarity: data.clarity || '',
        shape: data.shape || '',
        cut: data.cut || ''
      })
    } else if (open) {
      // Reset to initial values if no data provided
      reset({
        _id: '',
        category: '',
        diamondName: '',
        brand: '',
        color: '',
        size: '',
        description: '',
        diamondType: '',
        weight: '',
        clarity: '',
        shape: '',
        cut: ''
      })
    }
  }, [open, data, reset])

  useEffect(() => {
    if (fetchCategoriesData.length > 0) {
      setCategoryData(fetchCategoriesData)
    }
  }, [fetchCategoriesData])

  useEffect(() => {
    if (editor && data?.description) {
      editor.commands.setContent(data.description)
      setValue('description', data.description)
    }

    // return () => editor?.off('update'); // Clean up the event listener
  }, [editor, data, setValue])

  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    try {
      console.log('formData :==> ', formData)

      if (diamondCategoryData?.images === undefined || diamondCategoryData.images.length === 0) {
        toast.error('Please upload at least one image.')

        return
      }

      const form = new FormData()

      // Assuming jewelleryData is an object, loop through it to append each field
      for (const key in formData) {
        if (formData.hasOwnProperty(key) && key !== '_id') {
          form.append(key, formData[key])
        }
      }

      // If jewelleryData.images exists and is an array of File objects (for image uploads)
      if (diamondCategoryData.images && Array.isArray(diamondCategoryData.images)) {
        diamondCategoryData.images.forEach((image: File) => {
          form.append('images', image) // Appending each image as 'images' key
        })
      }

      // Check if we are in edit mode (i.e., _id exists in data)
      if (data != undefined) {
        dispatch(updateDiamond({ id: data._id, formData: form })).then(res => {
          if (res.type === 'diamond/update/fulfilled') {
            setOpen(false)
            setDiamondCategoryData(initialAddressData)
            reset()
          }
        })
      } else {
        dispatch(createDiamond(form)).then(res => {
          if (res.type === 'diamond/create/fulfilled') {
            setOpen(false)
            setDiamondCategoryData(initialAddressData)
            reset()
          }
        })
      }
    } catch (error: any) {
      console.log('Error posting data:', error)
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
        {data ? 'Edit Diamond Category' : 'Add New Diamond Category'}
        <Typography component='span' className='flex flex-col text-center'>
          {data ? 'Edit Diamond Category' : 'Add newest launched Diamond Category'}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='pbs-0 sm:pli-16'>
          <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
              <Controller
                name='diamondName'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    placeholder='Diamond Name'
                    label='Diamond Name'
                    variant='outlined'
                    {...(errors.diamondName && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='category'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Category'
                    variant='outlined'
                    {...field}
                    error={Boolean(errors.category)}
                  >
                    {categoryData?.map((category: any, index: any) => (
                      <MenuItem key={index} value={category?._id}>
                        {category?.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
              {errors.shape && <FormHelperText error>This field is required.</FormHelperText>}
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='diamondType'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Diamond Type'
                    variant='outlined'
                    placeholder='Diamond Type'
                    {...(errors.diamondType && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='brand'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Brand'
                    variant='outlined'
                    placeholder='Brand'
                    {...field}
                    {...(errors.brand && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='color'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Color'
                    variant='outlined'
                    placeholder='Color'
                    {...field}
                    {...(errors.color && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='size'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Size'
                    variant='outlined'
                    placeholder='Size (in mm)'
                    {...field}
                    {...(errors.size && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='weight'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Weight'
                    variant='outlined'
                    placeholder='Weight (in CT)'
                    {...field}
                    {...(errors.weight && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='clarity'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Clarity'
                    variant='outlined'
                    placeholder='Clarity'
                    {...field}
                    {...(errors.clarity && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='shape'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <>
                    <Typography component='label' className='block text-textPrimary' sx={{ fontSize: '0.800rem' }}>
                      Shape
                    </Typography>
                    <CreatableSelect
                      isClearable
                      value={field.value ? { label: field.value, value: field.value } : null}
                      onChange={(newValue: any) => field.onChange(newValue?.value || '')}
                      options={[
                        { value: 'Round', label: 'Round' },
                        { value: 'Princess', label: 'Princess' },
                        { value: 'Emerland', label: 'Emerland' },
                        { value: 'Marquise', label: 'Marquise' },
                        { value: 'Pear', label: 'Pear' },
                        { value: 'Heart', label: 'Heart' },
                        { value: 'Radient', label: 'Radient' },
                        { value: 'Cushion', label: 'Cushion' },
                        { value: 'Oval', label: 'Oval' },
                        { value: 'Asscher', label: 'Asscher' },
                        { value: 'Calf', label: 'Calf' }
                      ]}
                      styles={{
                        control: (base: any, state: any) => ({
                          ...base,
                          minHeight: '40px',
                          borderColor: errors.shape ? '#FF4C51' : state.isFocused ? '#7367F0' : '#E4E4E4',
                          '&:hover': {
                            borderColor: '#7367F0'
                          }
                        }),
                        placeholder: (base: any) => ({
                          ...base,
                          color: '#999'
                        })
                      }}
                      placeholder='Select or type shape...'
                    />
                    {errors.shape && <FormHelperText error>This field is required.</FormHelperText>}
                  </>
                )}
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='cut'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Diamond Cut'
                    variant='outlined'
                    placeholder='Diamond Cut'
                    {...field}
                    {...(errors.cut && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography className='mbe-1'>Description (Optional)</Typography>
              <Card className='p-0 border shadow-none'>
                <CardContent className='p-0'>
                  <EditorToolbar editor={editor} />
                  <Divider className='mli-6' />
                  <Controller
                    name='description'
                    control={control}
                    render={({ field }) => (
                      <EditorContent
                        editor={editor}
                        className='bs-[135px] overflow-y-auto flex [&_.ProseMirror]:border-0 [&_.ProseMirror]:outline-none'
                        {...field}
                      />
                    )}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ProductImage setJewelleryData={setDiamondCategoryData} jewelleryData={diamondCategoryData} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button
            variant='contained'
            disabled={loading} // Disable button while loading
            startIcon={loading && <CircularProgress size={20} color='inherit' />}
            type='submit'
          >
            {loading ? 'Submitting...' : data ? 'Update' : 'Submit'}
          </Button>
          <Button
            variant='tonal'
            color='secondary'
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
      <Backdrop sx={theme => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Dialog>
  )
}

export default AddDiamondCategory
