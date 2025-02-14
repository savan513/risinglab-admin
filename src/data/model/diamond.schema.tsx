import mongoose from 'mongoose'

const diamondSchema = new mongoose.Schema(
  {
    diamondName: { type: String, required: true },
    brand: { type: String, required: false },
    diamondType: { type: String, required: false },
    color: { type: String, required: true },
    weight: { type: String, required: true },
    size: { type: String, required: false },
    clarity: { type: String, required: false },
    shape: { type: String, required: false },
    cut: { type: String, required: false },
    description: { type: String, required: false },
    images: { type: [String], required: false },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  { timestamps: true, strict: true }
)

export const Diamond = mongoose.models.Diamond || mongoose.model('Diamond', diamondSchema)
