import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: String,
        enum: ["freelancer", "client"],
        default: [],
      },
    ],
    bio: String,
    skills: [String],
    location: String,
    hourlyRate: Number,
    profileImage: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
