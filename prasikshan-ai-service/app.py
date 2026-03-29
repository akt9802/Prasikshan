import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from google import genai

app = Flask(__name__)
CORS(app)

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))


@app.route("/api/ppdt-review", methods=["POST"])
def ppdt_review():
    try:
        data = request.get_json()
        story = data.get("story", "")
        sample_stories = data.get("sampleStories", [])  # list of { title, narration }

        if not story or not story.strip():
            return jsonify({"success": False, "error": "Story is empty"}), 400

        # Format sample stories into readable text for context
        sample_stories_text = ""
        if sample_stories:
            sample_stories_text = "\n\nHere are the IDEAL sample stories for this image (use these to understand the scene and evaluate the candidate's story):\n"
            for i, s in enumerate(sample_stories, start=1):
                title = s.get("title", f"Sample {i}")
                narration = s.get("narration", "")
                sample_stories_text += f"\n[Sample {i}] {title}\n{narration}\n"

        prompt = f"""You are an expert SSB (Services Selection Board) PPDT evaluator.

A candidate was shown a hazy image and had 4 minutes to write a story about it.
{sample_stories_text}

The CANDIDATE'S story is:
---
{story}
---

Compare the candidate's story with the sample stories and evaluate it based on these SSB PPDT criteria:
1. Perception accuracy (does the story match the theme and scene of the image?)
2. Characters & roles (are characters clearly identified with roles?)
3. Theme (is the central theme strong and officer-like?)
4. Narrative structure (past → present → future resolution)
5. Positive outcome (does the story end positively with initiative?)
6. Language & clarity (is the writing clear and concise?)

Provide:
- A brief, constructive review (3-5 sentences, specific to their story, comparing with the ideal)
- A score from 1 to 10

Respond ONLY with valid JSON in this exact format, no extra text:
{{
  "review": "Your detailed review here...",
  "score": 7
}}"""

        response = client.models.generate_content(
            model="gemini-2.0-flash-lite",
            contents=[prompt],
        )

        text = response.text.strip()

        # Strip markdown code fences if present
        if text.startswith("```"):
            parts = text.split("```")
            text = parts[1] if len(parts) >= 2 else text
            if text.startswith("json"):
                text = text[4:]
        text = text.strip()

        result = json.loads(text)
        score = int(result.get("score", 5))
        score = max(1, min(10, score))  # clamp between 1–10

        return jsonify({
            "success": True,
            "review": result["review"],
            "score": score
        })

    except json.JSONDecodeError:
        return jsonify({"success": False, "error": "AI returned an unexpected response format."}), 500
    except Exception as e:
        err_str = str(e)
        # Detect quota / rate-limit errors and return a clean flag
        if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "quota" in err_str.lower():
            return jsonify({
                "success": False,
                "quota_exceeded": True,
                "error": "AI review quota exceeded. Please try again later."
            }), 429
        return jsonify({"success": False, "error": err_str}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "prasikshan-ai-service"})


if __name__ == "__main__":
    app.run(port=5001, debug=True)
