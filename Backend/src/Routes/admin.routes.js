import { Router } from "express";
import { loginAdmin, logoutAdmin, registerAdmin } from "../Controllers/admin.controller.js";
import { verifyAdmin } from "../Middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerAdmin)
router.route("/login").post(loginAdmin)
router.route("/logout").post(verifyAdmin, logoutAdmin)


export default router