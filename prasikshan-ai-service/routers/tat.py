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

class SampleStory(BaseModel):
    title: Optional[str] = None
    narration: Optional[str] = None

class StoryEntry(BaseModel):
    pictureIndex: int
    userStory: str
    sampleStories: List[SampleStory] = Field(default_factory=list)
    isBlankSlide: bool = False

class TATReviewRequest(BaseModel):
    stories: List[StoryEntry]
    totalPictures: int = 12

@router.post("/api/tat-review")
async def tat_review(payload: TATReviewRequest):
    try:
        stories = payload.stories
        total_pictures = payload.totalPictures
        attempted_count = len([s for s in stories if s.userStory.strip()])

        if attempted_count == 0:
            return JSONResponse(status_code=400, content={"success": False, "error": "No stories provided"})

        # Build the prompt content
        stories_text = ""
        for entry in stories:
            pic_label = "BLANK SLIDE (Most Important)" if entry.isBlankSlide else f"Picture {entry.pictureIndex + 1}"
            stories_text += f"\n{'='*60}\n{pic_label}\n"

            if entry.sampleStories:
                stories_text += "Sample Reference Stories:\n"
                for i, s in enumerate(entry.sampleStories, 1):
                    title = s.title or f"Sample {i}"
                    narration = s.narration or ""
                    stories_text += f"  [{i}] {title}: {narration}\n"

            stories_text += f"\nCandidate's Story:\n{entry.userStory.strip() if entry.userStory.strip() else '[No story written]'}\n"

        prompt = f"""You are an expert SSB (Services Selection Board) TAT (Thematic Apperception Test) psychologist and evaluator.

A candidate was shown {total_pictures} pictures (including 1 blank slide) in a TAT session.
They wrote stories for {attempted_count} out of {total_pictures} pictures.
Not attempting pictures is a significant negative — it shows lack of creativity and ideas.

Here are all the picture-story pairs with sample reference stories for context:
{stories_text}

TAT EVALUATION CRITERIA:
1. Perception Accuracy: Does the story relate to the picture? (Use sample stories as reference for what the picture depicts)
2. Hero Identification: Is there a clear main character? Does the hero reflect good officer-like qualities?
3. Story Structure: Does it follow Past → Present → Future / Outcome?
4. Positivity: Does it end constructively? (No tragic/negative/hopeless endings)
5. Officer-Like Qualities (OLQs): Leadership, courage, initiative, responsibility, problem-solving?
6. Realism: Believable situations, not superhuman or fantasy
7. Variety: Are the stories varied, or does the candidate repeat the same theme/pattern?
8. Blank Slide: For the blank slide, does the story reveal positive personality, values, and ambitions?
9. Completion Rate: Penalise heavily if fewer than 9/12 stories are attempted.

CRITICAL RULES:
- If a story is completely unrelated to what the sample stories suggest the picture depicts → flag as perception error
- Negative/tragic endings (failure, death, hopelessness) → heavily penalise that story
- Same story pattern repeated across pictures → flag repetition
- Blank slide story → must show the candidate's real values and ambitions

Provide:
- An overall psychological review (4-6 sentences) covering themes, OLQs demonstrated, and patterns noticed.
- An OVERALL score from 1 to 10 for the entire TAT performance.
- A brief 1-sentence critique for EACH picture's story (note: flag perception errors, negative endings, or missing stories).

Respond ONLY with valid JSON in this exact format, no extra text:
{{
  "review": "Your overall psychological review here...",
  "score": 7,
  "picture_reviews": [
    {{
      "pictureIndex": 0,
      "review": "1-sentence critique of the story for this picture."
    }}
  ]
}}"""

        completion = client.chat.completions.create(
            model="grok-3",
            messages=[{"role": "user", "content": prompt}],
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
            "picture_reviews": result.get("picture_reviews", [])
        }

    except json.JSONDecodeError:
        return JSONResponse(status_code=500, content={"success": False, "error": "AI returned an unexpected response format."})
    except Exception as e:
        err_str = str(e)
        if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "quota" in err_str.lower():
            return JSONResponse(status_code=429, content={"success": False, "quota_exceeded": True, "error": "AI review quota exceeded. Please try again later."})
        return JSONResponse(status_code=500, content={"success": False, "error": err_str})
