import os
import json
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from openai import OpenAI

router = APIRouter()

endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
api_key = os.environ.get("AZURE_OPENAI_API_KEY")

client = OpenAI(
    base_url=endpoint,
    api_key=api_key
)

class LecturetteReviewRequest(BaseModel):
    topic: str
    transcript: str
    durationSeconds: int = 0

@router.post("/api/lecturette-review")
async def lecturette_review(payload: LecturetteReviewRequest):
    try:
        topic = payload.topic.strip()
        transcript = payload.transcript.strip()
        duration = payload.durationSeconds

        if not transcript:
            return JSONResponse(
                status_code=400,
                content={"success": False, "error": "Transcript is empty"}
            )

        word_count = len(transcript.split())
        duration_str = f"{duration // 60}m {duration % 60}s" if duration > 0 else "unknown"

        prompt = f"""You are an expert SSB (Services Selection Board) GTO and Lecturette evaluator.

A candidate was given the topic: "{topic}"
They had 3 minutes to prepare and 3 minutes to speak.
Their speech was transcribed as follows (duration spoken: {duration_str}, word count: ~{word_count} words):

---
{transcript}
---

IMPORTANT CONTEXT ABOUT LECTURETTE:
- A good lecturette should have: Intro (30s) → Body with 2-3 key points (2 min) → Strong conclusion (30s)
- The candidate should speak for close to 3 minutes. Too short = lack of content; too long = poor time management.
- They must NOT use excessive fillers (um, uh, like, basically, actually, you know)
- They should show a BALANCED perspective — no extreme opinions
- Language should be clear, simple, and confident — NOT overly complex vocabulary
- They should demonstrate officer-like qualities: logical thinking, structured delivery, confidence

Evaluate the candidate's Lecturette strictly based on:
1. Structure & Organisation (Intro → Body → Conclusion)
2. Content Depth & Relevance (Is the topic well-covered with examples?)
3. Language & Clarity (Simple, clear, confident language; no unnecessary fillers)
4. Balance & Maturity (Balanced views, no extreme opinions)
5. Time Management (Word count of {word_count} indicates speech length — penalise very short speeches)
6. Officer-Like Qualities (Confidence, leadership, composure)

Provide:
- A detailed, constructive review (4-6 sentences) mentioning specific strengths and weaknesses.
- A score from 1 to 10. Be honest and strict:
  - Under 50 words (very short) → score 1-3
  - 50-150 words (short) → score 3-5
  - 150-300 words (acceptable) → score 5-7
  - 300+ words (good coverage) → score 7-10, based on quality

Respond ONLY with valid JSON in this exact format, no extra text:
{{
  "review": "Your detailed review here...",
  "score": 7,
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement 1", "Improvement 2"]
}}"""

        completion = client.chat.completions.create(
            model="grok-3",
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        content = completion.choices[0].message.content
        text = content.strip() if content is not None else ""

        if text.startswith("```"):
            parts = text.split("```")
            text = parts[1] if len(parts) >= 2 else text
            text = text.removeprefix("json")
            text = text.removeprefix("json\n")
        text = text.strip()

        result = json.loads(text)
        score = int(result.get("score", 5))
        score = max(1, min(10, score))

        return {
            "success": True,
            "review": result.get("review", ""),
            "score": score,
            "strengths": result.get("strengths", []),
            "improvements": result.get("improvements", [])
        }

    except json.JSONDecodeError:
        return JSONResponse(status_code=500, content={"success": False, "error": "AI returned an unexpected response format."})
    except Exception as e:
        err_str = str(e)
        if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "quota" in err_str.lower():
            return JSONResponse(status_code=429, content={"success": False, "quota_exceeded": True, "error": "AI review quota exceeded. Please try again later."})
        return JSONResponse(status_code=500, content={"success": False, "error": err_str})
