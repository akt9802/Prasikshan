const express = require('express');
const router = express.Router();

// Helper to call external Gemini-like API. Uses GEMINI_API_URL and GEMINI_API_KEY from env.
async function callGemini(apiUrl, apiKey, body) {
  if (!apiUrl) throw new Error('GEMINI_API_URL not configured');

  const headers = {
    'Content-Type': 'application/json',
  };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

  // Log call (without exposing the API key)
  try {
    console.debug('[callGemini] POST', apiUrl, 'payloadKeys=', Object.keys(body || {}));
  } catch {}

  try {
    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    // read raw text first so we can include it in logs if JSON parsing fails
    const rawText = await resp.text().catch(() => null);
    let data = null;
    try {
      if (rawText) data = JSON.parse(rawText);
    } catch (e) {
      data = null;
    }

    if (!resp.ok) {
      console.warn('[callGemini] non-ok response', resp.status, rawText?.slice?.(0, 1000));
    } else {
      console.debug('[callGemini] ok response', resp.status);
    }

    return { ok: resp.ok, status: resp.status, data, raw: rawText };
  } catch (err) {
    console.error('[callGemini] network/error calling provider', String(err));
    return { ok: false, status: 0, data: null, raw: String(err) };
  }
}

// Local fallback: produce simple suggestions when provider fails or quota exceeded
function localSuggestion(text, topic) {
  if (!text || !text.trim()) return 'Your response is empty — try to speak a short introduction, 2-3 supporting points and a one-line conclusion.';
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const short = words < 25;
  const suggestions = [];
  if (topic) suggestions.push(`Tie your points to the topic: "${topic}".`);
  if (short) {
    suggestions.push('Your response is short — expand with 2–3 supporting points and a short conclusion.');
  } else {
    suggestions.push('Structure: Start with a one-sentence intro, add 2–3 supporting points, and finish with a one-line conclusion.');
    suggestions.push('Clarity: Use shorter sentences and avoid repetition.');
  }
  suggestions.push('Delivery: Slow down slightly, pause between points and avoid filler words.');
  return suggestions.join('\n\n');
}

// Local fallback scoring: returns 0-10 score and reasons
function localAssess(text) {
  if (!text || !text.trim()) return { score: 0, reasons: ['No speech detected'], raw: '' };
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const avgWordLen = words.reduce((s,w)=>s+w.length,0)/wordCount;
  const fillerMatches = (text.match(/\b(um+|uh+|like|you know|so)\b/gi) || []).length;
  // Heuristic scoring (0-100) with a short-answer guard
  let s = 50;
  s += Math.min(25, Math.floor(wordCount / 4));
  s += avgWordLen > 4 ? 10 : 0;
  s -= fillerMatches * 7;
  if (s > 100) s = 100;
  if (s < 0) s = 0;
  const reasons = [];
  reasons.push(`Words: ${wordCount}`);
  reasons.push(`Avg word length: ${avgWordLen.toFixed(1)}`);
  if (fillerMatches > 0) reasons.push(`Filler words detected: ${fillerMatches}`);
  if (wordCount < 30) reasons.push('Try to expand your answer with 2–3 supporting points.');
  // If the answer is extremely short (likely just repeating the topic), give a low score
  if (wordCount <= 5) {
    return { score: 1, reasons: ['Answer is too short — expand with supporting points'], raw: '' };
  }

  const scoreOutOf10 = Math.max(1, Math.round((Math.round(s) || 0) / 10));
  return { score: scoreOutOf10, reasons, raw: '' };
}

// Normalize and extract text from a provider response object. Tries several common shapes
function extractTextFromProvider(d) {
  if (!d) return '';

  // 1) direct fields
  if (typeof d === 'string') return d;
  if (d.outputText) return d.outputText;
  if (d.output_text) return d.output_text;
  if (d.text) return d.text;
  if (d.result) return d.result;
  if (d.output) {
    // OpenAI Responses may include output array with content pieces
    try {
      if (Array.isArray(d.output)) {
        return d.output
          .map((o) => {
            if (!o) return '';
            if (typeof o === 'string') return o;
            // content may be array of {type:'output_text', text: '...'} or similar
            if (o.content && Array.isArray(o.content)) {
              return o.content.map((c) => c.text || c?.[0]?.text || '').join(' ');
            }
            return JSON.stringify(o);
          })
          .filter(Boolean)
          .join('\n');
      }
    } catch (e) {
      // ignore
    }
  }

  // 2) choices array (OpenAI chat/completions style)
  if (d.choices && Array.isArray(d.choices) && d.choices.length) {
    const c0 = d.choices[0];
    // chat completions: choices[0].message.content or choices[0].message?.content?.text
    if (c0.message && (c0.message.content || c0.message?.content?.text)) {
      if (typeof c0.message.content === 'string') return c0.message.content;
      if (c0.message.content?.text) return c0.message.content.text;
    }
    // older shape: choices[0].text
    if (c0.text) return c0.text;
    // responses API: choices[0].output?.[0]?.content
    if (c0.output && Array.isArray(c0.output)) {
      return c0.output.map((o) => (o.content || []).map((c) => c.text || '').join(' ')).join('\n');
    }
  }

  // 3) candidates array (some providers)
  if (d.candidates && Array.isArray(d.candidates) && d.candidates.length) {
    const c = d.candidates[0];
    if (c.content) return c.content;
    if (c.text) return c.text;
  }

  // 4) attempt to stringify as last resort
  try {
    return JSON.stringify(d);
  } catch (e) {
    return String(d);
  }
}

