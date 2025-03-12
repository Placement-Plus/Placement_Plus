import { ID, Permission, Role } from "appwrite";
import { storage } from "../AppWrite/appwriteConfig.js";
import fs from "fs";
import dotenv from "dotenv";
import ApiError from "./ApiError.js";
import { InputFile } from "node-appwrite/file"

dotenv.config({
    path: "./.env",
});

const uploadResumeOnAppwrite = async (filePath, username) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new ApiError(404, "Resume does not exist");
        }

        const response = await storage.createFile(
            process.env.APPWRITE_BUCKET_ID,
            ID.unique(),
            InputFile.fromPath(filePath, `${username} - resume.pdf`),
        );

        console.log("Upload Success:", response);
        return response;
    } catch (error) {
        console.error("Appwrite Upload Error:", error.message);
        return null;
    } finally {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

const getResumeFromAppwrite = async (fileId) => {
    try {
        return storage.getFileView(process.env.APPWRITE_BUCKET_ID, fileId);
    } catch (error) {
        console.error("Appwrite Error:", error);
        return null;
    }
};

const downloadResume = async (fileId) => {
    try {
        return storage.getFileDownload(process.env.APPWRITE_BUCKET_ID, fileId)
    } catch (error) {
        console.error("Appwrite Error:", error);
        return null;
    }
}

export { uploadResumeOnAppwrite, getResumeFromAppwrite, downloadResume };
