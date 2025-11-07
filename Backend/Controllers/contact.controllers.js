import { Contact } from "../Models/Contact.models.js";

export const createContact = async (req, res) => {
  try {
    const {
      email,
      phone,
      linkedin_profile,
      github_profile,
      twitter_profile,
      personal_website,
    } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const contact = await Contact.create({
      email,
      phone: phone || "",
      linkedin_profile: linkedin_profile || "",
      github_profile: github_profile || "",
      twitter_profile: twitter_profile || "",
      personal_website: personal_website || "",
    });

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Contacts fetched successfully",
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email,
      phone,
      linkedin_profile,
      github_profile,
      twitter_profile,
      personal_website,
    } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      {
        email,
        phone: phone || "",
        linkedin_profile: linkedin_profile || "",
        github_profile: github_profile || "",
        twitter_profile: twitter_profile || "",
        personal_website: personal_website || "",
      },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact updated successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
