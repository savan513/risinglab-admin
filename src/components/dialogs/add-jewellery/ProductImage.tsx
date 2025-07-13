'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

// Component Imports
import Link from '@components/Link'
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

type FileType = File | string

type PreviewType = {
  file: FileType
  type: 'image' | 'video'
} | null

// Styled Components
const PreviewContainer = styled('div')({
  position: 'relative',
  cursor: 'pointer',
  '&:hover': {
    '& .preview-overlay': {
      opacity: 1
    }
  }
})

const PreviewOverlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0, 0, 0, 0.4)',
  opacity: 0,
  transition: 'opacity 0.2s',
  borderRadius: '4px'
})

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    maxWidth: '90vw',
    maxHeight: '90vh'
  },
  '& .MuiDialogContent-root': {
    padding: 0,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  '& img': {
    maxWidth: '100%',
    maxHeight: '80vh',
    objectFit: 'contain'
  },
  '& video': {
    maxWidth: '100%',
    maxHeight: '80vh'
  }
})

// Styled Dropzone Component
const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  '& .dropzone': {
    minHeight: 'unset',
    padding: theme.spacing(12),
    [theme.breakpoints.down('sm')]: {
      paddingInline: theme.spacing(5)
    },
    '&+.MuiList-root .MuiListItem-root .file-name': {
      fontWeight: theme.typography.body1.fontWeight
    }
  }
}))

const ProductImage = ({ setJewelleryData, jewelleryData }: any) => {
  // States
  const [files, setFiles] = useState<FileType[]>([])
  const [previewItem, setPreviewItem] = useState<PreviewType>(null)

  useEffect(() => {
    if (jewelleryData?.images) {
      // Convert to array if single value
      const imageArray = Array.isArray(jewelleryData.images) ? jewelleryData.images : [jewelleryData.images]

      setFiles(imageArray)
    }
  }, [jewelleryData?.images])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.webm', '.ogg']
    },
    onDrop: (acceptedFiles: File[]) => {
      // Ensure we're working with arrays and remove any duplicates
      const existingFiles = Array.isArray(files) ? files : [files]
      const newFiles = [...existingFiles, ...acceptedFiles]

      // Remove duplicates based on name for Files and URL for strings
      const uniqueFiles = newFiles.filter(
        (file, index, self) =>
          self.findIndex(
            f =>
              (f instanceof File && file instanceof File && f.name === file.name) ||
              (typeof f === 'string' && typeof file === 'string' && f === file)
          ) === index
      )

      setFiles(uniqueFiles)
      setJewelleryData({ ...jewelleryData, images: uniqueFiles })
    }
  })

  const getFileType = (file: FileType): 'image' | 'video' => {
    if (file instanceof File) {
      return file.type.startsWith('video/') ? 'video' : 'image'
    }

    return file.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image'
  }

  const getFileUrl = (file: FileType): string => {
    return file instanceof File ? URL.createObjectURL(file) : file
  }

  const renderFilePreview = (file: FileType) => {
    const fileType = getFileType(file)
    const fileUrl = getFileUrl(file)

    return (
      <PreviewContainer onClick={() => setPreviewItem({ file, type: fileType })}>
        {fileType === 'video' ? (
          <video width={38} height={38}>
            <source src={fileUrl} type={file instanceof File ? file.type : `video/${file.split('.').pop()}`} />
          </video>
        ) : (
          <img width={38} height={38} alt={file instanceof File ? file.name : 'Existing media'} src={fileUrl} />
        )}
        <PreviewOverlay className='preview-overlay'>
          <i className={`tabler-${fileType === 'video' ? 'player-play' : 'zoom-in'} text-white text-xl`} />
        </PreviewOverlay>
      </PreviewContainer>
    )
  }

  const handleRemoveFile = (fileToRemove: FileType) => {
    const filtered = files.filter(file => {
      if (file instanceof File && fileToRemove instanceof File) {
        return file.name !== fileToRemove.name
      }

      return file !== fileToRemove
    })

    setFiles(filtered)
    setJewelleryData({ ...jewelleryData, images: filtered })
  }

  const fileList = files.map((file: FileType, index) => (
    <ListItem key={file instanceof File ? file.name : `existing-${index}`} className='pis-4 plb-3'>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name font-medium' color='text.primary'>
            {file instanceof File ? file.name : 'Existing Media'}
          </Typography>
          <Typography className='file-size' variant='body2'>
            {file instanceof File ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb` : 'Uploaded'}
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            {getFileType(file) === 'video' ? 'Video' : 'Image'}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <i className='tabler-x text-xl' />
      </IconButton>
    </ListItem>
  ))

  const handleRemoveAllFiles = () => {
    setFiles([])
    setJewelleryData({ ...jewelleryData, images: [] })
  }

  const renderPreviewDialog = () => {
    if (!previewItem) return null

    const fileUrl = getFileUrl(previewItem.file)
    const fileName = previewItem.file instanceof File ? previewItem.file.name : 'Media Preview'

    return (
      <StyledDialog open={true} onClose={() => setPreviewItem(null)} maxWidth='lg' fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {fileName}
          <IconButton onClick={() => setPreviewItem(null)} size='small'>
            <i className='tabler-x' />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {previewItem.type === 'video' ? (
            <video controls autoPlay>
              <source
                src={fileUrl}
                type={previewItem.file instanceof File ? previewItem.file.type : `video/${fileUrl.split('.').pop()}`}
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={fileUrl} alt={fileName} />
          )}
        </DialogContent>
      </StyledDialog>
    )
  }

  return (
    <Dropzone>
      <Card>
        <CardHeader
          title='Product Media'
          action={
            <Typography component={Link} color='primary.main' className='font-medium'>
              Add media from URL
            </Typography>
          }
          sx={{ '& .MuiCardHeader-action': { alignSelf: 'center' } }}
        />
        <CardContent>
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='flex items-center flex-col gap-2 text-center'>
              <CustomAvatar variant='rounded' skin='light' color='secondary'>
                <i className='tabler-upload' />
              </CustomAvatar>
              <Typography variant='h4'>Drag and Drop Your Media Here.</Typography>
              <Typography color='text.disabled'>or</Typography>
              <Button variant='tonal' size='small'>
                Browse Files
              </Button>
              <Typography variant='caption' color='text.disabled'>
                Allowed formats: PNG, JPG, JPEG, GIF, MP4, WEBM, OGG
              </Typography>
            </div>
          </div>
          {files.length ? (
            <>
              <List>{fileList}</List>
              <div className='buttons'>
                <Button color='error' variant='tonal' onClick={handleRemoveAllFiles}>
                  Remove All
                </Button>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
      {renderPreviewDialog()}
    </Dropzone>
  )
}

export default ProductImage
