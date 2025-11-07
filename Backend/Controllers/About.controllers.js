import cloudinary from "../Configs/cloudinary.configs.js";
import { About } from "../Models/About.models.js";

export const createAbout = async (req, res) => {
  try {
    const { name, email, title, bio, location } = req.body;

    if (!name || !email || !title || !bio) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a profile picture",
      });
    }

    const profile_pic = req.file.path;
    const image_save = await cloudinary.uploader.upload(profile_pic, {
      folder: "PortifolioWebsite",
      width: 200,
      height: 200,
      crop: "fill",
    });

    const about = await About.create({
      name,
      email,
      title,
      bio,
      location: location || "",
      profileImage: image_save.secure_url,
    });

    res.status(201).json({
      success: true,
      message: "About created successfully",
      about,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAbout = async (req, res) => {
  try {
    const about = await About.find();
    res.status(200).json({
      success: true,
      message: "About fetched successfully",
      about,
    });
  } catch (error) {
    console.error("Error fetching about:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, title, bio, location } = req.body;

    if (!name || !email || !title || !bio) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    let updateData = {
      name,
      email,
      title,
      bio,
      location: location || "",
    };

    // Only update image if a new file is uploaded
    if (req.file) {
      const profile_pic = req.file.path;
      const image_save = await cloudinary.uploader.upload(profile_pic, {
        folder: "PortifolioWebsite",
        width: 200,
        height: 200,
        crop: "fill",
      });
      updateData.profileImage = image_save.secure_url;
    }

    const about = await About.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "About updated successfully",
      about,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const about = await About.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "About deleted successfully",
      about,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
