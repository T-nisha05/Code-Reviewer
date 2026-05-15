const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/review", async (req, res) => {

  console.log("Request received from frontend");

  try {
    const { code, language, reviewType } = req.body;

   const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

const prompt = `
You are an expert AI code reviewer.

Analyze the following ${language} code for ${reviewType} review.

CODE:
${code}

You MUST return ONLY valid raw JSON.

Do NOT:
- use markdown
- use triple backticks
- add explanations outside JSON
- add extra keys

Return this EXACT structure:

{
  "score": 85,
  "summary": "Short overall assessment of the code quality.",
  "bugs": [
    {
      "severity": "high",
      "title": "Bug title",
      "description": "Short explanation of the issue.",
      "fix": "Corrected code snippet"
    }
  ],
  "security": [
    {
      "severity": "medium",
      "title": "Security issue title",
      "description": "Short explanation.",
      "fix": "Corrected code snippet"
    }
  ],
  "performance": [
    {
      "severity": "low",
      "title": "Performance issue title",
      "description": "Short explanation.",
      "fix": "Optimized code snippet"
    }
  ],
  "bestPractices": [
    {
      "title": "Best practice title",
      "description": "Short explanation.",
      "fix": "Improved code snippet"
    }
  ],
  "improvedCode": "Full corrected version of the code"
}

Rules:
- score must ALWAYS be a number between 0 and 100
- Always include all keys
- Use empty arrays [] if no issues exist
- improvedCode must contain the corrected code as a string
- Keep responses concise and structured
`;

    let result;

for (let i = 0; i < 3; i++) {
  try {
    result = await model.generateContent(prompt);
    break;
  } catch (err) {
    if (err.status === 503 && i < 2) {
      console.log("Retrying...");
      await new Promise(res => setTimeout(res, 2000));
    } else {
      throw err;
    }
  }
}

    const response = await result.response.text();

    res.json({
      success: true,
      data: response,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});