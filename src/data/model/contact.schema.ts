import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    subject: {
      type: String
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'replied'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
)

export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema)
