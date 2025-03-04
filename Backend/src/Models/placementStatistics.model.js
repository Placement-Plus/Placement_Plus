import mongoose, { Schema } from "mongoose";

const PlacementStatisticsSchema = new Schema(
    {
        branch: {
            type: String,
            enum: ['CSE', 'ECE', 'EE', 'ME', 'CE', 'VLSI', 'CAD/CAM'],
            required: true
        },
        avgPackage: {
            type: Number,
            required: true
        },
        medianPackage: {
            type: Number,
            required: true
        },
        maxPackage: {
            type: Number,
            required: true
        },
        totalStudents: {
            type: Number,
            required: true
        },
        placedStudents: {
            type: Number,
            required: true
        },
        ctcValues: {
            type: [Number],
            default: []
        }
    },
    { timestamps: true }
)

export const PlacementStatistics = mongoose.model("PlacementStatistics", PlacementStatisticsSchema)