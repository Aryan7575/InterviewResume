const mongoose = require("mongoose");

/**
 * - jobDescription: String
 * - resume: String
 * - selfDescription: String
 *
 * - matchScore: Number
 *
 * - technicalQuestions: [{
 *    answer:"",
 *    intention:"",
 *    question:"",
 * }]
 *
 * - behavioralQuestions: [{
 *    answer:"",
 *    intention:"",
 *    question:"",
 * }]
 *
 * - skillGaps: [{
 *    skills:"",
 *    severity:"low | medium | high"
 * }]
 *
 * - preparationPlan: [{
 *    day:Number,
 *    focus:String,
 *    task:[]
 * }]
 */

const TechnicalQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Technical Question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  }
);

const BehavioralQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Behavioral Question is required"],
    },
    intention: {
      type: String,
      required: [true, "Intention is required"],
    },
    answer: {
      type: String,
      required: [true, "Answer is required"],
    },
  },
  {
    _id: false,
  }
);

const SkillGapSchema = new mongoose.Schema(
  {
    skills: {
      type: String,
      required: [true, "Skill is required"],
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: [true, "Severity is required"],
    },
  },
  {
    _id: false,
  }
);

const PreparationPlanSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, "Day is required"],
    },
    focus: {
      type: String,
      required: [true, "Focus is required"],
    },
    task: [
      {
        type: String,
        required: [true, "Task is required"],
      },
    ],
  },
  {
    _id: false,
  }
);

const InterviewReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
    selfDescription: {
      type: String,
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    technicalQuestions: [TechnicalQuestionSchema],
    behavioralQuestions: [BehavioralQuestionSchema],
    skillGaps: [SkillGapSchema],
    preparationPlan: [PreparationPlanSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const InterviewReportModel = mongoose.model(
  "interviewreport",
  InterviewReportSchema
);

module.exports = InterviewReportModel;