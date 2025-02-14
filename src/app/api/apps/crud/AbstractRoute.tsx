import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import connectDB from '@/libs/db'
import { cloudinary } from '@/utils/cloudinary'

type UploadResponse = { success: true; result?: any } | { success: false; error: any }

export const uploadToCloudinary = (fileUri: string, fileName: string): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        resource_type: 'auto',
        filename_override: fileName,
        folder: 'risinglab', // any sub-folder name in your cloud
        use_filename: true
      })
      .then(result => {
        resolve({ success: true, result })
      })
      .catch(error => {
        reject({ success: false, error })
      })
  })
}

export const getFactory = (objectModel: any) => {
  const getFunction = async (req: any) => {
    try {
      let filter = null
      let projection = null
      let options = null

      await connectDB()

      // request could be undefined if call from server
      if (!!req) {
        const params = req.nextUrl.searchParams

        filter = !!params.get('filter') ? JSON.parse(params.get('filter')) : null
        projection = !!params.get('projection') ? JSON.parse(params.get('projection')) : null
        options = !!params.get('options') ? JSON.parse(params.get('options')) : null
      }

      const query = await objectModel.find(filter, projection, options)

      return new NextResponse(JSON.stringify(query), { status: 200 })
    } catch (error: any) {
      return new NextResponse(JSON.stringify({ message: 'ERROR FETCHING', error: error.message }), { status: 500 })
    }
  }

  return getFunction
}

export const postFactory = (objectModel: any) => {
  const postFunction = async (req: any) => {
    try {
      await connectDB()

      const contentType = req.headers.get('content-type') || ''

      if (contentType.includes('multipart/form-data')) {
        const formData = await req.formData()
        const uploadedImages: string[] = []

        const images = formData.getAll('images')

        console.log('images :==> ', images) // Get all images uploaded

        for (let i = 0; i < images.length; i++) {
          const file = images[i] as File

          if (file) {
            // Convert file to base64 for uploading
            const fileBuffer = await file.arrayBuffer()
            const mimeType = file.type
            const encoding = 'base64'
            const base64Data = Buffer.from(fileBuffer).toString('base64')

            const fileUri = `data:${mimeType};${encoding},${base64Data}`

            // Upload to Cloudinary and get the response
            const res = await uploadToCloudinary(fileUri, file.name)

            console.log('res :==> ', res)

            if (res.success && res.result?.secure_url) {
              uploadedImages.push(res?.result?.secure_url) // Store Cloudinary URL
            }
          }
        }

        // Extract fields from the FormData
        const data: Record<string, any> = {}

        formData.forEach((value: any, key: any) => {
          // If the field contains multiple files, handle them as an array
          if (key === 'images') {
            console.log('uploadedImages insdie:==> ', uploadedImages)
            data[key] = uploadedImages
          } else {
            data[key] = value
          }
        })

        // Create a new object from form data and save it to the database
        const object = new objectModel(data)

        await object.save()

        return new NextResponse(JSON.stringify({ message: 'Item created successfully', item: object }), { status: 201 })
      } else {
        const body = await req.json()

        console.log('body :==> ', body)
        const object = new objectModel(body)

        await object.save()

        return new NextResponse(JSON.stringify({ message: 'item is created', item: object }), {
          status: 201
        })
      }
    } catch (error: any) {
      console.log('error.message :==> ', error.message)

      return new NextResponse(
        JSON.stringify({
          message: 'Error creating item',
          error: {
            message: error.message,
            stack: error.stack
          }
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }
  }

  return postFunction
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}
