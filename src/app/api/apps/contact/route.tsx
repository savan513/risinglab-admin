import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import nodemailer from 'nodemailer'

import { Contact } from '@/data/model/contact.schema'

// Create transporter outside the handler to reuse it
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email' /* || "origin@gmail.com" */,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message } = body

    console.log('contact :==> ', name, email, phone, subject, message)

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message
    })

    console.log('contact :==> ', contact)
    contact.save()

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Contact Form: ${subject}`,
      html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      {
        message: 'Contact form submitted successfully',
        contact
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)

    return NextResponse.json(
      {
        message: 'Failed to process contact form'
      },
      { status: 500 }
    )
  }
}

// Add GET endpoint to fetch contacts
export async function GET() {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })

    return NextResponse.json(contacts)
  } catch (error) {
    console.error('Error fetching contacts:', error)

    return NextResponse.json(
      {
        message: 'Failed to fetch contacts'
      },
      { status: 500 }
    )
  }
}
