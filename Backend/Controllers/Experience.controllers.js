import Experience from "../Models/experience.models.js";
export const createExperience = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      start_date,
      end_date,
      description,
      achievements,
    } = req.body;
    if (!title || !company || !location || !start_date || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    const experience = await Experience.create({
      title,
      company,
      location,
      start_date,
      end_date: end_date || null,
      description,
      achievements: achievements || [],
    });

    res.status(201).json({
      success: true,
      message: "Experience created successfully",
      experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getExperience = async (req, res) => {
  try {
    const experience = await Experience.find();
    res.status(200).json({
      success: true,
      message: "Experience fetched successfully",
      experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    await Experience.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      company,
      location,
      start_date,
      end_date,
      description,
      achievements,
    } = req.body;
    if (!title || !company || !location || !start_date || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    const experience = await Experience.findByIdAndUpdate(
      id,
      {
        title,
        company,
        location,
        start_date,
        end_date: end_date || null,
        description,
        achievements: achievements || [],
      },
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      experience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
