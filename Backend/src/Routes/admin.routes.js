import { Router } from "express";
import { exportToExcel, exportToPDF, loginAdmin, logoutAdmin, registerAdmin } from "../Controllers/admin.controller.js";
import { verifyAdmin } from "../Middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerAdmin)
router.route("/login").post(loginAdmin)
router.route("/logout").post(verifyAdmin, logoutAdmin)
router.route("/export-to-pdf").get(verifyAdmin, exportToPDF)
router.route("/export-to-excel").get(verifyAdmin, exportToExcel)



export default router