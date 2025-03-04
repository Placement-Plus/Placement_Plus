import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from './Routes/user.routes.js'
import adminRouter from './Routes/admin.routes.js'
import upcominCompanyRouter from './Routes/upcomingCompany.routes.js'
import placementRouter from './Routes/placement.routes.js'
import placementStatisticsRouter from './Routes/placementStatistics.routes.js'
import questionRouter from './Routes/question.routes.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/admins", adminRouter)
app.use("/api/v1/companies", upcominCompanyRouter)
app.use("/api/v1/placements", placementRouter)
app.use("/api/v1/placement-statistics", placementStatisticsRouter)
app.use("/api/v1/questions", questionRouter)


export { app }
