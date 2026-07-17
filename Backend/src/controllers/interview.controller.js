const pdfParse = require("pdf-parse");
const {generateInterviewReport,generateResumePdf} = require("../services/ai.services");
const InterviewReportModel = require("../models/interviewreport.model");

async function generateInterviewReportController(req, res) {
    try {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const { selfDescription, jobDescription } = req.body;

        let resumeText = "";

        if (req.file) {
            const resumeContent = await (
                new pdfParse.PDFParse(
                    Uint8Array.from(req.file.buffer)
                )
            ).getText();

            resumeText = resumeContent.text;
        }

        const InterviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription,
        });

        const interviewReport = await InterviewReportModel.create({
            title:req.title,
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...InterviewReportByAi,
        });
        
        return res.status(201).json({
            message: "Interview Report generated Successfully",
            user: req.user.id,
            title:req.title,
            interviewReport,
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: err.message,
            stack: err.stack,
        });
    }
}

/**
 * @desc controller to get interview report by interview id
 */

async function getInterviewReportByUserIdController(req,res){
    
    const { interviewId } = req.params

    const InterviewReport = await InterviewReportModel.findOne({_id:interviewId, user:req.user.id})

    if(!InterviewReport){
        return res.status(404).json({
            message:"Interview Report not found"
        })
    }

    res.status(200).json({
        message:"Interview Report fetched Successfully",
        user:req.user.id,
        interviewReport: InterviewReport
    })
}

async function getAllInterviewReportsController(req,res){
    const InterviewReports = await InterviewReportModel.find({user:req.user.id}).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message:"Interview Reports fetched Successfully",
        interviewReports: InterviewReports
    })
}

/**
 * @desc controller to generate resume pdf based on user self description, resume content and job description.
 */

async function generateResumePdfController(req,res){
    const {interviewReportId} = req.params

    const interviewReport = await InterviewReportModel.findById(interviewReportId)

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview Report not found"
        })  
    }

    const {resume,selfDescription,jobDescription} = interviewReport
    const pdfBuffer = await generateResumePdf({
        resume:interviewReport.resume,
        selfDescription:interviewReport.selfDescription,
        jobDescription:interviewReport.jobDescription
    })  

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume_${interviewReportId}.pdf"`,
        'Content-Length': pdfBuffer.length 
    })
    res.send(pdfBuffer)
}   
module.exports = {generateInterviewReportController, getInterviewReportByUserIdController,getAllInterviewReportsController,generateResumePdfController}