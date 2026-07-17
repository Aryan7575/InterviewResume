import {generateInterviewReport, getInterviewReportById, getAllInterviewReports,generateResumePdf} from "../services/interview.api"
import { useContext,useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"

export const useInterview = () =>{
    const context = useContext(InterviewContext)
    const {interviewId} = useParams()
    if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const{report, setReport, loading, setLoading, reports, setReports} = context 

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    setLoading(true);
        let response = null;
    try {
            response = await generateInterviewReport({
            jobDescription,
            selfDescription,
            resumeFile,
        });

        setReport(response.interviewReport); // or InterviewReport depending on backend

    } catch (error) {
        console.log(error);
        return null;
    } finally {
        setLoading(false);
    }
    return response.interviewReport; // IMPORTANT
};

    const getReportById = async (interviewId) => {
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
        } finally {
            setLoading(false)
        }

        return response.interviewReport
    }

    const getAllReports = async () => {
        setLoading(true)
        let response = null
        try{
             response = await getAllInterviewReports()
            setReports(response.interviewReports)
        }catch(error){
        }finally{
            setLoading(false)
        }
        return response.interviewReports
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try{
            response = await generateResumePdf({interviewReportId}) 
            const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `resume_${interviewReportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }catch(error){
            console.error("Error generating resume PDF:", error);
        }finally{
            setLoading(false)
        } }

    useEffect(()=>{
        if(interviewId){
            getReportById(interviewId)
        }else{
            getAllReports()
        }
    },[interviewId])
    return { report, setReport, loading, setLoading, reports, setReports, getAllReports, generateReport, getReportById, getResumePdf}
}