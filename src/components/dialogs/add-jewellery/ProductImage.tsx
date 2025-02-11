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

// Third-party Imports
import { useDropzone } from 'react-dropzone'

// Component Imports
import Link from '@components/Link'
import CustomAvatar from '@core/components/mui/Avatar'

// Styled Component Imports
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

type FileType = File | string

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

    useEffect(() => {
        if (jewelleryData?.images) {
            // Convert to array if single value
            const imageArray = Array.isArray(jewelleryData.images)
                ? jewelleryData.images
                : [jewelleryData.images]

            setFiles(imageArray)
        }
    }, [jewelleryData?.images])

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles: File[]) => {
            // Ensure we're working with arrays and remove any duplicates
            const existingFiles = Array.isArray(files) ? files : [files]
            const newFiles = [...existingFiles, ...acceptedFiles]

            // Remove duplicates based on name for Files and URL for strings
            const uniqueFiles = newFiles.filter((file, index, self) =>
                self.findIndex(f =>
                    (f instanceof File && file instanceof File && f.name === file.name) ||
                    (typeof f === 'string' && typeof file === 'string' && f === file)
                ) === index
            )

            setFiles(uniqueFiles)
            setJewelleryData({ ...jewelleryData, images: uniqueFiles })
        }
    })

    const renderFilePreview = (file: FileType) => {
        if (file instanceof File) {
            return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file)} />
        } else if (typeof file === 'string') {
            return <img width={38} height={38} alt="Existing image" src={file} />
        }


        return <i className='tabler-file-description' />
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
                        {file instanceof File ? file.name : 'Existing Image'}
                    </Typography>
                    <Typography className='file-size' variant='body2'>
                        {file instanceof File
                            ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                            : 'Uploaded'}
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

    return (
        <Dropzone>
            <Card>
                <CardHeader
                    title='Product Image'
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
                            <Typography variant='h4'>Drag and Drop Your Image Here.</Typography>
                            <Typography color='text.disabled'>or</Typography>
                            <Button variant='tonal' size='small'>
                                Browse Image
                            </Button>
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
        </Dropzone>
    )
}

export default ProductImage
