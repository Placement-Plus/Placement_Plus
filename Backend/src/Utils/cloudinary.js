import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv'

dotenv.config({
    path: './.env'
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadPdfOnCloudinary = async (localFilePath) => {
    try {
        if (!fs.existsSync(localFilePath)) {
            console.error("File not found:", localFilePath);
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "raw"
        });

        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return null;
    }
};

export { uploadPdfOnCloudinary };
