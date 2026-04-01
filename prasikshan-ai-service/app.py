import os
import json
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = FastAPI(title="Prasikshan AI Service", version="1.0.0")

# Setup CORS equivalent to Flask-CORS defaults
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT", "https://basic-agent-flow-zak-resource.services.ai.azure.com/models")
api_key = os.environ.get("AZURE_OPENAI_API_KEY")

client = OpenAI(
    base_url=endpoint,
    api_key=api_key
)

class SampleStory(BaseModel):
    title: Optional[str] = None
    narration: Optional[str] = None

class PPDTReviewRequest(BaseModel):
    story: str
    sampleStories: List[SampleStory] = Field(default_factory=list)

@app.post("/api/ppdt-review")
async def ppdt_review(payload: PPDTReviewRequest):
    try:
        story = payload.story
        sample_stories = payload.sampleStories

        if not story or not story.strip():
            return JSONResponse(
                status_code=400,
                content={"success": False, "error": "Story is empty"}
            )

        # Format sample stories into readable text for context
        sample_stories_text = ""
        if sample_stories:
            sample_stories_text = "\n\nHere are the IDEAL sample stories for this image (use these to understand the scene and evaluate the candidate's story):\n"
            for i, s in enumerate(sample_stories, start=1):
                title = s.title or f"Sample {i}"
                narration = s.narration or ""
                sample_stories_text += f"\n[Sample {i}] {title}\n{narration}\n"

        prompt = f"""You are an expert SSB (Services Selection Board) PPDT evaluator.

A candidate was shown a hazy image and had 4 minutes to write a story about it.
{sample_stories_text}

The CANDIDATE'S story is:
---
{story}
---

CRITICAL RULE: Perception Accuracy is paramount. If the candidate's story describes a completely different scenario or setting from the sample stories (e.g., they describe a hospital but the scene is a classroom), this is a FATAL FLAW in PPDT. Regardless of how well-written or positive their story is, give a score of 3 or less and point out the flawed perception.

Compare the candidate's story with the sample stories and evaluate it based on these SSB PPDT criteria:
1. Perception accuracy (Is the scenario aligned with the visual cues implied by the sample stories? VERY IMPORTANT)
2. Characters & roles (Are characters clearly identified with proper roles?)
3. Theme (Is the central theme strong and officer-like?)
4. Narrative structure (Past context → Present action → Future resolution)
5. Positive outcome (Does the story end positively with practical problem-solving?)
6. Language & clarity (Is the writing clear and concise?)

Provide:
- A brief, constructive review (3-5 sentences, specific to their story, pointing out if they missed the scenario altogether)
- A score from 1 to 10 (Strictly follow the Critical Rule for mismatched scenarios)

Respond ONLY with valid JSON in this exact format, no extra text:
{{
  "review": "Your detailed review here...",
  "score": 7
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

        # Strip markdown code fences if present
        if text.startswith("```"):
            parts = text.split("```")
            text = parts[1] if len(parts) >= 2 else text
            text = text.removeprefix("json")
            text = text.removeprefix("json\n")
        text = text.strip()

        result = json.loads(text)
        score = int(result.get("score", 5))
        score = max(1, min(10, score))  # clamp between 1–10

        return {
            "success": True,
            "review": result.get("review", ""),
            "score": score
        }

    except json.JSONDecodeError:
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": "AI returned an unexpected response format."}
        )
    except Exception as e:
        err_str = str(e)
        # Detect quota / rate-limit errors and return a clean flag
        if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "quota" in err_str.lower():
            return JSONResponse(
                status_code=429,
                content={
                    "success": False,
                    "quota_exceeded": True,
                    "error": "AI review quota exceeded. Please try again later."
                }
            )
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": err_str}
        )

@app.get("/health")
async def health():
    return {"status": "ok", "service": "prasikshan-ai-service"}

# Uvicorn is the server that actually runs your app and makes it accessible in a browser.
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=5001, reload=True)
