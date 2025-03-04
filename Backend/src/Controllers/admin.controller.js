import { Admin } from "../Models/admin.model.js";
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import asyncHandler from "../Utils/AsyncHandler.js";

const generateAccessandRefreshToken = async (adminId) => {
    const admin = await Admin.findById(adminId)

    const accessToken = await admin.generateAccessToken()
    const refreshToken = await admin.generateRefreshToken()

    admin.refreshToken = refreshToken
    await admin.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
}

const registerAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    if (!username || !password)
        throw new ApiError(400, "Username and password is required")

    if (password.length < 6)
        throw new ApiError(400, "Password length should be greater than 6")

    const existingAdmin = await Admin.find({ username })
    if (existingAdmin.length > 0)
        throw new ApiError(400, "Admin with same username already exists")

    const newAdmin = await Admin.create({
        username,
        password
    })

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(newAdmin._id)

    const createdAdmin = await Admin.findById(newAdmin._id).select("-password -refreshToken")
    if (!createdAdmin)
        throw new ApiError(500, "Something went wrong while creating admin")

    return res.status(200).json(
        new ApiResponse(
            200,
            { admin: createdAdmin, accessToken, refreshToken },
            "Admin registered successfully"
        )
    )
})

const loginAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    if (!username || !password)
        throw new ApiError(400, "Username and password is required")

    const admin = await Admin.findOne({ username }).select(" -refreshToken")
    if (!admin)
        throw new ApiError(400, "Admin not found")

    const isPasswordValid = await admin.isPasswordCorrect(password)
    if (!isPasswordValid)
        throw new ApiError(400, "Invalid password")

    const { accessToken, refreshToken } = await generateAccessandRefreshToken(admin._id)
    if (!accessToken || !refreshToken)
        throw new ApiError(500, "Something went wrong while generating tokens")

    return res.status(200).json(
        new ApiResponse(
            200,
            { admin, refreshToken, accessToken },
            "Logged in successfully"
        )
    )
})

const logoutAdmin = asyncHandler(async (req, res) => {
    const admin = await Admin.findByIdAndUpdate(req.admin._id,
        {
            $unset: { refreshToken: 1 }
        },
        {
            new: true
        }
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Logged out successfully"
        )
    )

})

export {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
}