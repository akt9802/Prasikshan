# 📄 OpenAPI / Swagger Documentation Guide — Prasikshan

> A complete walkthrough of API documentation strategy for both the **FastAPI AI Microservice** and the **Next.js Backend**, tailored to this project's exact structure.

---

## 📚 Table of Contents

1. [What is OpenAPI / Swagger?](#what-is-openapi--swagger)
2. [Why it Matters for Your Resume](#why-it-matters-for-your-resume)
3. [Part 1: FastAPI — Auto-Generated Swagger UI](#part-1-fastapi--auto-generated-swagger-ui)
   - [What You Already Have](#what-you-already-have)
   - [Enhancing the Existing Setup](#enhancing-the-existing-setup)
   - [Adding Metadata to Routers](#adding-metadata-to-routers)
   - [Adding Response Models](#adding-response-models)
   - [Accessing the Swagger UI](#accessing-the-swagger-ui)
4. [Part 2: Next.js — OpenAPI Spec with Zod + Scalar](#part-2-nextjs--openapi-spec-with-zod--scalar)
   - [The Problem with Next.js](#the-problem-with-nextjs)
   - [The Solution: zod-openapi + Scalar](#the-solution-zod-openapi--scalar)
   - [Installation](#installation)
   - [Step-by-Step Implementation](#step-by-step-implementation)
5. [Interview Talking Points](#interview-talking-points)

---

## What is OpenAPI / Swagger?

**OpenAPI** (formerly called Swagger) is an industry-standard specification format for describing REST APIs. It is a single JSON or YAML file (called the **spec**) that lists:

- Every available route (e.g., `POST /api/auth/signin`)
- What request body each route expects (with field names and types)
- What responses it returns (with all possible status codes)
- Authentication requirements

**Swagger UI** is a web interface that reads this spec file and turns it into a beautiful, interactive, click-to-test API explorer — no Postman needed.

```
Your API Code
     ↓
OpenAPI Spec (.json)
     ↓
Swagger UI / Scalar / Redoc (browser-based explorer)
```

---

## Why it Matters for Your Resume

| Without API Docs | With API Docs |
|---|---|
| "I built some API routes" | "I documented a 20+ endpoint REST API using the OpenAPI 3.1 standard" |
| "You can test it with Postman" | "It has a live Swagger UI with try-it-out functionality at `/api/docs`" |
| No standard | Industry standard used by Google, Stripe, GitHub |

When an interviewer sees your project has proper API docs, it signals:
- You think about **consumers** of your API, not just the implementation
- You know professional engineering practices
- Your project is self-documenting and maintainable
- You know backend contract design

---

## Part 1: FastAPI — Auto-Generated Swagger UI

### What You Already Have

**You already get this for free.** FastAPI generates an OpenAPI spec automatically by reading your Pydantic models. You just need to enhance it.

Your `app.py` already sets:
```python
app = FastAPI(title="Prasikshan AI Service", version="1.0.0")
```

✅ Right now, if you run the AI service, you can visit:
- `http://localhost:5001/docs` → Swagger UI
- `http://localhost:5001/redoc` → ReDoc (cleaner read-only view)
- `http://localhost:5001/openapi.json` → Raw OpenAPI spec

**The problem?** The auto-generated docs are bare bones. No descriptions, no example payloads, no proper tags. Let's fix that.

---

### Enhancing the Existing Setup

**Step 1: Update `app.py` with rich metadata**

```python
# prasikshan-ai-service/app.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routers.ppdt import router as ppdt_router
from routers.wat import router as wat_router
from routers.srt import router as srt_router
from routers.lecturette import router as lecturette_router
from routers.tat import router as tat_router
from routers.pi import router as pi_router

# Detailed metadata for the Swagger UI landing page
tags_metadata = [
    {
        "name": "PPDT",
        "description": "Picture Perception & Discussion Test — AI evaluates the candidate's story written about an image.",
    },
    {
        "name": "TAT",
        "description": "Thematic Apperception Test — AI reviews all 12 picture stories as a complete set, checking OLQs, structure, and perception accuracy.",
    },
    {
        "name": "WAT",
        "description": "Word Association Test — AI psychologically evaluates rapid word-association responses.",
    },
    {
        "name": "SRT",
        "description": "Situation Reaction Test — AI checks 60 rapid reactions for action-orientation and presence of mind.",
    },
    {
        "name": "Lecturette",
        "description": "Public Speaking Test — AI evaluates speech text for logical structure and maturity.",
    },
    {
        "name": "PI",
        "description": "Personal Interview — AI acts as an SSB Interviewing Officer to evaluate honesty, OLQs, and clarity.",
    },
    {
        "name": "Health",
        "description": "Service health check endpoint.",
    },
]

app = FastAPI(
    title="Prasikshan AI Service",
    version="2.0.0",
    description="""
## 🎯 Prasikshan AI Microservice

This service provides **AI-powered SSB test evaluation** for the Prasikshan platform.

It uses **Azure OpenAI (Grok-3)** to deliver contextual, SSB-calibrated feedback across 6 test modules.

### Authentication
All endpoints are called from the Prasikshan Next.js backend. Direct external access is restricted by CORS.

### Rate Limits
- AI endpoints are subject to Azure OpenAI quota limits.
- A `429` response with `quota_exceeded: true` means the AI model is rate-limited.

### Response Format
All endpoints return a consistent structure:
```json
{
  "success": true,
  "review": "Overall evaluation text",
  "score": 7
}
```
    """,
    openapi_tags=tags_metadata,
    contact={
        "name": "Aman Kumar",
        "url": "https://github.com/akt9802/Prasikshan",
    },
    license_info={
        "name": "MIT",
    },
)
```

---

### Adding Metadata to Routers

Each router endpoint needs a `tags`, `summary`, and a `response_model` for full documentation.

**Example: Enhancing `routers/tat.py`**

```python
# prasikshan-ai-service/routers/tat.py

from pydantic import BaseModel, Field
from typing import List, Optional

# --- Request Models (You already have these) ---
class SampleStory(BaseModel):
    title: Optional[str] = None
    narration: Optional[str] = None

class StoryEntry(BaseModel):
    pictureIndex: int = Field(..., description="0-based index of the picture (0 to 11)", example=0)
    userStory: str = Field(..., description="The candidate's written story for this picture", example="Ravi saw a flooded village and immediately organized his team...")
    sampleStories: List[SampleStory] = Field(default_factory=list, description="Admin-provided reference stories for context")
    isBlankSlide: bool = Field(False, description="True if this is the blank slide (last picture)")

class TATReviewRequest(BaseModel):
    stories: List[StoryEntry] = Field(..., description="All story entries for the TAT session (up to 12)")
    totalPictures: int = Field(12, description="Total number of pictures shown (including blank slide)")

    class Config:
        # This adds a working example JSON directly in the Swagger UI
        json_schema_extra = {
            "example": {
                "totalPictures": 12,
                "stories": [
                    {
                        "pictureIndex": 0,
                        "userStory": "Ravi, a young Army officer, noticed a bridge collapse during floods...",
                        "sampleStories": [
                            {"title": "Reference 1", "narration": "A soldier rescuing civilians..."}
                        ],
                        "isBlankSlide": False
                    }
                ]
            }
        }

# --- Response Models (ADD THESE — they are what makes Swagger truly useful) ---
class PictureReview(BaseModel):
    pictureIndex: int
    review: str

class TATReviewResponse(BaseModel):
    success: bool = Field(..., example=True)
    review: str = Field(..., description="Overall psychological TAT performance review")
    score: int = Field(..., ge=1, le=10, description="TAT score from 1 to 10", example=7)
    picture_reviews: List[PictureReview] = Field(..., description="Per-picture critique")

class ErrorResponse(BaseModel):
    success: bool = Field(False, example=False)
    error: str = Field(..., example="No stories provided")


# --- Route with full documentation ---
@router.post(
    "/api/tat-review",
    tags=["TAT"],
    summary="Evaluate a complete TAT session",
    description="""
Analyzes a candidate's complete set of TAT stories (up to 12 pictures + 1 blank slide) using Azure OpenAI.

**Evaluation Criteria:**
- 📸 Perception Accuracy (does story match the image?)
- 🦸 Hero Identification and OLQs
- 📖 Past → Present → Future story structure
- ✅ Positive/constructive endings
- 🔄 Variety across stories (no repetition)
- 🎯 Completion rate (penalised if < 9/12 attempted)
    """,
    response_model=TATReviewResponse,
    responses={
        400: {"model": ErrorResponse, "description": "No stories provided"},
        429: {"model": ErrorResponse, "description": "Azure OpenAI quota exceeded"},
        500: {"model": ErrorResponse, "description": "Internal server error or AI format error"},
    }
)
async def tat_review(payload: TATReviewRequest):
    # ... your existing implementation stays exactly the same
```

---

### Accessing the Swagger UI

Once these changes are saved and the service is running:

```bash
cd prasikshan-ai-service
python app.py
```

Open your browser:

| URL | Purpose |
|-----|---------|
| `http://localhost:5001/docs` | ✅ **Swagger UI** — Interactive, try-it-out |
| `http://localhost:5001/redoc` | 📖 **ReDoc** — Clean read-only documentation |
| `http://localhost:5001/openapi.json` | 📄 Raw OpenAPI 3.1 JSON spec |

The Swagger UI lets you:
- See all endpoints grouped by tag (PPDT, TAT, WAT, etc.)
- Expand any endpoint to see the full request schema with your example
- **Click "Try it out" → paste a real payload → Execute → See the live AI response** — all in the browser

---

## Part 2: Next.js — OpenAPI Spec with Zod + Scalar

### The Problem with Next.js

Next.js App Router does **not** auto-generate API docs the way FastAPI does. You have 20 API route folders, and nothing documents them.

The solution is to:
1. Define request/response shapes as **Zod schemas** (you should be doing this for validation anyway)
2. Use `@asteasolutions/zod-to-openapi` to convert those Zod schemas into an OpenAPI spec
3. Serve the spec at `/api/openapi.json`
4. Render a beautiful **Scalar** UI at `/api/docs` (Scalar is a modern alternative to Swagger UI, used by companies like Stripe)

### The Solution: zod-openapi + Scalar

```
Zod Schema (TypeScript)
       ↓
zod-to-openapi (converter library)
       ↓
OpenAPI 3.1 JSON Spec
       ↓
Scalar UI (served at /api/docs)
```

---

### Installation

```bash
cd prasikshan

# Core: converts Zod schemas to OpenAPI spec
npm install @asteasolutions/zod-to-openapi

# Scalar: the actual documentation UI renderer
npm install @scalar/nextjs-api-reference

# Zod (you likely already have this)
npm install zod
```

---

### Step-by-Step Implementation

#### Step 1: Create a central OpenAPI registry

Create this file at `lib/openapi.ts`:

```typescript
// prasikshan/lib/openapi.ts
import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

// This registry holds all your route definitions
export const registry = new OpenAPIRegistry();

// Call this once to generate the full spec
export function generateOpenAPISpec() {
  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Prasikshan API',
      version: '2.0.0',
      description: `
## 🎯 Prasikshan — Next.js Backend API

REST API powering the Prasikshan SSB preparation platform.

### Authentication
Most endpoints require a valid JWT Bearer token obtained from \`POST /api/auth/signin\`.

Pass it as: \`Authorization: Bearer <access_token>\`

Refresh tokens are managed via HTTP-only cookies automatically.

### Rate Limiting
Authentication endpoints (\`/signin\`, \`/signup\`) are protected by a dual-layer Redis rate limiter:
- **IP Sliding Window**: Max 10 requests/minute per IP
- **Account Lockout**: 5 failed attempts locks the account for 15 minutes
      `,
      contact: {
        name: 'Aman Kumar',
        url: 'https://github.com/akt9802/Prasikshan',
      },
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local Development' },
      { url: 'https://prasikshan.vercel.app', description: 'Production' },
    ],
  });
}
```

---

#### Step 2: Define schemas for each route

Create a schemas folder and define Zod schemas with OpenAPI metadata. Here's how to do `signin` as a template:

```typescript
// prasikshan/lib/schemas/auth.schemas.ts
import { z } from 'zod';
import { registry } from '@/lib/openapi';

// Register reusable schemas
export const SignInRequestSchema = registry.register(
  'SignInRequest',
  z.object({
    email: z.string().email().openapi({ example: 'aspirant@gmail.com' }),
    password: z.string().min(6).openapi({ example: 'SecurePass123' }),
  })
);

export const SignInResponseSchema = registry.register(
  'SignInResponse',
  z.object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: 'Sign-in successful' }),
    token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    user: z.object({
      id: z.string(),
      username: z.string().openapi({ example: 'warrior_aspirant' }),
      email: z.string().email(),
      fullName: z.string().openapi({ example: 'Aman Kumar' }),
      role: z.enum(['user', 'admin']),
      isVerified: z.boolean(),
    }),
  })
);

// Register the route itself
registry.registerPath({
  method: 'post',
  path: '/api/auth/signin',
  tags: ['Authentication'],
  summary: 'Sign in to Prasikshan',
  description: `
Authenticates a user and returns a short-lived JWT access token (15 minutes).

A long-lived refresh token (7 days) is simultaneously set as an **HTTP-only cookie** for silent session renewal.

**Rate Limited:** 10 requests/min per IP, 5 failed attempts locks the account.
  `,
  request: {
    body: {
      content: { 'application/json': { schema: SignInRequestSchema } },
    },
  },
  responses: {
    200: {
      description: 'Authentication successful',
      content: { 'application/json': { schema: SignInResponseSchema } },
    },
    400: { description: 'Missing email or password' },
    401: { description: 'Invalid password' },
    403: { description: 'Email not verified' },
    404: { description: 'User not found' },
    429: { description: 'Rate limit exceeded or account locked' },
    500: { description: 'Internal server error' },
  },
});
```

Do the same for every API group:
- `lib/schemas/auth.schemas.ts` → signin, signup, logout, refresh-token, verify-email
- `lib/schemas/questions.schemas.ts` → OIR, WAT, SRT, TAT, PPDT, Lecturette, PI
- `lib/schemas/ranking.schemas.ts` → ranking endpoints
- `lib/schemas/user.schemas.ts` → user profile endpoints
- `lib/schemas/admin.schemas.ts` → admin panel endpoints

---

#### Step 3: Create the spec endpoint

```typescript
// prasikshan/app/api/openapi.json/route.ts
import { generateOpenAPISpec } from '@/lib/openapi';

// Import all schema files so their registry.registerPath() calls run
import '@/lib/schemas/auth.schemas';
import '@/lib/schemas/questions.schemas';
import '@/lib/schemas/ranking.schemas';
import '@/lib/schemas/user.schemas';
import '@/lib/schemas/admin.schemas';

export async function GET() {
  const spec = generateOpenAPISpec();
  return new Response(JSON.stringify(spec), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

---

#### Step 4: Create the Scalar documentation UI page

```typescript
// prasikshan/app/api/docs/route.ts
import { ApiReference } from '@scalar/nextjs-api-reference';

const handler = ApiReference({
  spec: {
    url: '/api/openapi.json',  // Points to your spec endpoint
  },
  theme: 'purple',             // Matches Prasikshan's color scheme
  defaultHttpClient: {
    targetKey: 'javascript',
    clientKey: 'fetch',
  },
  customCss: `
    .darklight-reference { display: none; }
  `,
});

export { handler as GET };
```

---

#### Step 5: Link docs in your admin panel (optional but impressive)

Add a link to the internal docs in your Admin Dashboard:

```tsx
// Inside your admin panel nav
<a href="/api/docs" target="_blank" className="...">
  📄 API Documentation
</a>
```

---

### What it looks like in the browser

After completing the above steps:

```
http://localhost:3000/api/docs         → Scalar UI (beautiful, interactive)
http://localhost:3000/api/openapi.json → Raw OpenAPI 3.1 JSON spec
http://localhost:5001/docs             → FastAPI Swagger UI
http://localhost:5001/redoc            → FastAPI ReDoc
http://localhost:5001/openapi.json     → FastAPI raw spec
```

The Scalar UI at `/api/docs` lets anyone:
- Browse all 20+ API endpoints grouped by tag
- See exact request shapes with type validation rules
- See all possible response codes and their schemas
- Click **"Try"** to make live API calls directly from the browser

---

## Interview Talking Points

When an interviewer asks *"Tell me about your Prasikshan project"*, you can now say:

> *"Both services are fully documented using OpenAPI 3.1. The FastAPI AI microservice uses FastAPI's native Pydantic-to-spec generation with custom response models and per-endpoint error schemas. For the Next.js backend — which doesn't have auto-generation — I built a schema registry using `zod-to-openapi`, defining Zod schemas that serve dual purpose: runtime validation and documentation generation. The complete spec is served at `/api/openapi.json` and rendered by Scalar UI at `/api/docs`. This means any developer can onboard and test the API without ever opening Postman."*

**Follow-up questions they might ask and how to answer them:**

| Question | Answer |
|---|---|
| "Why Scalar over Swagger UI?" | "Scalar is more modern, has better dark mode support, supports multi-language code generation, and is used by companies like Speakeasy and Fern." |
| "Why not just use Postman collections?" | "OpenAPI is the industry standard — it's machine-readable, version-controllable, and can generate client SDKs automatically. Postman is just a GUI." |
| "How do you keep docs in sync with code?" | "Because the spec is generated from the same Zod schemas used for runtime validation, they cannot go out of sync — changing the schema updates both validation and docs automatically." |
| "What's OpenAPI 3.1 vs 3.0?" | "3.1 aligns fully with JSON Schema, fixing inconsistencies in nullable types and bringing better tooling support." |

---

## Summary

| Service | Tool | URL | Effort |
|---|---|---|---|
| FastAPI AI Microservice | Native FastAPI + enhanced Pydantic | `localhost:5001/docs` | ~2 hours |
| Next.js Backend | `zod-to-openapi` + Scalar | `localhost:3000/api/docs` | ~1 day |

> **Start with the FastAPI side** — it's mostly free. The metadata enhancements (tags, descriptions, response models, examples) take about 2 hours across 6 router files. It will immediately look professional.
>
> Then tackle the Next.js side over a weekend. Define schemas from the most important routes first: `auth`, `ranking`, and one test module (e.g., `tat-review`). That alone covers 80% of the value.
