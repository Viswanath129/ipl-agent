from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from agents.orchestrator import handle_query
from dotenv import load_dotenv
import uvicorn

load_dotenv()

app = FastAPI(title="IPL Influence Engine API", version="1.0.0")

class QueryRequest(BaseModel):
    query: str

@app.post("/api/chat")
async def chat_endpoint(req: QueryRequest):
    if not req.query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    try:
        result = handle_query(req.query)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
