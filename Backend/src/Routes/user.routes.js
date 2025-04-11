import { Router } from "express";
import { upload } from "../Middlewares/multer.middleware.js"
import { changePassword, getCurrentUser, loginUser, logoutUser, registerUser, updateDeatils, uploadResume, viewResume } from "../Controllers/user.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { uploadMiddleware } from "../Middlewares/upload.middleware.js";
import path from "path";

const router = Router()

router.route("/register").post(
    upload.fields([{ name: "resume", maxCount: 1 }]),
    // upload.single("resume"),
    // upload.none(),
    registerUser
);

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/get-user").get(verifyJWT, getCurrentUser)
router.route("/change-password").patch(verifyJWT, changePassword)
router.route("/upload-resume").patch(verifyJWT, upload.fields([{ name: "resume", maxCount: 1 }]), uploadResume);
// router.patch("/upload-resume", uploadMiddleware, (req, res) => {
//     console.log("📥 Incoming upload request");

//     console.log(req.files);


//     if (!req.files || !req.files.resume) {
//         console.warn("⚠️ No resume file found in request");
//         return res.status(400).json({ message: "No resume file uploaded" });
//     }

//     const resume = req.files.resume;

//     console.log("📄 File Info:", {
//         name: resume.name,
//         mimetype: resume.mimetype,
//         size: resume.size
//     });

//     if (resume.mimetype !== "application/pdf") {
//         console.warn("❌ Rejected file: Not a PDF");
//         return res.status(400).json({ message: "Only PDF files are allowed" });
//     }

//     const tempDir = path.join(process.cwd(), "public", "temp");
//     const savePath = path.join(tempDir, `${Date.now()}-${resume.originalName || 'resume.pdf'}}`);

//     resume.mv(savePath, (err) => {
//         if (err) {
//             console.error("❌ Error saving file:", err);
//             return res.status(500).json({ message: "Failed to save resume" });
//         }

//         console.log("✅ Resume saved successfully:", savePath);
//         res.status(200).json({
//             message: "Resume uploaded successfully",
//             file: {
//                 originalName: resume.name,
//                 savedAs: path.basename(savePath),
//                 size: resume.size
//             }
//         });
//     });
// });

router.route("/update-details").patch(verifyJWT, updateDeatils)
router.route("/view-resume").get(verifyJWT, viewResume)

export default router