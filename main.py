import os
import time
from collections import defaultdict, deque

from fastapi import FastAPI, Header, HTTPException, Request
from pydantic import BaseModel, Field
from agents.orchestrator import handle_query
from data.database import get_report_summary, init_db
from dotenv import load_dotenv
import uvicorn

load_dotenv()

app = FastAPI(title="IPL Influence Engine API", version="1.0.0")
RATE_LIMIT_WINDOW_SECONDS = 60
RATE_LIMIT_MAX_REQUESTS = 30
request_log = defaultdict(deque)

class QueryRequest(BaseModel):
    query: str = Field(min_length=1, max_length=500)


class ChatResponse(BaseModel):
    success: bool
    data: dict


@app.on_event("startup")
def startup() -> None:
    init_db()


def enforce_rate_limit(client_id: str) -> None:
    now = time.time()
    entries = request_log[client_id]
    while entries and now - entries[0] > RATE_LIMIT_WINDOW_SECONDS:
        entries.popleft()
    if len(entries) >= RATE_LIMIT_MAX_REQUESTS:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
    entries.append(now)


def enforce_api_key(x_api_key: str | None) -> None:
    expected = os.getenv("API_KEY")
    if expected and x_api_key != expected:
        raise HTTPException(status_code=401, detail="Invalid API key")


@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(req: QueryRequest, request: Request, x_api_key: str | None = Header(default=None)):
    enforce_api_key(x_api_key)
    enforce_rate_limit(request.client.host if request.client else "unknown")

    try:
        result = handle_query(req.query)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Unable to process query") from e

@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/reports/summary")
def report_summary(request: Request, x_api_key: str | None = Header(default=None)):
    enforce_api_key(x_api_key)
    enforce_rate_limit(request.client.host if request.client else "unknown")
    return {"success": True, "data": get_report_summary()}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
