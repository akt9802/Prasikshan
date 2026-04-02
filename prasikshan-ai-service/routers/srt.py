import os
import json
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List
from openai import OpenAI

router = APIRouter()

endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
api_key = os.environ.get("AZURE_OPENAI_API_KEY")

client = OpenAI(
    base_url=endpoint,
    api_key=api_key
)

class SrtResponse(BaseModel):
    situation: str
    response: str

class SRTReviewRequest(BaseModel):
    responses: List[SrtResponse]
    totalSituations: int = 60

@router.post("/api/srt-review")
async def srt_review(payload: SRTReviewRequest):
    try:
        user_responses = payload.responses
        total_situations = payload.totalSituations
        attempted_count = len(user_responses)

        if attempted_count == 0:
            return JSONResponse(status_code=400, content={"success": False, "error": "No responses provided"})

        # Build numbered list of situation → reaction pairs
        responses_text = ""
        for i, r in enumerate(user_responses, start=1):
            if r.response.strip():
                responses_text += f"{i}. Situation: \"{r.situation}\"\n   Reaction: \"{r.response}\"\n\n"

        if not responses_text:
            return JSONResponse(status_code=400, content={"success": False, "error": "No reactions provided"})

        prompt = f"""You are an expert SSB (Services Selection Board) SRT (Situation Reaction Test) psychologist and evaluator.

A candidate was presented with {total_situations} real-life situations and had 30 seconds to write their immediate reaction to each.
CRITICAL FACT: The candidate only attempted {attempted_count} out of {total_situations} situations.
Leaving situations blank is heavily penalised in SSB SRT — it indicates indecisiveness and slow reaction time under pressure.

Here are the {attempted_count} situation-reaction pairs they wrote:
{responses_text}

Evaluate the candidate's performance using the following SSB SRT criteria:
1. Completion Rate: Did they attempt at least 50 out of 60 situations? If very few were attempted (e.g., under 30), give a score of 1–3 regardless of quality.
2. Decision Speed & Presence of Mind: Are the reactions quick, decisive, and appropriate?
3. Officer-Like Qualities (OLQs): Do the responses show leadership, initiative, courage, social responsibility, and logical thinking?
4. Practicality & Realism: Are the actions realistic and achievable, or reckless/impulsive?
5. Positivity & Composure: Do the responses show a calm, solution-focused attitude rather than panic, avoidance, or aggression?
6. Conciseness: Are the reactions short and to the point (1–2 lines), without unnecessary moralising or over-explanation?
7. Consistency of Character: Does the personality across all reactions paint a coherent, officer-worthy picture?

Provide:
- A brief, constructive psychological review (4–6 sentences) summarising their behavioural tendencies. MUST mention completion rate if it is poor.
- An overall score from 1 to 10. Be honest and strict. Heavily penalise low completion rates.
- A very short 1-sentence critique for EACH situation-reaction pair they attempted.

Respond ONLY with valid JSON in this exact format, no extra text:
{{
  "review": "Your detailed psychological review here...",
  "score": 7,
  "situation_reviews": [
    {{
      "situation": "The exact situation text",
      "review": "1-sentence critique of their reaction."
    }}
  ]
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
            "situation_reviews": result.get("situation_reviews", [])
        }

    except json.JSONDecodeError:
        return JSONResponse(status_code=500, content={"success": False, "error": "AI returned an unexpected response format."})
    except Exception as e:
        err_str = str(e)
        if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "quota" in err_str.lower():
            return JSONResponse(status_code=429, content={"success": False, "quota_exceeded": True, "error": "AI review quota exceeded. Please try again later."})
        return JSONResponse(status_code=500, content={"success": False, "error": err_str})
