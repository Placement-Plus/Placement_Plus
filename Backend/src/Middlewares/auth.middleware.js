import { User } from "../Models/user.model.js";
import ApiError from "../Utils/ApiError.js";
import asyncHandler from "../Utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { Admin } from "../Models/admin.model.js";

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        if (!token)
            throw new ApiError(401, "Unauthorized request")

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id).select(" -password -refreshToken")
        if (!user)
            throw new ApiError(401, "invalid access token")

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized request")
    }
})

const verifyAdmin = asyncHandler(async (req, _, next) => {
    const token = req.headers?.authorization?.split(" ")[1]
    if (!token)
        throw new ApiError(401, "Unauthorized request")

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const admin = await Admin.findById(decodedToken._id).select(" -password -refreshToken")
    if (!admin)
        throw new ApiError(401, "invalid access token")

    req.admin = admin
    next()
})

export { verifyJWT, verifyAdmin }