import { useState, useRef } from "react";
import{ useNavigate } from "react-router"
import { Briefcase, User, Upload, Info, Star } from "lucide-react";
import "../styles/Home.scss";
import { useInterview } from "../hooks/useInterview.js"; 
const MAX_CHARS = 5000;

export default function Home() {
  const navigate = useNavigate()
  const {loading, generateReport,reports} = useInterview()
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  console.log("resumeFile:", resumeFile);

  const handleGenerateReport = async () => {
  console.log("resumeFile state:", resumeFile);

  const data = await generateReport({
    jobDescription,
    selfDescription,
    resumeFile,
  });
  console.log(data)
  if (!data) return;

  navigate(`/interview/${data._id}`);
};


  const handleFileSelect = (file) => {
    console.log(file);
    if (!file) return;
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;
    setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files?.[0]);

  };

  const canGenerate =
    jobDescription.trim().length > 0 &&
    (resumeFile !== null || selfDescription.trim().length > 0);

    if(loading){
        return(
            <div className="loading-screen">
                <h2>Generating your interview plan...</h2>
            </div>
        )
    } 

  return (
    <div className="home">
      <div className="home__main">
        {/* Header */}
        <div className="home__header">
          <h1>
            Create Your Custom <span className="accent">Interview Plan</span>
          </h1>
          <p>
            Let our AI analyze the job requirements and your unique profile
            to build a winning strategy.
          </p>
        </div>

        {/* Card */}
        <div className="card">
          <div className="card__grid">
            {/* Left: Job Description */}
            <div className="card__col">
              <div className="section-title">
                <div className="section-title__label">
                  <Briefcase size={16} />
                  <span>Target Job Description</span>
                </div>
                <span className="badge">REQUIRED</span>
              </div>

              <div className="field-wrap">
                <textarea
                  className="textarea textarea--job"
                  value={jobDescription}
                  onChange={(e) =>
                    setJobDescription(e.target.value.slice(0, MAX_CHARS))
                  }
                  placeholder={
                    "Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                  }
                />
                <span className="char-count">
                  {jobDescription.length} / {MAX_CHARS} chars
                </span>
              </div>
            </div>

            {/* Right: Profile */}
            <div className="card__col profile">
              <div className="section-title">
                <div className="section-title__label">
                  <User size={16} />
                  <span>Your Profile</span>
                </div>
              </div>

              <div className="field-label-row">
                <span>Upload Resume</span>
                <span className="badge">BEST RESULTS</span>
              </div>

              <label
                className={`dropzone ${isDragging ? "dropzone--dragging" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => handleFileSelect(e.target.files?.[0])}
                />
                <Upload size={22} />
                <span className="dropzone__title">
                  {resumeFile
                    ? resumeFile.name
                    : "Click to upload or drag & drop"}
                </span>
                <span className="dropzone__hint">PDF or DOCX (Max 5MB)</span>
              </label>

              <div className="divider">
                <div className="divider__line" />
                <span>OR</span>
                <div className="divider__line" />
              </div>

              <span className="field-label">Quick Self-Description</span>
              <textarea
                className="textarea textarea--self"
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />

              <div className="info-box">
                <Info size={16} />
                <p>
                  Either a <strong>Resume</strong> or a{" "}
                  <strong>Self Description</strong> is required to generate a
                  personalized plan.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="card__footer">
            <span className="footer-note">
              AI-Powered Strategy Generation · Approx 30s
            </span>
            <button onClick={handleGenerateReport} className="generate-btn" disabled={!canGenerate}>
              <Star size={15} fill="currentColor" />
              Generate My Interview Strategy
            </button>
          </div>
        </div>
      </div>

      {/* Recent report */}
     {reports.length > 0 && (
  <section className="recent-reports">
    <h2>Recent Interview Plans</h2>

    <ul className="reports-list">
      {reports.map((report) => (
        <li
          key={report._id}
          className="report-item"
          onClick={() => navigate(`/interview/${report._id}`)}
        >
          <h3>{report.title || report.jobTitle || report.position || "Untitled Position"}</h3>
           <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
            <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
            </li>
      ))}
    </ul>
  </section>
)}
      {/* Page footer */}
      <div className="page-footer">
        <div className="page-footer__links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
        </div>
      </div>
    </div>
  );
}
