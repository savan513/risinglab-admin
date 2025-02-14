import { NextResponse } from 'next/server'

import mongoose from 'mongoose'

import { Category } from '@/data/model/category.schema'
import { deleteFactory, patchFactory } from '../crud/[id]/AbstractRoute'
import { getFactory, postFactory } from '../crud/AbstractRoute'
import connectDB from '@/libs/db'

// export const GET = getFactory(Category);
export const PATCH = patchFactory(Category)
export const DELETE = deleteFactory(Category)

// export const POST = postFactory(Category);
export const GET = async (req: any) => {
  try {
    // Connect to the database
    await connectDB()

    // Get the 'filter' query parameter
    const params = req.nextUrl.searchParams
    const filter = params.get('filter') ? JSON.parse(params.get('filter') as string) : {}

    // Add filter to exclude Diamond and Jewellery categories by name
    const excludeFilter = {
      ...filter,
      name: { $nin: ['Diamond', 'Jewellery'] } // Exclude these specific categories
    }

    // Check if parent exists and convert it to ObjectId if it's not null
    if (filter.parent) {
      excludeFilter.parent = new mongoose.Types.ObjectId(filter.parent) // Convert string to ObjectId
    }

    console.log('Received filter:', excludeFilter)

    // Fetch categories based on the filter
    const categories = await Category.find(excludeFilter).populate({
      path: 'parent',
      select: 'name _id' // Only include name and _id fields from parent
    })

    // Return categories in the response
    return new NextResponse(JSON.stringify(categories), { status: 200 })
  } catch (error: any) {
    // Handle error
    console.error('Error fetching categories:', error)

    return new NextResponse(JSON.stringify({ message: 'Error fetching categories', error: error.message }), {
      status: 500
    })
  }
}

export const POST = async (req: any) => {
  try {
    await connectDB()

    const body = await req.json()

    // Query the parent category by slug or name
    console.log('parentCategory :==> ', body.parent)
    const parentCategory = body.parent ? await Category.findOne({ name: body.parent }) : null

    if (body.parent && !parentCategory) {
      return new NextResponse(JSON.stringify({ error: 'Parent category not found' }), {
        status: 404
      })
    }

    // Assign the parent category's _id or null if no parent
    const newCategoryData = {
      ...body,
      parent: parentCategory ? parentCategory._id : null
    }

    // Create a new category instance
    const newCategory = new Category(newCategoryData)

    await newCategory.save()

    return new NextResponse(JSON.stringify({ message: 'Category created successfully', item: newCategory }), {
      status: 201
    })
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ message: 'Error creating category', error: error.message }), {
      status: 500
    })
  }
}
