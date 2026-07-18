import { useState } from "react";
import {useInterview} from "../hooks/useInterview.js"
import {
  Code2,
  MessageSquare,
  Compass,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import "../styles/Interview.scss";
import { useParams,useNavigate } from "react-router-dom";
import { useEffect } from "react";

// ------------------------------
// Dummy report (shape matches the AI-generated interview plan payload)
// ------------------------------

const SECTIONS = [
  { id: "technical", label: "Technical Questions", icon: Code2 },
  { id: "behavioral", label: "Behavioral Questions", icon: MessageSquare },
  { id: "roadmap", label: "Road Map", icon: Compass },
];

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function Interview() {
  const { report,getReportById,loading,getResumePdf } = useInterview();
  const {interviewId} = useParams()

  useEffect(()=>{
    if(interviewId){
        getReportById(interviewId)
    }},[interviewId])

     const [activeSection, setActiveSection] = useState("technical");
const [openIndex, setOpenIndex] = useState(0);

const questions =
  activeSection === "technical"
    ? report?.technicalQuestions
    : activeSection === "behavioral"
    ? report?.behavioralQuestions
    : null;

const sectionTitle =
  SECTIONS.find((s) => s.id === activeSection)?.label;

const handleSectionClick = (id) => {
  setActiveSection(id);
  setOpenIndex(0);
};

const scoreOffset =
  report
    ? CIRCUMFERENCE - (report.matchScore / 100) * CIRCUMFERENCE
    : CIRCUMFERENCE;

if (loading || !report) {
  return (
    <main className="loading-screen">
      <h1>Generating your interview plan...</h1>
    </main>
  );
}
  return (
    <div className="interview">
      {/* Left sidebar */}
      <aside className="interview__aside interview__aside--left">
        <p className="sections-label">SECTIONS</p>
        <nav className="nav-list">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${
                activeSection === id ? "nav-item--active" : ""
              }`}
              onClick={() => handleSectionClick(id)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
          </nav>
         <div className="resume-download-wrap">
        <button
          className="button primary-button"
          onClick={()=>{getResumePdf(interviewId)}}
        >
          <svg height="0.8rem" style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.9996 12.0235C17.5625 12.4117 12.4114 17.563 12.0232 24H11.9762C11.588 17.563 6.4369 12.4117 0 12.0235V11.9765C6.4369 11.5883 11.588 6.43719 11.9762 0H12.0232C12.4114 6.43719 17.5625 11.5883 23.9996 11.9765V12.0235Z"></path>
          </svg>
          Download Resume
        </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="interview__main">
        <div className="main-header">
          <h1>{sectionTitle}</h1>
          {questions && (
            <span className="count-badge">{questions.length} questions</span>
          )}
        </div>
        <div className="header-divider" />

        {questions && (
          <div className="question-list">
            {questions.map((q, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`question-card ${
                    isOpen ? "question-card--open" : ""
                  }`}
                >
                  <button
                    className="question-card__head"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span className="q-index">Q{i + 1}</span>
                    <span className="q-text">{q.question}</span>
                    <span className="q-chevron">
                      {isOpen ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="question-card__body">
                      <div className="q-block">
                        <span className="tag tag--intention">INTENTION</span>
                        <p>{q.intention}</p>
                      </div>
                      <div className="q-block">
                        <span className="tag tag--answer">MODEL ANSWER</span>
                        <p>{q.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeSection === "roadmap" && (
          <div className="roadmap-list">
            {report.preparationPlan.map((d) => (
              <div className="roadmap-day" key={d.day}>
                <div className="roadmap-day__marker">D{d.day}</div>
                <div className="roadmap-day__body">
                  <h3>{d.focus}</h3>
                  <ul>
                    {d.task.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Right sidebar */}
      <aside className="interview__aside interview__aside--right">
        <p className="match-score-label">MATCH SCORE</p>
        <div className="match-score">
          <div className="match-score__ring">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle className="ring-track" cx="70" cy="70" r={RADIUS} />
              <circle
                className="ring-value"
                cx="70"
                cy="70"
                r={RADIUS}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={scoreOffset}
              />
            </svg>
            <div className="match-score__number">
              <span className="value">{report.matchScore}</span>
              <span className="percent">%</span>
            </div>
          </div>
          <p className="match-score__caption">
            {report.matchScore >= 80
              ? "Strong match for this role"
              : report.matchScore >= 60
              ? "Good match, some gaps to close"
              : "Needs preparation to close gaps"}
          </p>
        </div>

        <p className="skill-gaps-label">SKILL GAPS</p>
        <div className="skill-gaps">
          {report.skillGaps.map((gap, i) => (
            <div className={`skill-gap skill-gap--${gap.severity}`} key={i}>
              {gap.skills}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
