import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

# Import our modular routers
from routers.ppdt import router as ppdt_router
from routers.wat import router as wat_router
from routers.srt import router as srt_router
from routers.lecturette import router as lecturette_router
from routers.tat import router as tat_router

app = FastAPI(title="Prasikshan AI Service", version="1.0.0")

# Setup CORS equivalent to Flask-CORS defaults
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers here
app.include_router(ppdt_router)
app.include_router(wat_router)
app.include_router(srt_router)
app.include_router(lecturette_router)
app.include_router(tat_router)

@app.get("/health")
async def health():
    return {"status": "ok", "service": "prasikshan-ai-service"}

# Uvicorn is the server that actually runs your app and makes it accessible in a browser.
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=5001, reload=True)
