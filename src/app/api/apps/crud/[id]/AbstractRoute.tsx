import { NextResponse } from 'next/server'

import connectDB from '@/libs/db'
import { uploadToCloudinary } from '../AbstractRoute'

// Handle GET requests
export const getFactory = (objectModel: any) => {
  const getFunction = async (req: any, { params }: any) => {
    await connectDB()
    console.log('GET REQUEST :==> ')
    const { id } = await params

    if (!id) {
      return new NextResponse(null, { status: 400, statusText: 'Bad Request: ID is required' })
    }

    try {
      const object = await objectModel.findById(id)

      if (!object) {
        return new NextResponse(null, { status: 404, statusText: 'Not Found' })
      }

      return new NextResponse(JSON.stringify(object), { status: 200 })
    } catch (error: any) {
      return new NextResponse(null, { status: 500, statusText: 'Server Error: ' + error.message })
    }
  }

  return getFunction
}

// Handle PATCH requests
export const patchFactory = (objectModel: any) => {
  const patchFunction = async (req: any, { params }: any) => {
    try {
      await connectDB()
    } catch (error: any) {
      return new NextResponse(null, {
        status: 500,
        statusText: 'Database connection error: ' + error.message
      })
    }

    const { id } = await params

    if (!params) {
      return new NextResponse(null, { status: 400, statusText: 'Bad Request: ID is required' })
    }

    try {
      const contentType = req.headers.get('content-type') || ''

      // Check for JSON data
      if (contentType.includes('application/json')) {
        // Parse the JSON body
        const body = await req.json()

        console.log('body :==> ', body)
        console.log('objectModel :==> ', objectModel)

        const object = await objectModel.findByIdAndUpdate(id, body, { new: true, upsert: false, strict: false })

        if (!object) {
          return new NextResponse(JSON.stringify({ error: 'Not Found' }), { status: 404 })
        }

        console.log('object :==> ', object)

        return new NextResponse(JSON.stringify(object), { status: 200 })
      } // Check for Form data (multipart/form-data or application/x-www-form-urlencoded)
      else if (
        contentType.includes('multipart/form-data') ||
        contentType.includes('application/x-www-form-urlencoded')
      ) {
        // Parse the form data
        const formData = await req.formData()
        const uploadedImages: string[] = []

        const images = formData.getAll('images') // Retrieve all uploaded images

        console.log('images:==>', images)

        for (let i = 0; i < images.length; i++) {
          const image = images[i]

          if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
            uploadedImages.push(image)
            continue
          }

          const file = images[i] as File

          if (file) {
            // Convert file to base64 for uploading
            const fileBuffer = await file.arrayBuffer()
            const mimeType = file.type
            const encoding = 'base64'
            const base64Data = Buffer.from(fileBuffer).toString('base64')

            const fileUri = `data:${mimeType};${encoding},${base64Data}`

            // Upload to Cloudinary
            const res = await uploadToCloudinary(fileUri, file.name)

            console.log('res:==>', res)

            if (res.success && res?.result?.secure_url) {
              uploadedImages.push(res?.result?.secure_url) // Store Cloudinary URL
            }
          }
        }

        const data: Record<string, any> = {}

        // Convert form data to a plain object (formData entries as key-value pairs)
        formData.forEach((value: any, key: any) => {
          // If the field contains multiple files, handle them as an array
          if (key === 'images') {
            console.log('uploadedImages insdie:==> ', uploadedImages)
            data[key] = uploadedImages
          } else {
            data[key] = value
          }
        })

        const object = await objectModel.findByIdAndUpdate(id, data, { new: true, upsert: false, strict: false })

        if (!object) {
          return new NextResponse(JSON.stringify({ error: 'Not Found' }), { status: 404 })
        }

        return new NextResponse(JSON.stringify(object), { status: 200 })
      } else {
        // If neither JSON nor Form Data
        return new NextResponse(JSON.stringify({ error: 'Unsupported Media Type' }), { status: 415 })
      }
    } catch (error: any) {
      console.log('error.message :==> ', error.message)

      return new NextResponse(null, { status: 500, statusText: 'Server Error: ' + error.message })
    }
  }

  return patchFunction
}

export const deleteFactory = (objectModel: any) => {
  const deleteFunction = async (req: any, { params }: any) => {
    await connectDB()
    const { id } = params

    if (!id) {
      return new NextResponse(null, { status: 400, statusText: 'Bad Request: ID is required' })
    }

    try {
      const object = await objectModel.findByIdAndDelete(id)

      if (!object) {
        return new NextResponse(null, { status: 404, statusText: 'Not Found' })
      }

      return new NextResponse(null, { status: 204 })
    } catch (error: any) {
      return new NextResponse(null, { status: 500, statusText: 'Server Error: ' + error.message })
    }
  }

  return deleteFunction
}