// POST /generate
// body: { speechText: string, prompt?: string, model?: string }
router.post('/generate', async (req, res) => {
  try {
    const { speechText = '', prompt = '', topic = '', model } = req.body || {};
    const apiUrl = process.env.GEMINI_API_URL;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiUrl) return res.status(500).json({ message: 'GEMINI_API_URL not configured' });
    // Quick sanity: ensure apiUrl looks like a URL (starts with http). If someone put the key here
    // by mistake we can give a clearer error to help debugging.
    if (typeof apiUrl === 'string' && !apiUrl.startsWith('http')) {
      return res.status(500).json({ message: 'GEMINI_API_URL appears invalid (not a URL). Check backend/.env — did you accidentally put the API key into GEMINI_API_URL?' });
    }

    // Compose a clearer, topic-aware prompt so the model returns distinct suggestions per lecturette
    const coachPrompt = prompt && String(prompt).trim().length > 0
      ? String(prompt)
      : `You are an expert interview coach. The lecturette topic is: "${topic}".\n\nCandidate answer:\n${speechText}\n\nProvide exactly 3 concise, distinct, and actionable improvement suggestions tailored to this topic and the candidate's answer. Return the suggestions as short bullet points or newline-separated lines, avoid generic advice, and keep each suggestion under 30 words.`;

    const inputText = `INSTRUCTION:\n${coachPrompt}`;

    // Build a provider-aware body. If the API URL looks like OpenAI, send the Responses/Chat shape.
    let body;
    const isOpenAI = typeof apiUrl === 'string' && apiUrl.includes('api.openai.com');
    const defaultModel = process.env.GEMINI_MODEL || 'gpt-4o-mini';
    if (isOpenAI) {
      // OpenAI Responses API accepts { model, input }
      body = { model: model || defaultModel, input: inputText };
    } else {
      // Generic fallback for other providers
      body = model ? { model, input: inputText } : { input: inputText };
    }

    const result = await callGemini(apiUrl, apiKey, body);
    if (!result.ok) {
      console.warn('Provider returned non-ok for /generate', result.status, result.data);
      // Fallback to local suggestion generator when provider fails (quota, auth, etc.)
      const fallback = localSuggestion(speechText, topic);
      return res.status(200).json({ text: fallback, raw: result.data || null });
    }
    // try to extract a sensible text field from the provider response
    const d = result.data || {};
    const text = extractTextFromProvider(d);
    // If provider returned an error object inside data, fallback
    if (d && d.error) {
      console.warn('Provider returned error payload for /generate', d.error);
      const fallback = localSuggestion(speechText, topic);
      return res.status(200).json({ text: fallback, raw: d });
    }

    // Normal return
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
    if (typeof apiUrl === 'string' && !apiUrl.startsWith('http')) {
      return res.status(500).json({ message: 'GEMINI_API_URL appears invalid (not a URL). Check backend/.env — did you accidentally put the API key into GEMINI_API_URL?' });
    }

    // Instruct model to return JSON with score (0-10) and reasons
    const prompt = `You are an interviewer. Evaluate the following candidate answer and return a JSON object exactly in this format: {"score": X, "reasons": ["reason1","reason2"]} where score is an integer from 0 to 10 and reasons are short bullet points.\n\nAnswer:\n${speechText}`;

    const isOpenAI = typeof apiUrl === 'string' && apiUrl.includes('api.openai.com');
    const defaultModel = process.env.GEMINI_MODEL || 'gpt-4o-mini';
    const body = isOpenAI ? { model: defaultModel, input: prompt } : { input: prompt };
    const result = await callGemini(apiUrl, apiKey, body);
    const d = result.data || {};

    // If provider failed, fallback to local assessment
    if (!result.ok) {
      console.warn('Provider returned non-ok for /assess', result.status, result.data);
      const fallback = localAssess(speechText);
      return res.json(fallback);
    }

    // Extract text
    const rawText = extractTextFromProvider(d);

    // If provider returned an error object inside data, fallback
    if (d && d.error) {
      console.warn('Provider returned error payload for /assess', d.error);
      const fallback = localAssess(speechText);
      return res.json(fallback);
    }

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
