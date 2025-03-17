import ApiError from '../Utils/ApiError.js'
import ApiResponse from '../Utils/ApiResponse.js'
import { User } from '../Models/user.model.js'
import asyncHandler from '../Utils/AsyncHandler.js'
import bcrypt from 'bcrypt'
import { uploadResumeOnAppwrite, getResumeFromAppwrite } from '../Utils/appwrite.js'

const generateAccesandRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, rollNo, password, mobileNo, branch, semester, CGPA, batch, course } = req.body

    if ([name, email, rollNo, password, mobileNo, branch, semester, CGPA, batch, course].some((field) => !field))
        throw new ApiError(400, "All fields are required")

    if (!email?.includes('@nitdelhi.ac.in'))
        throw new ApiError(400, "Only institute email address is allowed")

    if (rollNo.toString().trim().length !== 9)
        throw new ApiError(400, "Invalid Roll Number")

    if (password.trim().length < 5)
        throw new ApiError(400, "Password must contain 6 or more characters")

    const existedUser = await User.findOne({
        $or: [{ email, rollNo }]
    })

    if (existedUser)
        throw new ApiError(400, "User with same email or roll number already exists")

    const resumeLocalPath = req.files?.resume[0]?.path
    // console.log("Files:", req.files);
    if (!resumeLocalPath)
        throw new ApiError(400, "Resume is required")

    const resume = await uploadResumeOnAppwrite(resumeLocalPath)
    if (!resume)
        throw new ApiError(500, "Something went wrong while uploading resume")

    const user = await User.create({
        name,
        email,
        rollNo,
        password,
        mobileNo,
        CGPA,
        semester,
        branch,
        resumeLink: resume.$id,
        batch,
        course
    })

    const { refreshToken, accessToken } = await generateAccesandRefreshToken(user._id)

    const createdUser = await User.findById(user._id).select(" -password -refreshToken")
    if (!createdUser)
        throw new ApiError(500, "Something went wrong while creating user")

    return res.status(201).json(
        new ApiResponse(
            200,
            { createdUser, accessToken, refreshToken },
            "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email)
        throw new ApiError(400, "Email is Required")
    if (!password)
        throw new ApiError(400, "Password is Required")

    const user = await User.findOne({ email }).select(" -refreshToken")
    if (!user)
        throw new ApiError(400, "User does not exist")

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid)
        throw new ApiError(400, "Invalid Password")

    const { accessToken, refreshToken } = await generateAccesandRefreshToken(user._id)
    if (!accessToken || !refreshToken)
        throw new ApiError(500, "Something went wrong while generating tokens")

    return res.status(200).json(
        new ApiResponse(
            200,
            { user, accessToken, refreshToken },
            "User logged in successfully")
    )
})

const logoutUser = asyncHandler(async (req, res) => {
    const loggedOutUser = await User.findByIdAndUpdate(req.user._id,
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
            "User logged out successfully"
        )
    )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select(" -password -refreshToken")
    if (!user)
        throw new ApiError(400, "User not found")

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "User found successfully"
        )
    )
})

const changePassword = asyncHandler(async (req, res) => {
    const { newPassword } = req.body

    const hashPassword = await bcrypt.hash(newPassword, 10)

    const user = await User.findByIdAndUpdate(req.user._id,
        { password: hashPassword },
        { new: true }
    ).select(" -password -refreshToken")
    if (!user)
        throw new ApiError(500, "Something went wrong while updating password")

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Password changed successfully"
        )
    )

})

const uploadResume = asyncHandler(async (req, res) => {

    const resumeLocalPath = req.files?.resume[0]?.path
    if (!resumeLocalPath)
        throw new ApiError(400, "Resume is required")

    const resume = await uploadResumeOnAppwrite(resumeLocalPath, req.user.name)
    if (!resume)
        throw new ApiError(500, "Something went wrong while uploading resume")

    const user = await User.findByIdAndUpdate(req.user._id,
        {
            resumeLink: resume.$id
        },
        { new: true }
    ).select(" -password -refreshToken")
    if (!user)
        throw new ApiError(500, "Something went wrong while updating resume")

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Resume updated successfully"
        )
    )
})

const updateDeatils = asyncHandler(async (req, res) => {
    const { name, email, rollNo, mobileNo, branch, semester, CGPA } = req.body
    if (!name && !email && !rollNo && !mobileNo && !branch && !semester && !CGPA)
        throw new ApiError(400, "Data is required")

    const newDetails = {}
    if (name) newDetails.name = name
    if (email) newDetails.email = email
    if (mobileNo) newDetails.mobileNo = mobileNo
    if (rollNo) newDetails.rollNo = rollNo
    if (branch) newDetails.branch = branch
    if (semester) newDetails.semester = semester
    if (CGPA) newDetails.CGPA = CGPA

    const user = await User.findByIdAndUpdate(req.user._id,
        newDetails,
        { new: true }
    ).select(" -password -refreshToken")
    if (!user)
        throw new ApiError(500, "Something went wrong while updating details")

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Details updated successfully"
        )
    )
})

const viewResume = asyncHandler(async (req, res) => {
    const resume = await getResumeFromAppwrite(req.user.resumeLink)
    if (!resume)
        throw new ApiError(500, "Something went wrong while fetching resume")

    return res.status(200).json(
        new ApiResponse(
            200,
            resume,
            "resume fetched successfully"
        )
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    changePassword,
    uploadResume,
    updateDeatils,
    viewResume
}