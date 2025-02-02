import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import User from "../models/user.model.js";
import upLoadOnCloudinary from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  const user = User.findById(userId);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

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
  const coverImagePath = req.files?.coverImage[0]?.path;
  const avatarPath = req.files?.avatar[0]?.path;

  if (!avatarPath) {
    throw new apiError(402, "Avatar image is required.");
  }

  const coverImage1 = await upLoadOnCloudinary(coverImagePath);
  const avatarImage = await upLoadOnCloudinary(avatarPath);

  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    avatar: avatarImage,
    coverImage: coverImage1 || "",
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new apiError(500, "User not created");
  }

  return res
    .status(201)
    .json(new apiResponse(200, "User created successfully", createdUser));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!(username || email) || !password) {
    throw new apiError(400, "Username or email and password are required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new apiError(404, "User not found");
  }
  const isMatch = await user.isPasswordMatch(password);
  if (!isMatch) {
    throw new apiError(401, "Invalid credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );
  res
    .status(200)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
    })
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    })
    .json(
      new apiResponse(200, "Login successful", { accessToken, refreshToken }),
    );
});
