import { Router } from "express";
import { upload } from "../Middlewares/multer.middleware.js"
import { changePassword, getCurrentUser, loginUser, logoutUser, registerUser, updateDeatils, uploadResume, viewResume } from "../Controllers/user.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([{ name: "resume", maxCount: 1 }]),
    registerUser
);

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/get-user").get(verifyJWT, getCurrentUser)
router.route("/change-password").patch(verifyJWT, changePassword)
router.route("/upload-resume").patch(verifyJWT, upload.fields([{ name: "resume", maxCount: 1 }]), uploadResume)
router.route("/update-details").patch(verifyJWT, updateDeatils)
router.route("/view-resume").get(verifyJWT, viewResume)

export default router