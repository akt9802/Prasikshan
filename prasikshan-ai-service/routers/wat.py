import os
import json
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional
from openai import OpenAI

router = APIRouter()

endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
api_key = os.environ.get("AZURE_OPENAI_API_KEY")

client = OpenAI(
    base_url=endpoint,
    api_key=api_key
)

class WatResponse(BaseModel):
    word: str
    response: str

class WATReviewRequest(BaseModel):
    responses: List[WatResponse]
    totalWords: int = 60

@router.post("/api/wat-review")
async def wat_review(payload: WATReviewRequest):
    try:
        user_responses = payload.responses
        total_words = payload.totalWords
        attempted_count = len(user_responses)
        
        if attempted_count == 0:
            return JSONResponse(status_code=400, content={"success": False, "error": "No responses provided"})

        # Group them into a numbered list
        responses_text = ""
        for i, r in enumerate(user_responses, start=1):
            if r.response.strip():
                responses_text += f"{i}. Word: '{r.word}' -> Sentence: '{r.response}'\n"

        if not responses_text:
            return JSONResponse(status_code=400, content={"success": False, "error": "No sentences provided"})

        prompt = f"""You are an expert SSB (Services Selection Board) WAT (Word Association Test) psychologist evaluator.

A candidate was shown a series of {total_words} words (15 seconds each).
CRITICAL FACT: The candidate only attempted {attempted_count} out of {total_words} words.
Leaving words blank is a massive negative in SSB WAT, signifying extreme lack of ideas or slow reaction time under pressure.

Here are the {attempted_count} sentences they wrote:
{responses_text}

Evaluate the candidate's performance based on the following SSB WAT criteria:
1. Completion Rate: Did they attempt at least 55 out of 60 words? (If they attempted very few words, their score MUST be extremely low, e.g., 1 or 2 out of 10, regardless of the quality of the few sentences they did write).
2. Positivity: Did they react positively to negative words? (Crucial)
3. Meaningfulness & Shortness: Are the sentences concise, meaningful, and grammatically correct?
4. Officer Like Qualities (OLQ): Does their response show leadership, courage, social adaptability, and logical thinking?
5. Avoidance: Did they use too many 'I' / me pronouns, generic idioms, predefined phrases, or display superficial responses? Did they just use facts instead of thoughts?

Provide:
- A brief, constructive psychological review (4-6 sentences) summarizing their associative thought process. YOU MUST MENTION their completion rate if it is low (e.g. attempting 2/60 is a failure).
- An overall score from 1 to 10. Give an honest, strict assessment. Heavily penalize low completion rates.
- A very short 1-sentence critique for EACH word they attempted.

Respond ONLY with valid JSON in this exact format:
{{
  "review": "Your detailed psychological review here...",
  "score": 7,
  "word_reviews": [
    {{
      "word": "The actual word",
      "review": "1-sentence critique of their response."
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
            "word_reviews": result.get("word_reviews", [])
        }

    except json.JSONDecodeError:
        return JSONResponse(status_code=500, content={"success": False, "error": "AI returned an unexpected response format."})
    except Exception as e:
        err_str = str(e)
        if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "quota" in err_str.lower():
            return JSONResponse(status_code=429, content={"success": False, "quota_exceeded": True, "error": "AI review quota exceeded. Please try again later."})
        return JSONResponse(status_code=500, content={"success": False, "error": err_str})
