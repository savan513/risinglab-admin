import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { Diamond } from '@/data/model/diamond.schema'
import { Category } from '@/data/model/category.schema'

type tParams = Promise<{ slug: string[] }>

export async function GET(request: NextRequest, { params }: { params: tParams }) {
  try {
    const { slug } = await params

    console.log('slug :==> ', slug)

    // First find the category by slug
    const category = await Category.findOne({ slug: slug })

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 })
    }

    // Then find all diamonds that belong to this category
    const diamonds = await Diamond.find({ category: category._id }).populate('category').sort({ createdAt: -1 })

    return NextResponse.json(diamonds)
  } catch (error) {
    console.error('Error fetching diamonds by category:', error)

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
