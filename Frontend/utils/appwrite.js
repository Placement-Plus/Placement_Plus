import { storage } from "./appwriteConfig.js"
import { APPWRITE_STUDY_MATERIAL_BUCKET_ID } from "@env"

const getFileFromAppwrite = async (profilePicId) => {
    try {
        return storage.getFileView(APPWRITE_STUDY_MATERIAL_BUCKET_ID, profilePicId);

    } catch (error) {
        console.error("Appwrite Error:", error.message);
        return null;
    }
};

export { getFileFromAppwrite }