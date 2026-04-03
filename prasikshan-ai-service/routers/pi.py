import os
import json
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from openai import OpenAI

router = APIRouter()

endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
api_key = os.environ.get("AZURE_OPENAI_API_KEY")

client = OpenAI(
    base_url=endpoint,
    api_key=api_key
)

class PiAnswer(BaseModel):
    question_id: int
    question: str
    answer: str
    expectation: str

class PiReviewRequest(BaseModel):
    answers: List[PiAnswer]
    timeTaken: int

@router.post("/api/pi-review")
async def pi_review(payload: PiReviewRequest):
    try:
        user_answers = payload.answers
        time_taken = payload.timeTaken
        answered_count = len(user_answers)

        if answered_count == 0:
            return JSONResponse(status_code=400, content={"success": False, "error": "No answers provided"})

        responses_text = ""
        for i, a in enumerate(user_answers, start=1):
            if a.answer.strip():
                responses_text += f"{i}. Question: \"{a.question}\"\n"
                responses_text += f"   Candidate's Answer: \"{a.answer}\"\n"
                responses_text += f"   Expected Direction: \"{a.expectation}\"\n\n"

        if not responses_text:
            return JSONResponse(status_code=400, content={"success": False, "error": "All answers are blank."})

        prompt = f"""You are an expert SSB (Services Selection Board) Interviewing Officer (IO) evaluating a candidate's Personal Interview (PI).

The candidate took {time_taken} seconds overall for the interview and answered {answered_count} questions.

Here are the questions and the candidate's answers, along with standard expected guidelines:
{responses_text}

Evaluate the candidate's performance using the following SSB PI criteria and rules:
1. Honesty & Consistency: Does the candidate sound 100% honest, or do they seem to be faking or lying (e.g., claiming to wake up at 5 AM without backing it up)? Do their answers contradict themselves?
2. Natural & Calm: Do they treat it like a natural conversation? Are they clear about themselves (strengths, weaknesses, goals)?
3. Smart & Concise: Are the answers to the point, clear, and relevant, or are they overly lengthy and robotic?
4. OLQs (Officer-Like Qualities): Do the answers show Leadership, Responsibility, Initiative, and Team spirit naturally?
5. DON'Ts Checklist: Did they show arrogance ("I am the best")? Did they blame others ("teachers/friends' fault")? Did they hide weaknesses instead of showing improvement?

Provide:
- A brief, constructive psychological review (4–6 sentences) summarising their interview performance as an IO would see it. Target their sincerity, calmness, clarity, and specific feedback on honesty or blame-shifting if detected.
- An overall score from 1 to 10 based on how impressive, honest, and mature they sounded.
- A very short 1-sentence critique for EACH question-answer pair.

Respond ONLY with valid JSON in this exact format, no extra text:
{{
  "review": "Your detailed evaluation here...",
  "score": 7,
  "question_reviews": [
    {{
      "question_id": 123,
      "review": "1-sentence critique of their specific answer."
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
            "question_reviews": result.get("question_reviews", [])
        }

    except json.JSONDecodeError:
        return JSONResponse(status_code=500, content={"success": False, "error": "AI returned an unexpected response format."})
    except Exception as e:
        err_str = str(e)
        if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "quota" in err_str.lower():
            return JSONResponse(status_code=429, content={"success": False, "quota_exceeded": True, "error": "AI review quota exceeded. Please try again later."})
        return JSONResponse(status_code=500, content={"success": False, "error": err_str})
