import ApiError from '../Utils/ApiError.js'
import ApiResponse from '../Utils/ApiResponse.js'
import { User } from '../Models/user.model.js'
import asyncHandler from '../Utils/AsyncHandler.js'
import { UpcomingCompany } from '../Models/upcomingCompany.model.js'
import mongoose from 'mongoose'

const getSlab = (lpa) => {
    if (lpa <= 8)
        return 0;
    else if (lpa <= 12)
        return 1;
    else if (lpa <= 18)
        return 2;
    else if (lpa <= 25)
        return 3;
    else
        return 4;
}

const checkEligibility = async (companyId, user) => {
    const company = await UpcomingCompany.findById(companyId)

    if (!company) throw new ApiError(404, "Company not found")

    if ((company.opportunityType === "Internship" || company.opportunityType === "Internship + Full Time") && !user.internshipEligible)
        return false
    if (company.opportunityType === "Full Time") {
        if (!user.fullTimeEligible) {
            const slab = getSlab(parseFloat(company.ctc.split(" ")[0]))
            if (slab <= user.slab)
                return false
        }
    }

    return (
        company.eligibleBatch.includes(user.batch) &&
        user.CGPA >= company.cgpaCriteria &&
        company.eligibleBranches.includes(user.branch)
    )
}

const addCompany = asyncHandler(async (req, res) => {
    const { companyName, eligibleBranches, eligibleBatch, ctc, stipend, role, hiringProcess, cgpaCriteria, jobLocation, schedule, mode, opportunityType, extraDetails, pocName, pocContactNo } = req.body

    if (!companyName || !eligibleBranches || !eligibleBatch || !(ctc || stipend) || !role || !hiringProcess || !cgpaCriteria || !jobLocation || !schedule || !mode || !opportunityType || !pocContactNo || !pocName)
        throw new ApiError(400, "All details are required")

    if (String(pocContactNo).trim().length !== 10) {
        throw new ApiError(400, "Contact No must be of 10 digits");
    }

    const pocDetails = {
        name: pocName,
        contactNo: pocContactNo
    }

    const company = await UpcomingCompany.create(
        {
            companyName,
            eligibleBatch,
            eligibleBranches,
            ctc,
            stipend,
            cgpaCriteria,
            role,
            hiringProcess,
            jobLocation,
            schedule,
            mode,
            extraDetails,
            opportunityType,
            pocDetails
        }
    )

    const addedCompany = await UpcomingCompany.findById(company._id)
    if (!addedCompany)
        throw new ApiError(500, "Something went wrong while adding new company")

    return res.status(200).json(
        new ApiResponse(
            200,
            addedCompany,
            "Company added successfully"
        )
    )
})

const listAllCompany = asyncHandler(async (req, res) => {
    const companies = await UpcomingCompany.find()
    if (companies.length === 0)
        throw new ApiError(404, "No companies found")

    return res.status(200).json(
        new ApiResponse(
            200,
            companies,
            "Companies fetched successfully"
        )
    )
})

const applyToCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const isEligible = await checkEligibility(companyId, req.user)
        if (!isEligible)
            throw new ApiError(400, "Eligibility criteria does not match")

        const company = await UpcomingCompany.findByIdAndUpdate(
            companyId,
            {
                $addToSet:
                {
                    appliedStudents: new mongoose.Types.ObjectId(req.user._id),
                    status: "applied"
                }
            },
            { new: true, session }
        )

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: {
                    appliedCompanies: new mongoose.Types.ObjectId(companyId),
                    status: "applied"
                }
            },
            { new: true, session }
        )

        await session.commitTransaction()
        session.endSession()

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Applied successfully"
            )
        )
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw new ApiError(500, error.message || "Something went wrong")
    }
})

const getAllAppliedCompany = asyncHandler(async (req, res) => {
    const appliedCompaniesDetails = await User.aggregate([
        {
            $match: { _id: req.user._id }
        },
        {
            $unwind: "$appliedCompanies"
        },
        {
            $lookup: {
                from: "upcomingcompanies",
                localField: "appliedCompanies._id",
                foreignField: "_id",
                as: "companyDetails"
            }
        },
        {
            $unwind: "$companyDetails"
        },
        {
            $project: {
                _id: 0,
                companyId: "$appliedCompanies._id",
                applicationStatus: "$appliedCompanies.applicationStatus",
                applicationDate: "$appliedCompanies.applicationDate",
                companyName: "$companyDetails.companyName",
                jobRole: "$companyDetails.role",
                jobLocation: "$companyDetails.jobLocation",
                opportunityType: "$companyDetails.opportunityType",
                hiringProcess: "$companyDetails.hiringProcess"
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            appliedCompaniesDetails,
            "Applied companies fetched successfully"
        )
    );
});

const withdrawApplication = asyncHandler(async (req, res) => {
    const { companyId } = req.params
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const company = await UpcomingCompany.findByIdAndUpdate(companyId,
            { $pull: { appliedStudents: req.user._id } },
            { new: true, session }
        )

        const user = await User.findByIdAndUpdate(req.user._id,
            { $pull: { appliedCompanies: companyId } },
            { new: true, session }
        )

        await session.commitTransaction()
        session.endSession()

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Application withdrawn successfully"
            )
        )

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw new ApiError(500, error.message || "Something went wrong")
    }


})

export {
    addCompany,
    listAllCompany,
    applyToCompany,
    getAllAppliedCompany,
    withdrawApplication
}