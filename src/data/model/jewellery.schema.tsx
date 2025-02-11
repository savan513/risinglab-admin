import mongoose from "mongoose";

const jewellerySchema = new mongoose.Schema(
    {
        jewelleryName: { type: String, required: true },
        brand: { type: String, required: true },
        color: { type: String, required: true },
        size: { type: String, required: false },
        sku: { type: String, required: false },
        price: { type: Number, required: false },
        description: { type: String, required: false },
        images: { type: [String], required: false },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    },
    { timestamps: true, strict: true }
);

export const Jewellery = mongoose.models.Jewellery || mongoose.model("Jewellery", jewellerySchema);
