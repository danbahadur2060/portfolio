const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/* ==========================
   Home Content
========================== */
const homeContentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    message: { type: String, required: true, maxlength: 500 },
    profile_image: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports.HomeContent = mongoose.model("HomeContent", homeContentSchema);

/* ==========================
   Skills
========================== */
const skillsSchema = new mongoose.Schema(
  {
    technical_Skills: [{ type: String, required: true }],
    frameworks_libraries: [{ type: String }],
    tools_and_software: [{ type: String }],
    certifications: [{ type: String }],
  },
  { timestamps: true }
);

module.exports.Skills = mongoose.model("Skills", skillsSchema);

/* ==========================
   Experience
========================== */
const experienceSchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true },
    job_title: { type: String, required: true },
    working_years: { type: String, required: true }, // "2020-2023"
    description: { type: String, required: true },
    key_achievements: [{ type: String }],
    location: { type: String },
  },
  { timestamps: true }
);

module.exports.Experience = mongoose.model("Experience", experienceSchema);

/* ==========================
   About
========================== */
const aboutSchema = new mongoose.Schema(
  {
    profile_img: { type: String, default: "" },
    name: { type: String, required: true },
    professional_title: { type: String, required: true },
    location: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    phone: { type: String, match: /^[0-9+\-() ]{7,20}$/ },
    biography: { type: String, maxlength: 1000 },
    social_links: {
      linkedin: String,
      github: String,
      twitter: String,
      website: String,
    },
  },
  { timestamps: true }
);

module.exports.About = mongoose.model("About", aboutSchema);

/* ==========================
   Contact
========================== */
const contactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    phone: { type: String, match: /^[0-9+\-() ]{7,20}$/ },
    linkedin_profile: { type: String },
    github_profile: { type: String },
    twitter_profile: { type: String },
    personal_website: { type: String },
  },
  { timestamps: true }
);

module.exports.Contact = mongoose.model("Contact", contactSchema);

/* ==========================
   Blog
========================== */
const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    feature_image: { type: String },
    public_date: { type: Date, default: Date.now },
    tags: [{ type: String }],
    status: { type: String, enum: ["public", "draft"], default: "draft" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports.Blog = mongoose.model("Blog", blogSchema);

/* ==========================
   Projects
========================== */
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    project_image: { type: String },
    used_technology: [{ type: String }],
    liveURL: { type: String },
    githubLink: { type: String },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports.Project = mongoose.model("Project", projectSchema);

/* ==========================
   Users
========================== */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    contact: { type: String },
    profile_image: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password validation method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports.User = mongoose.model("User", userSchema);
