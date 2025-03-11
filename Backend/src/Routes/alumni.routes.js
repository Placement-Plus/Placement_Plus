import { Router } from "express";
import { verifyAlumni } from "../Middlewares/auth.middleware.js"
import { registerAlumni, loginAlumni, logoutAlumni, addPreviousCompany, changeCurrentCompanyDetails } from "../Controllers/Alumni.controller.js";
const router = Router()

router.route("/register").post(registerAlumni)
router.route("/login").post(loginAlumni)
router.route("/logout").post(verifyAlumni, logoutAlumni)
router.route("/add-previos-company").patch(verifyAlumni, addPreviousCompany)
router.route("change-current-company").patch(verifyAlumni, changeCurrentCompanyDetails)



export default router