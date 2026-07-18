const Groq = require("groq-sdk");
const { z } = require("zod");
const puppeteer = require("puppeteer");
const path = require("path");
const InterviewSchema = require("../models/interview.model");

const ai = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const responseSchema = {
    type: "object",
    properties: {
        title: {
            type: "string",
            maxLength: 200
        },
        
        matchScore: {
            type: "number",
            minimum: 0,
            maximum: 100
        },

        technicalQuestions: {
            type: "array",
            minItems: 5,
            maxItems: 5,
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string"
                    },
                    intention: {
                        type: "string"
                    },
                    answer: {
                        type: "string"
                    }
                },
                required: [
                    "question",
                    "intention",
                    "answer"
                ]
            }
        },

        behavioralQuestions: {
            type: "array",
            minItems: 5,
            maxItems: 5,
            items: {
                type: "object",
                properties: {
                    question: {
                        type: "string"
                    },
                    intention: {
                        type: "string"
                    },
                    answer: {
                        type: "string"
                    }
                },
                required: [
                    "question",
                    "intention",
                    "answer"
                ]
            }
        },

        skillGaps: {
            type: "array",
            minItems: 3,
            maxItems: 6,
            items: {
                type: "object",
                properties: {
                    skills: {
                        type: "string"
                    },
                    severity: {
                        type: "string"
                    }
                },
                required: [
                    "skills",
                    "severity"
                ]
            }
        },

        preparationPlan: {
            type: "array",
            minItems: 7,
            maxItems: 7,
            items: {
                type: "object",
                properties: {
                    day: {
                        type: "number"
                    },
                    focus: {
                        type: "string"
                    },
                    task: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                },
                required: [
                    "day",
                    "focus",
                    "task"
                ]
            }
        }
    },

    required: [
        "title",
        "matchScore",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGaps",
        "preparationPlan"
    ]
};

async function generateInterviewReport({
    resume,
    jobDescription,
    selfDescription
}) {

    const prompt = `
You are an expert Technical Interview Coach.

Analyze the following information and generate an interview report.

Resume:
${resume}

Job Description:
${jobDescription}

Self Description:
${selfDescription}

Rules:

- Return ONLY valid JSON.
- Do not use markdown.
- Do not explain anything.
- matchScore must be between 0 and 100.
- Generate a title for this interview report.
- The title must be under 6 words.
- It should represent the target job role.
- Maximum 4 words.
- Do NOT include the words "Interview" or "Report".
- Examples:
  MERN Stack Developer
  Frontend React Developer
  Backend Node.js Engineer
  Java Full Stack Developer
- Generate EXACTLY 5 technical questions.
- Generate EXACTLY 5 behavioral questions.

- Generate between 3 and 6 skill gaps.

- Severity MUST ONLY be:
low
medium
high

Always use lowercase.

- Generate EXACTLY 7 preparation days.

- Every day MUST contain EXACTLY 3 tasks.
`;

    try {

        const response = await ai.chat.completions.create({
            model: "openai/gpt-oss-120b",

            messages: [
                {
                    role: "system",
                    content:
                        "Return only valid JSON matching the provided schema."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],

            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "InterviewReport",
                    schema: responseSchema
                }
            }
        });

        const result = JSON.parse(
            response.choices[0].message.content
        );

        console.log(result)

        // Normalize severity values
        if (result.skillGaps) {
            result.skillGaps = result.skillGaps.map(skill => ({
                ...skill,
                severity: String(skill.severity)
                    .toLowerCase()
                    .trim()
            }));
        }

        const parsed = InterviewSchema.safeParse(result);

        if (!parsed.success) {

            console.log("\n========= AI Validation Failed =========\n");

            console.dir(parsed.error.issues, {
                depth: null
            });

            console.log("\n========================================\n");

            console.log("\n===== RAW AI OUTPUT =====\n");
            console.log(JSON.stringify(result, null, 2));

            console.log("\n===== ZOD ERRORS =====\n");
            console.dir(parsed.error.issues, { depth: null });;
        }

        return parsed.data;

    } catch (err) {

        console.error(err);

        throw err;
    }
}

const fs = require("fs");

async function generatePdfHtml(htmlContent) {

    console.log("Executable Path:", puppeteer.executablePath());

    console.log(
        "Browser Exists:",
        fs.existsSync(puppeteer.executablePath())
    );

    const browser = await puppeteer.launch({
        executablePath: puppeteer.executablePath(),
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
        ],
    });

    try {
        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: "networkidle0",
        });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm",
            },
        });

        return pdfBuffer;
    } finally {
        await browser.close();
    }
}

async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription,
}) {

    const PdfResponseSchema = z.object({
        html: z.string().describe(
            "The HTML content of the resume which can be converted to PDF."
        ),
    });

    const prompt = 
`Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resumeyou can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally only 1 page long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `;

    try {
        const response = await ai.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "system",
                    content:
                        "Return only valid JSON matching the required schema."
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            response_format: {
                type: "json_object",
            },
        });

        const jsonContent = JSON.parse(
            response.choices[0].message.content
        );

        const parsed = PdfResponseSchema.safeParse(jsonContent);

        if (!parsed.success) {
            console.log(parsed.error.issues);
            throw new Error("Invalid AI response");
        }

        const pdfBuffer = await generatePdfHtml(parsed.data.html);

        return pdfBuffer;

    } catch (err) {
        console.error("Resume PDF generation failed:");
        console.error(err);
        throw err;
    }
}
module.exports = {generateInterviewReport, generateResumePdf};  