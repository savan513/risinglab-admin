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
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'

// Third-party Imports
import classnames from 'classnames'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/core'
import CreatableSelect from 'react-select/creatable'

// Type Import
import {
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material'

import { toast } from 'react-toastify'

import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import { useDispatch, useSelector } from 'react-redux'

import type { CustomInputVerticalData } from '@core/components/custom-inputs/types'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import CustomIconButton from '@/@core/components/mui/IconButton'
import ProductImage from './ProductImage'
import { fetchCategories } from '@/redux-store/slices/categorySlice'
import type { AppDispatch, RootState } from '@/redux-store/store'
import { createJewellery, updateJewellery } from '@/redux-store/slices/jewellerySlice'

type AddJewelleryData = {
  _id: any
  category?: any
  jewelleryName?: string
  brand?: string
  color?: any
  size?: any
  sku?: string
  price?: string
  shape?: string
  p_description?: any
  description?: any
  images?: any
}

type AddJewelleryProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: AddJewelleryData
}

const initialAddressData: AddJewelleryProps['data'] = {
  _id: '',
  category: '',
  jewelleryName: '',
  brand: '',
  color: [],
  size: [],
  sku: '',
  price: '',
  p_description: '',
  description: '',
  shape: '',
  images: []
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
      <CustomIconButton
        {...(editor.isActive('heading', { level: 1 }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <i className={classnames('tabler-h-1', { 'text-textSecondary': !editor.isActive('heading', { level: 1 }) })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('heading', { level: 2 }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <i className={classnames('tabler-h-2', { 'text-textSecondary': !editor.isActive('heading', { level: 2 }) })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('heading', { level: 3 }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <i className={classnames('tabler-h-3', { 'text-textSecondary': !editor.isActive('heading', { level: 3 }) })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('heading', { level: 4 }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        <i className={classnames('tabler-h-4', { 'text-textSecondary': !editor.isActive('heading', { level: 4 }) })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('heading', { level: 5 }) && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
      >
        <i className={classnames('tabler-h-5', { 'text-textSecondary': !editor.isActive('heading', { level: 5 }) })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('bulletList') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <i className={classnames('tabler-list', { 'text-textSecondary': !editor.isActive('bulletList') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('blockquote') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <i className={classnames('tabler-quote', { 'text-textSecondary': !editor.isActive('blockquote') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('code') && { color: 'primary' })}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <i className={classnames('tabler-code', { 'text-textSecondary': !editor.isActive('code') })} />
      </CustomIconButton>
      <CustomIconButton
        disabled={!editor.can().chain().focus().undo().run()}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().undo().run()}
      >
        <i className='tabler-arrow-back-up' />
      </CustomIconButton>

      <CustomIconButton
        disabled={!editor.can().chain().focus().redo().run()}
        variant='tonal'
        size='small'
        onClick={() => editor.chain().focus().redo().run()}
      >
        <i className='tabler-arrow-forward-up' />
      </CustomIconButton>
    </div>
  )
}

const CreatableSelectField = ({ name, control, label, options, formatOptionLabel, required = false }: any) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field }) => (
        <CreatableSelect
          {...field}
          isMulti
          isClearable
          options={options}
          className='react-select'
          classNamePrefix='select'
          placeholder={`Select or create ${label.toLowerCase()}...`}
          formatOptionLabel={formatOptionLabel}
          onChange={val => {
            const values = val
              ? val.map(v => {
                  const cleanValue = v.value.split(',')[0].trim().toLowerCase()

                  return cleanValue
                })
              : []

            field.onChange(values)
          }}
          value={
            Array.isArray(field.value)
              ? field.value.map(value => ({
                  label: value.charAt(0).toUpperCase() + value.slice(1),
                  value: value
                }))
              : []
          }
          styles={{
            control: base => ({
              ...base,
              minHeight: '56px'
            }),
            menu: base => ({
              ...base,
              zIndex: 9999
            })
          }}
        />
      )}
    />
  )
}

const AddJewellery = ({ open, setOpen, data }: AddJewelleryProps) => {
  // Vars
  const initialSelected: string = customInputData?.find(item => item.isSelected)?.value || ''

  // States
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selected, setSelected] = useState<string>(initialSelected)
  const [jewelleryData, setJewelleryData] = useState<AddJewelleryProps['data']>(initialAddressData)
  const [categoryData, setCategoryData] = useState<any>([])
  const dispatch = useDispatch<AppDispatch>()

  // Useselector
  const { loading, fetchCategoriesData } = useSelector((state: RootState) => ({
    loading: state.jewllerySlice.loading,
    fetchCategoriesData: state.categorySlice.fetchCategoriesData
  }))

  useEffect(() => {
    if (open) {
      const filter = { parent: '67a11573f8bba178b89e62c9' }

      dispatch(fetchCategories(filter)).then(res => {
        if (res.type === 'category/fetchAll/fulfilled') {
          setCategoryData(res.payload)
        }
      })
    }

    if (open) {
      setJewelleryData(data ?? initialAddressData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, data, categoryData.length, dispatch])

  // Hooks
  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm<AddJewelleryData>({
    defaultValues: {
      _id: '',
      category: '',
      jewelleryName: '',
      brand: '',
      color: [],
      size: [],
      sku: '',
      price: '',
      description: data?.description || '',
      p_description: data?.p_description || ''
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

  const editor2: any = useEditor({
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
    content: data?.p_description || '<p>Write your description here...</p>',
    onUpdate: ({ editor }) => {
      setValue('p_description', editor.getHTML())
    }
  })

  useEffect(() => {
    if (open && data) {
      const normalizedSize = data.size?.length === 1 && data.size[0].includes(',') ? data.size[0].split(',') : data.size

      const normalizedColor: any =
        data.color?.length === 1 && data.color[0].includes(',') ? data.color[0].split(',') : data.color

      reset({
        _id: data._id || '',
        category: data.category || '',
        jewelleryName: data.jewelleryName || '',
        brand: data.brand || '',
        color: normalizedColor || [],
        size: normalizedSize || [],
        sku: data.sku || '',
        price: data.price || '',
        description: data.description || '',
        p_description: data.p_description || ''
      })
    } else if (open) {
      // Reset to initial values if no data provided
      reset({
        _id: '',
        category: '',
        jewelleryName: '',
        brand: '',
        color: [],
        size: [],
        sku: '',
        price: '',
        description: '',
        p_description: ''
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

    if (editor2 && data?.p_description) {
      editor2.commands.setContent(data.p_description)
      setValue('p_description', data.p_description)
    }

    // return () => editor?.off('update'); // Clean up the event listener
  }, [editor, editor2, data, setValue])

  const onSubmit: SubmitHandler<any> = async (formData: any) => {
    try {
      if (jewelleryData?.images === undefined || jewelleryData.images.length === 0) {
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
      if (jewelleryData.images && Array.isArray(jewelleryData.images)) {
        jewelleryData.images.forEach((image: File) => {
          form.append('images', image) // Appending each image as 'images' key
        })
      }

      // Check if we are in edit mode (i.e., _id exists in data)
      if (data != undefined) {
        dispatch(updateJewellery({ id: data._id, formData: form })).then(res => {
          if (res.type === 'jewellery/update/fulfilled') {
            reset()
            setOpen(false)
            setJewelleryData(initialAddressData)

            if (editor) {
              editor.commands.setContent('<p>Write your description here...</p>')
            }

            if (editor2) {
              editor2.commands.setContent('<p>Write your description here...</p>')
            }
          }
        })
      } else {
        dispatch(createJewellery(form)).then(res => {
          if (res.type === 'jewellery/create/fulfilled') {
            reset()
            setOpen(false)
            setJewelleryData(initialAddressData)

            if (editor) {
              editor.commands.setContent('<p>Write your description here...</p>')
            }

            if (editor2) {
              editor2.commands.setContent('<p>Write your description here...</p>')
            }
          }
        })
      }
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
        {data ? 'Edit Jewellery' : 'Add New Jewellery'}
        <Typography component='span' className='flex flex-col text-center'>
          {data ? 'Edit Jewellery' : 'Add newest launched jewellery'}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='pbs-0 sm:pli-16'>
          <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                name='jewelleryName'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='Jewellery Name'
                    variant='outlined'
                    placeholder='Bracelet'
                    {...field}
                    {...(errors.jewelleryName && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
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

            <Grid size={{ xs: 12, sm: 4 }}>
              <CreatableSelectField
                name='color'
                control={control}
                label='Color'
                required={true}
                options={[
                  { label: 'Red', value: 'red' },
                  { label: 'Blue', value: 'blue' },
                  { label: 'Green', value: 'green' },
                  { label: 'Yellow', value: 'yellow' },
                  { label: 'Black', value: 'black' },
                  { label: 'White', value: 'white' },
                  { label: 'Pink', value: 'pink' }
                ]}
                formatOptionLabel={({ label, value }: any) => (
                  <span className='flex items-center gap-2'>
                    <span
                      className='w-4 h-4 rounded-full'
                      style={{
                        backgroundColor: value,
                        display: 'inline-block',
                        border: '1px solid #ddd'
                      }}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{label}</span>
                  </span>
                )}
              />
              {errors.color && <FormHelperText error>Please select at least one color.</FormHelperText>}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <CreatableSelectField
                name='size'
                control={control}
                label='Size'
                options={[
                  { label: 'Small', value: 'small' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'Large', value: 'large' },
                  { label: 'XL', value: 'xl' },
                  { label: '2XL', value: '2xl' }
                ]}
                formatOptionLabel={({ label }: any) => <span style={{ textTransform: 'capitalize' }}>{label}</span>}
              />
              {errors.size && <FormHelperText error>Please select at least one size.</FormHelperText>}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
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
                name='sku'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    fullWidth
                    label='SKU'
                    variant='outlined'
                    placeholder='MNK-001'
                    {...field}
                    {...(errors.sku && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Controller
                name='price'
                rules={{ required: true }}
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    type='number'
                    inputProps={{ min: 0 }}
                    fullWidth
                    label='Price'
                    variant='outlined'
                    placeholder='₹ 199'
                    {...field}
                    {...(errors.price && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography className='mbe-1'>Primary Description (Optional)</Typography>
              <Card className='p-0 border shadow-none w-full'>
                <CardContent className='p-0'>
                  <EditorToolbar editor={editor2} />
                  <Divider className='mli-6' />
                  <Controller
                    name='p_description'
                    control={control}
                    render={({ field }) => (
                      <EditorContent
                        editor={editor2}
                        className='w-full h-full flex-grow overflow-y-auto 
                       [&_.ProseMirror]:border-0 [&_.ProseMirror]:outline-none 
                       [&_.ProseMirror]:w-full [&_.ProseMirror]:min-h-[135px] 
                       [&_.ProseMirror]:h-full [&_.ProseMirror]:p-4'
                        {...field}
                      />
                    )}
                  />
                </CardContent>
              </Card>
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
                        className='w-full h-full flex-grow overflow-y-auto 
                       [&_.ProseMirror]:border-0 [&_.ProseMirror]:outline-none 
                       [&_.ProseMirror]:w-full [&_.ProseMirror]:min-h-[135px] 
                       [&_.ProseMirror]:h-full [&_.ProseMirror]:p-4'
                        {...field}
                      />
                    )}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ProductImage setJewelleryData={setJewelleryData} jewelleryData={jewelleryData} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button
            variant='contained'
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color='inherit' />}
            type='submit'
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

export default AddJewellery
