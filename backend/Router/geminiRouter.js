const express = require('express');
const router = express.Router();

// Helper to call external Gemini-like API. Uses GEMINI_API_URL and GEMINI_API_KEY from env.
async function callGemini(apiUrl, apiKey, body) {
  if (!apiUrl) throw new Error('GEMINI_API_URL not configured');

  const headers = {
    'Content-Type': 'application/json',
  };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

  const resp = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = await resp.json().catch(() => null);
  return { ok: resp.ok, status: resp.status, data };
}

// POST /generate
// body: { speechText: string, prompt?: string, model?: string }
router.post('/generate', async (req, res) => {
  try {
    const { speechText = '', prompt = '', topic = '', model } = req.body || {};
    const apiUrl = process.env.GEMINI_API_URL;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiUrl) return res.status(500).json({ message: 'GEMINI_API_URL not configured' });

    // Compose a clearer, topic-aware prompt so the model returns distinct suggestions per lecturette
    const coachPrompt = prompt && String(prompt).trim().length > 0
      ? String(prompt)
      : `You are an expert interview coach. The lecturette topic is: "${topic}".\n\nCandidate answer:\n${speechText}\n\nProvide exactly 3 concise, distinct, and actionable improvement suggestions tailored to this topic and the candidate's answer. Return the suggestions as short bullet points or newline-separated lines, avoid generic advice, and keep each suggestion under 30 words.`;

    const inputText = `INSTRUCTION:\n${coachPrompt}`;

    // Build a generic body - many Gemini-like endpoints accept { input } or { prompt }
    const body = model ? { model, input: inputText } : { input: inputText };

    const result = await callGemini(apiUrl, apiKey, body);
    if (!result.ok) {
      // fallback: return raw data if any
      return res.status(200).json({ text: (result.data && JSON.stringify(result.data)) || '' });
    }

    // try to extract a sensible text field from the provider response
    const d = result.data || {};
    const text = d.outputText || d.output_text || d.text || d.result || d.output ||
      (d.candidates && d.candidates[0] && d.candidates[0].content) ||
      (d.choices && d.choices[0] && (d.choices[0].message?.content || d.choices[0].text)) ||
      JSON.stringify(d);

    return res.json({ text });
  } catch (err) {
    console.error('gemini/generate error', err);
    res.status(500).json({ message: 'Failed to generate suggestion', details: String(err) });
  }
});

// POST /assess
// body: { speechText: string }
// Returns: { score: number (0-10), reasons: [string], raw: string }
router.post('/assess', async (req, res) => {
  try {
    const { speechText = '' } = req.body || {};
    const apiUrl = process.env.GEMINI_API_URL;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiUrl) return res.status(500).json({ message: 'GEMINI_API_URL not configured' });

    // Instruct model to return JSON with score (0-10) and reasons
    const prompt = `You are an interviewer. Evaluate the following candidate answer and return a JSON object exactly in this format: {"score": X, "reasons": ["reason1","reason2"]} where score is an integer from 0 to 10 and reasons are short bullet points.\n\nAnswer:\n${speechText}`;

    const body = { input: prompt };
    const result = await callGemini(apiUrl, apiKey, body);
    const d = result.data || {};

    // Extract text
    const rawText = d.outputText || d.output_text || d.text || d.result || d.output ||
      (d.candidates && d.candidates[0] && d.candidates[0].content) ||
      (d.choices && d.choices[0] && (d.choices[0].message?.content || d.choices[0].text)) ||
      (typeof d === 'string' ? d : JSON.stringify(d));

    // Try to parse JSON from rawText
    let parsed = null;
    try {
      // sometimes providers prefix content in arrays/objects
      parsed = JSON.parse(rawText);
    } catch (e) {
      // attempt to find first JSON substring
      const match = rawText.match(/\{\s*"score"[\s\S]*\}/m);
      if (match) {
        try { parsed = JSON.parse(match[0]); } catch (e2) { parsed = null; }
      }
    }

    if (parsed && typeof parsed.score === 'number') {
      return res.json({ score: parsed.score, reasons: parsed.reasons || [], raw: rawText });
    }

    // Fallback: try to extract a number 0-10 from rawText
    const numMatch = rawText.match(/\b([0-9]|10)\b/);
    const score = numMatch ? Number(numMatch[1]) : null;

    return res.json({ score, reasons: [], raw: rawText });
  } catch (err) {
    console.error('gemini/assess error', err);
    res.status(500).json({ message: 'Failed to assess response', details: String(err) });
  }
});

module.exports = router;
