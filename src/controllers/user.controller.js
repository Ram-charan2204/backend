import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import User from "../models/user.model.js";
import upLoadOnCloudinary from "../utils/cloudinary.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, username } = req.body;
  if (
    [fullName, email, password, username].some((field) => field === undefined)
  ) {
    res.status(400);
    throw new apiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    res.status(400);
    throw new apiError(400, "User already existed");
  }
  const coverImagePath = req.files.coverImage[0]?.path;
  const avatarPath = req.files.avatar[0]?.path;

  if (!avatarPath) {
    throw new apiError(402, "Avatar image is required.");
  }

  const coverImage = upLoadOnCloudinary(coverImagePath);
  const avatar = upLoadOnCloudinary(avatarPath);

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    coverImage: coverImage?.url || "",
    avatar: avatar,
  });

  const createdUser = await user
    .findById(user._id)
    .select("-password -refreshToken");

  if (!createdUser) {
    throw new apiError(500, "User not created");
  }

  return res
    .status(201)
    .json(apiResponse(200, "User created successfully", createdUser));
});
