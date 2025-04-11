import { Router } from "express";
import { upload } from "../Middlewares/multer.middleware.js"
import { verifyAlumni, verifyJWT } from "../Middlewares/auth.middleware.js"
import { registerAlumni, loginAlumni, logoutAlumni, addPreviousCompany, changeCurrentCompanyDetails, getAllAlumniDetails } from "../Controllers/alumni.controller.js";
const router = Router()

router.route("/register").post(
    upload.fields([{ name: "profilePic", maxCount: 1 }]),
    registerAlumni
);
router.route("/login").post(loginAlumni)
router.route("/logout").post(verifyAlumni, logoutAlumni)
router.route("/add-previos-company").patch(verifyAlumni, addPreviousCompany)
router.route("/change-current-company").patch(verifyAlumni, changeCurrentCompanyDetails)
router.route("/get-details").get(verifyJWT, getAllAlumniDetails)

export default router