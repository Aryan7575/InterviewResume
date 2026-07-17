const { z } = require("zod");

const InterviewSchema = z.object({
  title: z.string().max(200),
  
  matchScore: z
    .number()
    .min(0)
    .max(100),

  technicalQuestions: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      })
    )
    .length(5),

  behavioralQuestions: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      })
    )
    .length(5),

  skillGaps: z
    .array(
      z.object({
        skills: z.string(),
        severity: z.enum([
          "low",
          "medium",
          "high",
        ]),
      })
    )
    .length(5),

  preparationPlan: z
    .array(
      z.object({
        day: z.number().int().min(1).max(7), 
        focus: z.string(),
        task: z.array(z.string()).length(3),
      })
    )
    .length(7),
});

module.exports = InterviewSchema;