import os
import time
from collections import defaultdict, deque
from contextlib import asynccontextmanager

from fastapi import Body, FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from agents.orchestrator import handle_query
from data.database import get_report_summary, init_db
from utils.cache import init_cache
from dotenv import load_dotenv
import uvicorn
from services.debate_engine import debate_history, judge_debate, vote_debate
from services.sponsor_roi import compare_sponsors, estimate_sponsor_roi, export_sponsor_report, known_brands

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    init_cache()
    yield

app = FastAPI(title="IPL Influence Engine API", version="1.0.0", lifespan=lifespan)

allowed_origins = [
    origin.strip() 
    for origin in os.getenv("CORS_ORIGINS", "https://gdgbzw.web.app,http://localhost:5173").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Endpoints
class QueryRequest(BaseModel):
    query: str = Field(min_length=1, max_length=500)

class ChatResponse(BaseModel):
    success: bool
    data: dict

class SponsorROIRequest(BaseModel):
    brand: str = Field(min_length=1, max_length=80)
    match: str = Field(default="Overall", max_length=80)
    spend_lakh: float | None = Field(default=None, gt=0, le=100000)

class SponsorCompareRequest(BaseModel):
    brands: list[str] | None = None
    match: str = Field(default="Overall", max_length=80)

class DebateRequest(BaseModel):
    topic: str = Field(min_length=3, max_length=240)

class VoteRequest(BaseModel):
    debate_id: str = Field(min_length=3, max_length=80)
    side: str = Field(min_length=1, max_length=80)

RATE_LIMIT_WINDOW_SECONDS = 60
RATE_LIMIT_MAX_REQUESTS = 30
request_log = defaultdict(deque)

def enforce_rate_limit(client_id: str) -> None:
    now = time.time()
    entries = request_log[client_id]
    while entries and now - entries[0] > RATE_LIMIT_WINDOW_SECONDS:
        entries.popleft()
    if len(entries) >= RATE_LIMIT_MAX_REQUESTS:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    entries.append(now)

def enforce_api_key(x_api_key: str | None) -> None:
    return None

@app.get("/")
def root():
    return {"status": "IPL Agent Running", "service": "ok"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/chat")
def chat(payload: dict | None = Body(default=None)):
    query = payload.get("query") if payload else None
    if not query:
        return {"response": "working"}
    try:
        req = QueryRequest(query=query)
        return {"response": handle_query(req.query)}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unable to process query") from e


@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(req: QueryRequest, request: Request, x_api_key: str | None = Header(default=None)):
    enforce_api_key(x_api_key)
    enforce_rate_limit(request.client.host if request.client else "unknown")
    try:
        result = handle_query(req.query)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unable to process query") from e

@app.get("/api/reports/summary")
def report_summary(request: Request, x_api_key: str | None = Header(default=None)):
    enforce_api_key(x_api_key)
    enforce_rate_limit(request.client.host if request.client else "unknown")
    return {"success": True, "data": get_report_summary()}

@app.get("/api/sponsors/brands")
def sponsor_brands(request: Request, x_api_key: str | None = Header(default=None)):
    enforce_api_key(x_api_key)
    enforce_rate_limit(request.client.host if request.client else "unknown")
    return {"success": True, "data": {"brands": known_brands()}}

@app.post("/api/sponsors/roi")
def sponsor_roi(req: SponsorROIRequest, request: Request, x_api_key: str | None = Header(default=None)):
    enforce_api_key(x_api_key)
    enforce_rate_limit(request.client.host if request.client else "unknown")
    return {"success": True, "data": estimate_sponsor_roi(req.brand, req.match, req.spend_lakh)}

@app.post("/api/sponsors/compare")
def sponsor_compare(req: SponsorCompareRequest, request: Request, x_api_key: str | None = Header(default=None)):
    enforce_api_key(x_api_key)
    enforce_rate_limit(request.client.host if request.client else "unknown")
    return {"success": True, "data": compare_sponsors(req.brands, req.match)}

@app.post("/api/reports/sponsor")
def sponsor_report(req: SponsorROIRequest, request: Request, x_api_key: str | None = Header(default=None)):
    enforce_api_key(x_api_key)
    enforce_rate_limit(request.client.host if request.client else "unknown")
    return {"success": True, "data": export_sponsor_report(req.brand, req.match)}

@app.post("/api/debates")
def create_debate(req: DebateRequest, request: Request, x_api_key: str | None = Header(default=None)):
    enforce_api_key(x_api_key)
    enforce_rate_limit(request.client.host if request.client else "unknown")
    from agents.module_b_debate import run_debate_agent
    return {"success": True, "data": run_debate_agent(req.topic)}

@app.get("/api/debates/history")
def get_debate_history(request: Request, x_api_key: str | None = Header(default=None)):
    enforce_api_key(x_api_key)
    enforce_rate_limit(request.client.host if request.client else "unknown")
    return {"success": True, "data": {"history": debate_history()}}

@app.post("/api/debates/vote")
def debate_vote(req: VoteRequest, request: Request, x_api_key: str | None = Header(default=None)):
    enforce_api_key(x_api_key)
    enforce_rate_limit(request.client.host if request.client else "unknown")
    return {"success": True, "data": vote_debate(req.debate_id, req.side)}

@app.get("/api/cache/stats")
def cache_stats(request: Request, x_api_key: str | None = Header(default=None)):
    enforce_api_key(x_api_key)
    from utils.cache import get_cache_stats
    return {"success": True, "data": get_cache_stats()}

if os.path.exists("./static"):
    app.mount("/assets", StaticFiles(directory="./static/assets"), name="assets")

@app.get("/{path_name:path}")
async def serve_spa(request: Request, path_name: str = ""):
    """Serve the React SPA for all non-API routes."""
    # If the path starts with api/ or is a specific endpoint, don't serve SPA
    if path_name.startswith("api/") or path_name == "health" or path_name == "docs" or path_name == "openapi.json":
        raise HTTPException(status_code=404, detail="Not Found")
        
    # Try to serve static file first
    static_file = os.path.join("./static", path_name)
    if os.path.exists(static_file) and os.path.isfile(static_file):
        return FileResponse(static_file)
    
    # For SPA routing, serve index.html for non-existent files that don't have extensions
    if "." not in path_name:
        index_path = os.path.join("./static", "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
    
    raise HTTPException(status_code=404, detail="Not Found")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
