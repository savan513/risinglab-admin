import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { Contact } from '@/data/model/contact.schema'

export async function PATCH(request: NextRequest, { params }: any) {
  try {
    const body = await request.json()
    const { status } = body

    const contact = await Contact.findByIdAndUpdate(params.id, { status }, { new: true })

    if (!contact) {
      return NextResponse.json({ message: 'Contact not found' }, { status: 404 })
    }

    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error updating contact:', error)

    return NextResponse.json({ message: 'Failed to update contact' }, { status: 500 })
  }
}
