import { Skill } from "../Models/Skills.models.js";

export const createSkill = async (req, res) => {
  try {
    const { technical, languages, frameworks } = req.body;

    const skill = await Skill.create({
      technical: technical || [],
      languages: languages || [],
      frameworks: frameworks || [],
    });

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const getSkill = async (req, res) => {
  try {
    const skill = await Skill.find();
    res.status(200).json({
      success: true,
      message: "Skill fetched successfully",
      skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { technical, languages, frameworks } = req.body;

    const skill = await Skill.findByIdAndUpdate(
      id,
      {
        technical: technical || [],
        languages: languages || [],
        frameworks: frameworks || [],
      },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      return res.status(400).json({
        success: false,
        message: "Skill not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
      skill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
