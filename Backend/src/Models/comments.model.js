import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        uersId: {
            type: Schema.Types.ObjectId,
            ref: "Alumni",
            required: true
        },
        companyName: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    }
)

export const Comment = mongoose.model("Comment", commentSchema)