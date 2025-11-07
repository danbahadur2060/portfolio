import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required"],
        trim: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    content: {
        type: String,
        required: [true, "Content is required"],
    },
    image: {
        type: String,
        required: [true, "Image is required"],
    },
    tags: {
        type: [String],
        default: [],
    },
}, { timestamps: true });

export const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
