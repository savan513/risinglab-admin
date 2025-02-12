import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { Jewellery } from '@/data/model/jewellery.schema'
import { Category } from '@/data/model/category.schema'

type tParams = Promise<{ slug: string[] }>

export async function GET(request: NextRequest, { params }: { params: tParams }) {
  try {
    const { slug } = await params

    console.log('slug :==> ', slug)

    // First find the category by slug
    const category = await Category.findOne({ slug: slug })

    console.log('category :==> ', category)

    if (!category) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 })
    }

    // Then find all jewellerys that belong to this category
    const Jewellerys = await Jewellery.find({ category: category._id }).populate('category').sort({ createdAt: -1 })

    return NextResponse.json(Jewellerys)
  } catch (error) {
    console.error('Error fetching jewellerys by category:', error)

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
