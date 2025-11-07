import cloudinary from "../Configs/cloudinary.configs.js";
import { HomeContent } from "../Models/HomeContent.models.js";

export const createHomeContent = async (req, res) => {
    try {
        const {name,location,position,summary,description} = req.body;

        if (!req.file || !req.file.path) {
            return res.status(400).json({
                success: false,
                message: "Please upload a profile picture",
            });
        }

        const profile_pic = req.file.path;
        const save_image = await cloudinary.uploader.upload(profile_pic, {folder: "profile_pics"});

        if(!name || !position || !summary){
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields",
            })
        }
        const homeContent = await HomeContent.create({
            name,
            location,
            position,
            summary,
            profile_pic:save_image.secure_url,
            description,
        })      
        await homeContent.save();
        res.status(200).json({
            success: true,
            message: "Home content created successfully",
            homeContent,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        }); 
    }
}

export const getHomeContent = async (req, res) => {
    try {
        const homeContent = await HomeContent.find();
       return res.status(200).json({
            success: true,
            message: "Home content fetched successfully",
            homeContent,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

export const updateHomeContent = async (req, res) => {
    try {
        const {id} = req.params;
        const {name,location,position,summary,profile_pic,description} = req.body;
        if(!name || !position || !summary){
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields",
            })
        }
        const homeContent = await HomeContent.findByIdAndUpdate(id,{
            name,
            location,
            position,
            summary,
            profile_pic,
            description,
        },{new:true, runValidators: true});
        await homeContent.save();
       return res.status(200).json({
            success: true,
            message: "Home content updated successfully",
            homeContent,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

export const deleteHomeContent = async (req, res) => {
    try {
        const {id} = req.params;
        await HomeContent.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Home content deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }   
    }

