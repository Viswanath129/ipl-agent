"""
Simple query cache to reduce Gemini API costs.
Caches responses in SQLite for 1 hour to avoid redundant AI calls.
"""

import hashlib
import json
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from data.database import get_session
from sqlalchemy import Column, DateTime, String, Text
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class QueryCache(Base):
    __tablename__ = "query_cache"

    query_hash = Column(String(64), primary_key=True)
    query_text = Column(Text, nullable=False)
    response_json = Column(Text, nullable=False)
    route = Column(String(40), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)


def init_cache() -> None:
    """Create cache table if not exists."""
    from data.database import engine
    Base.metadata.create_all(bind=engine, tables=[QueryCache.__table__])


def _hash_query(query: str, route: str) -> str:
    """Create hash of query + route for cache key."""
    return hashlib.sha256(f"{route}:{query.lower().strip()}".encode()).hexdigest()


def get_cached_response(query: str, route: str, ttl_minutes: int = 60) -> Optional[dict]:
    """
    Get cached response if exists and not expired.
    Default TTL: 60 minutes (reduces API costs significantly)
    """
    try:
        query_hash = _hash_query(query, route)
        cutoff = datetime.now(timezone.utc) - timedelta(minutes=ttl_minutes)

        with get_session() as session:
            cached = session.query(QueryCache).filter(
                QueryCache.query_hash == query_hash,
                QueryCache.created_at > cutoff
            ).first()

            if cached:
                return json.loads(cached.response_json)
    except Exception:
        pass

    return None


def cache_response(query: str, route: str, response: dict) -> None:
    """Store response in cache."""
    try:
        query_hash = _hash_query(query, route)

        with get_session() as session:
            # Delete old cache entry if exists
            session.query(QueryCache).filter(QueryCache.query_hash == query_hash).delete()

            # Create new cache entry
            cached = QueryCache(
                query_hash=query_hash,
                query_text=query[:500],  # Store truncated query for debugging
                response_json=json.dumps(response),
                route=route
            )
            session.add(cached)
    except Exception:
        pass


def get_cache_stats() -> dict:
    """Get cache statistics for monitoring."""
    try:
        with get_session() as session:
            total = session.query(QueryCache).count()
            one_hour = datetime.now(timezone.utc) - timedelta(hours=1)
            recent = session.query(QueryCache).filter(QueryCache.created_at > one_hour).count()

            return {
                "total_cached": total,
                "cached_last_hour": recent,
                "hit_rate_estimate": "N/A"  # Would need request tracking
            }
    except Exception:
        return {"total_cached": 0, "cached_last_hour": 0}


def clear_old_cache(max_age_hours: int = 24) -> int:
    """Clear cache entries older than max_age_hours."""
    try:
        cutoff = datetime.now(timezone.utc) - timedelta(hours=max_age_hours)

        with get_session() as session:
            deleted = session.query(QueryCache).filter(QueryCache.created_at < cutoff).delete()
            return deleted
    except Exception:
        return 0
