import { Admin } from "../Models/admin.model.js";
import { PlacementStatistics } from "../Models/placementStatistics.model.js"
import ApiError from "../Utils/ApiError.js";
import ApiResponse from "../Utils/ApiResponse.js";
import asyncHandler from "../Utils/AsyncHandler.js";
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';


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

const __dirname = dirname(fileURLToPath(import.meta.url));

const exportToPDF = asyncHandler(async (req, res) => {
    const data = await PlacementStatistics.find();

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, `placement_stats_${Date.now()}.pdf`);
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);
    doc.fontSize(16).text("Placement Statistics Report", { align: 'center' });
    doc.moveDown();

    data.forEach((item, index) => {
        doc.fontSize(12).text(
            `Branch: ${item.branch}, Placed Students: ${item.placedStudents}, Avg Package: ${item.avgPackage} LPA`
        );
        doc.moveDown();
    });

    doc.end();

    writeStream.on('finish', () => {
        res.download(filePath, () => fs.unlinkSync(filePath));
    });
});

const exportToExcel = asyncHandler(async (req, res) => {
    const data = await PlacementStatistics.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Placement Statistics");

    worksheet.columns = [
        { header: "Branch", key: "branch", width: 15 },
        { header: "Placed Students", key: "placedStudents", width: 20 },
        { header: "Average Package", key: "avgPackage", width: 20 },
        { header: "Median Package", key: "medianPackage", width: 20 },
        { header: "Max Package", key: "maxPackage", width: 20 },
        { header: "Total Students", key: "totalStudents", width: 15 }
    ];

    data.forEach((item) => worksheet.addRow(item));

    const filePath = path.join(__dirname, `placement_stats_${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, () => fs.unlinkSync(filePath));
});

export {
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    exportToPDF,
    exportToExcel
}