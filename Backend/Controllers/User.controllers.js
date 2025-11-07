import cloudinary from "../Configs/cloudinary.configs.js";
import { User } from "../Models/User.models.js";

export const Createaccount = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 4 characters",
      });
    }

    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    const profile_pic = req.file.path;
    const cloud_save = await cloudinary.uploader.upload(profile_pic);

    const newuser = await User.create({
      name,
      email,
      password,
      role,
      profile_pic: cloud_save.secure_url,
    });
    await newuser.save();
    return res.status(201).json({
      success: true,
      user: newuser,
      message: "Account created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password"
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = user.getJWTToken();

    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd, // only send cookie over HTTPS in production
      sameSite: isProd ? "none" : "lax",
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in ms
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    };

    // Set cookie
    res.cookie("token", token, cookieOptions);

    const safeUser = user.toObject ? { ...user.toObject() } : { ...user };
    delete safeUser.password;
    delete safeUser.__v;

    // 7) Successful response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

export const Logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now()),
      maxAge: 0,
    });
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Updateaccount = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Update simple fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    user.role = role || user.role;

    // Handle optional profile picture update
    if (req.file && req.file.path) {
      const profile_pic = req.file.path;
      const cloud_save = await cloudinary.uploader.upload(profile_pic);
      user.profile_pic = cloud_save.secure_url;
    }

    await user.save();
    return res.status(200).json({
      success: true,
      user,
      message: "Account updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Getaccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
      message: "Account retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Getallaccounts = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(400).json({
        success: false,
        message: "Users not found",
      });
    }
    return res.status(200).json({
      success: true,
      users,
      message: "Accounts retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Deleteaccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    await user.remove();
    return res.status(200).json({
      success: true,
      user,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Deleteallaccounts = async (req, res) => {
  try {
    // Only allow admin to delete all users
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin privileges required",
      });
    }
    await User.deleteMany();
    return res.status(200).json({
      success: true,
      message: "Accounts deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
