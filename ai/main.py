# ai/main.py
import base64
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pipeline import run_pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js port
    allow_methods=["POST"],
    allow_headers=["*"],
)

@app.post("/api/aura/process")
async def process(file: UploadFile = File(...)):
    image_bytes = await file.read()
    result = run_pipeline(image_bytes)
    return JSONResponse({
        "emotion":    result["emotion"],
        "confidence": result["confidence"],
        "chakra":     result["chakra"],
        "hex":        result["hex"],
        "image":      base64.b64encode(result["image_bytes"]).decode()
    })