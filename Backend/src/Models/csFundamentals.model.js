import mongoose from "mongoose";

const csFundamentalsSchema = new mongoose.Schema(
    {
        subjectName: {
            type: String,
            required: true,
            trim: true,
            enum: ["OS", "DBMS", "OOPS", "Networks", "Software Engineering"]
        },
        pdfLink: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: "No description available"
        }
    },
    { timestamps: true }
);

export const CSFundamentals = mongoose.model("CSFundamentals", csFundamentalsSchema);