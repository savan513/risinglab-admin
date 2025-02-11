import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // e.g., "Diamond" or "Lab-Grown Diamonds"
        slug: { type: String, required: true, unique: true }, // SEO-friendly URL part
        parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
        images: { type: [String], default: [] }
    },
    { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
