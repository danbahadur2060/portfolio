import { Project } from "../Models/Project.models.js";
import cloudinary from "../Configs/cloudinary.configs.js";

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

export const Createproject = async (req, res) => {
  try {
    const {
      title,
      description,
      liveUrl,
      sourceUrl,
      technologies,
      category,
      featured,
    } = req.body;
    if (!title || !description || !liveUrl || !sourceUrl || !technologies) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Feature image is required",
      });
    }

    const cloud_save = await uploadImage(req.file);

    const project = await Project.create({
      title,
      description,
      technologies,
      liveUrl,
      sourceUrl,
      image: cloud_save.secure_url,
      category: category || "Other",
      featured: featured === "true" || featured === true,
    });

    return res.status(201).json({
      success: true,
      project,
      message: "Project created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const UpdateProject = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      title,
      description,
      technologies,
      liveUrl,
      sourceUrl,
      category,
      featured,
    } = req.body;

    if (!title || !description || !technologies || !liveUrl || !sourceUrl) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let updateData = {
      title,
      description,
      technologies,
      liveUrl,
      sourceUrl,
      category: category || "Other",
      featured: featured === "true" || featured === true,
    };

    // Only update image if a new file is uploaded
    if (req.file) {
      const cloud_save = await uploadImage(req.file);
      updateData.image = cloud_save.secure_url;
    }

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found !",
      });
    }

    return res.status(200).json({
      success: true,
      project,
      message: "Project updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const GetAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    if (!projects) {
      return res.status(404).json({
        success: false,
        message: "Projects not found",
      });
    }
    return res.status(200).json({
      success: true,
      projects,
      message: "Projects found",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const DeleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const GetProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    return res.status(200).json({
      success: true,
      project,
      message: "Project found",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
