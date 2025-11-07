import cloudinary from "../Configs/cloudinary.configs.js";
import { Blog } from "../Models/Blog.models.js";

const uploadImage = async (file, options = {}) => {
  if (!file) throw new Error("No file provided");
  if (file.path) {
    return await cloudinary.uploader.upload(file.path, options);
  }
  if (file.buffer) {
    return await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
      stream.end(file.buffer);
    });
  }
  throw new Error("Unsupported file input");
};

export const createBlog = async (req, res) => {
  try {
    const { title, featured, content, tags } = req.body;
    if (!title || !content || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and image are required",
      });
    }

    const savedImage = await uploadImage(req.file, {
      folder: "blogs",
    });

    if (!savedImage || !savedImage.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }

    const parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags || [];

    const newBlog = new Blog({
      title,
      featured: featured === "true" || featured === true,
      content,
      image: savedImage.secure_url,
      tags: parsedTags,
    });

    await newBlog.save();

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, featured, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    let updateData = {
      title,
      featured: featured === "true" || featured === true,
      content,
      tags: typeof tags === "string" ? JSON.parse(tags) : tags || [],
    };

    // Only update image if a new file is uploaded
    if (req.file) {
      const savedImage = await uploadImage(req.file, {
        folder: "blogs",
      });
      updateData.image = savedImage.secure_url;
    }

    const blog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
