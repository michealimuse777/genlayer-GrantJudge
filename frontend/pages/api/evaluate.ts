import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Allow CORS for contract calls from validator nodes
    res.setHeader('Access-Control-Allow-Origin', '*');

    const { text } = req.query;
    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Missing text parameter' });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        return res.status(500).json({ clarity: 5, feasibility: 5, innovation: 5, summary: "API key not configured" });
    }

    const prompt = `You are a grant proposal evaluator. Score this proposal on three dimensions.
Return ONLY a valid JSON object with these exact fields, no other text:
{"clarity": <integer 0-10>, "innovation": <integer 0-10>, "feasibility": <integer 0-10>, "summary": "<one sentence explanation>"}

Proposal:
${decodeURIComponent(text).slice(0, 1000)}`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0,
                        responseMimeType: "application/json",
                    }
                })
            }
        );

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        const scores = JSON.parse(aiText);
        // Validate and clamp scores
        const result = {
            clarity: Math.min(10, Math.max(0, parseInt(scores.clarity) || 5)),
            innovation: Math.min(10, Math.max(0, parseInt(scores.innovation) || 5)),
            feasibility: Math.min(10, Math.max(0, parseInt(scores.feasibility) || 5)),
            summary: String(scores.summary || "AI evaluated").slice(0, 200),
        };
        return res.status(200).json(result);
    } catch (error: any) {
        console.error("Gemini API error:", error);
        return res.status(200).json({ clarity: 5, feasibility: 5, innovation: 5, summary: "AI evaluation fallback" });
    }
}
