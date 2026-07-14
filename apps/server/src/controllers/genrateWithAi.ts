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
- Return ONLY valid JSON.
- No markdown code blocks.
- No explanation.
- No text outside JSON.
- Blog length between 500 and 2000 words.
- Use clear structure.
- Title should be attractive and SEO friendly.

The description must be an ARRAY of content blocks instead of one long string.

Each block must have a "type".

Allowed block types:
- heading1
- heading2
- heading3
- paragraph

Rules:
- First block should usually be heading1.
- Use heading2 and heading3 where appropriate.
- Paragraphs should be well formatted.
- Do NOT use bullet lists.
- Do NOT use numbered lists.
- Do NOT use tables.
- Do NOT use HTML.
- Do NOT use Markdown.
- Plain text only inside paragraph text.

Response format:

{
  "title": "Blog title",
  "description": [
    {
      "type": "heading1",
      "text": "Heading"
    },
    {
      "type": "paragraph",
      "text": "Paragraph..."
    },
    {
      "type": "heading2",
      "text": "Another Heading"
    },
    {
      "type": "paragraph",
      "text": "Another paragraph..."
    }
  ]
}

Topic:
${topic}

Tone:
${tone}
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
      const raws = raw as string
      parsedData = JSON.parse(raws);
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