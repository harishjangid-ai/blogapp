import Groq from "groq-sdk";
import { Request, Response } from "express";

export const generateBlog = async ( req: Request, res: Response ): Promise<Response> => {
  try {
    const { topic, tone } = req.body;

    if (!topic || !tone) {
      return res.status(400).json({
        success: false,
        error: "Topic and tone are required",
      });
    }

    const groq = new Groq({
      apiKey: process.env.API_KEY,
    });

    const prompt = `
Generate a blog post in VALID JSON format only.

Rules:
- Minimum 500 words
- Maximum 2000 words
- Return ONLY pure JSON
- No extra text outside JSON
- Description should contain complete blog content
- Content should mostly be in paragraph form
- Sometimes important points can be shown using:
  - Markdown headings (#, ##, ###)
  - Bullet points (-, *, •)
  - Numbered lists (1. 2. 3.)
- Use clean and readable formatting
- Do not break JSON format

JSON format:
{
  "title": "Blog title",
  "description": "Full blog content"
}

Topic: ${topic}
Tone: ${tone}
`;

    const data = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const raw = data.choices[0].message.content;

    let parsedData;

    try {
      parsedData = JSON.parse(raw);
    } catch (parseError) {
      return res.status(500).json({
        success: false,
        error: "Invalid JSON response from AI",
        raw,
      });
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error
    });
  }
};