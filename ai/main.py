import io
import os
import base64
import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from aura_pipeline import run_pipeline

app = FastAPI(title="Aura Detection API", version="1.0.0")

# Allow Next.js dev and prod origins
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/aura/process")
async def process(file: UploadFile = File(...)):
    try:
        # Validate content type
        if file.content_type and not file.content_type.startswith("image/"):
            return JSONResponse(
                {"error": f"Expected image, got {file.content_type}"},
                status_code=400
            )

        image_bytes = await file.read()
        if len(image_bytes) == 0:
            return JSONResponse({"error": "Empty file"}, status_code=400)

        print(f"[API] Processing image: {file.filename} ({len(image_bytes)} bytes)")

        result = run_pipeline(image_bytes)

        image_b64 = base64.b64encode(result["image_bytes"]).decode("utf-8")

        print(f"[API] Done — emotion={result['emotion']} confidence={result['confidence']:.2f} chakra={result['chakra']}")

        return JSONResponse({
            "emotion":    result["emotion"],
            "confidence": result["confidence"],
            "chakra":     result["chakra"],
            "hex":        result["hex"],
            "image":      image_b64,
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse({"error": str(e)}, status_code=500)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)