const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/file.middleware");
const InterviewController = require("../controllers/interview.controller");

const InterviewRouter = express.Router();

/**
 * @route POST /api/interview
 * @desc Generate interview report
 * @access Private
 */
InterviewRouter.post(
    "/",
    authMiddleware.authUser,
    upload.single("resume"),
    InterviewController.generateInterviewReportController
);

/**
 * @route GET /api/interview/report/:interviewId
 * @desc Get single interview report
 * @access Private
 */
InterviewRouter.get(
    "/report/:interviewId",
    authMiddleware.authUser,
    InterviewController.getInterviewReportByUserIdController
);

/**
 * @route GET /api/interview
 * @desc Get all interview reports of logged in user
 * @access Private
 */
InterviewRouter.get(
    "/",
    authMiddleware.authUser,
    InterviewController.getAllInterviewReportsController
);

InterviewRouter.post(
    "/resume/pdf/:interviewReportId",
    authMiddleware.authUser,
    InterviewController.generateResumePdfController
);
module.exports = InterviewRouter;