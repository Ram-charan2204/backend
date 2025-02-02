import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config({ path: "../.env" });

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (file) => {
  try {
    if (!file) return null;
    const response = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    console.log(
      "Successfully uploaded to cloudinary and the url is: ",
      response.url,
    );
    return `${response.url}`;
  } catch (err) {
    fs.unlink(file);
  }
};

export default uploadOnCloudinary;
