import os
from contextlib import contextmanager
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text, create_engine
from sqlalchemy.orm import declarative_base, relationship, sessionmaker


DATABASE_URL = os.getenv("DB_URL", "sqlite:///./ipl_data.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True)
    name = Column(String(80), unique=True, index=True, nullable=False)
    category = Column(String(80), nullable=False, default="Unknown")

    metrics = relationship("SponsorMetric", back_populates="brand")


class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True)
    name = Column(String(120), unique=True, index=True, nullable=False)
    season = Column(Integer, index=True, nullable=False)
    team_a = Column(String(40), nullable=False)
    team_b = Column(String(40), nullable=False)


class SponsorMetric(Base):
    __tablename__ = "sponsor_metrics"

    id = Column(Integer, primary_key=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), index=True, nullable=False)
    match_id = Column(Integer, ForeignKey("matches.id"), index=True, nullable=True)
    visibility_score = Column(Float, nullable=False)
    social_mentions = Column(Integer, nullable=False)
    sentiment = Column(String(40), nullable=False)
    estimated_roi_pct = Column(Float, nullable=False)
    best_player_association = Column(String(80), nullable=False)
    best_content_channel = Column(String(80), nullable=False)
    recommendation = Column(Text, nullable=False)

    brand = relationship("Brand", back_populates="metrics")
    match = relationship("Match")


class Debate(Base):
    __tablename__ = "debates"

    id = Column(Integer, primary_key=True)
    debate_uuid = Column(String(80), unique=True, index=True, nullable=False)
    topic = Column(String(200), index=True, nullable=False)
    neutral_verdict = Column(Text, nullable=False)
    confidence = Column(Float, nullable=False)
    fan_bias_detected = Column(String(80), nullable=False)
    votes_side_a = Column(Integer, default=0)
    votes_side_b = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)


class QueryLog(Base):
    __tablename__ = "queries"

    id = Column(Integer, primary_key=True)
    query = Column(Text, nullable=False)
    route = Column(String(40), index=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)


@contextmanager
def get_session():
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    with get_session() as session:
        if session.query(Brand).count():
            return

        brands_list = ["Dream11", "CEAT", "Puma", "Tata", "Jio", "Qatar Airways"]
        brands = {name: Brand(name=name, category="Sponsor") for name in brands_list}
        session.add_all(brands.values())
        session.flush()

        match = Match(name="MI vs CSK", season=2025, team_a="MI", team_b="CSK")
        session.add(match)
        session.flush()

        session.add_all(
            [
                SponsorMetric(
                    brand_id=brands["Dream11"].id,
                    match_id=match.id,
                    visibility_score=92,
                    social_mentions=140000,
                    sentiment="positive",
                    estimated_roi_pct=312,
                    best_player_association="Rohit Sharma",
                    best_content_channel="Instagram reels",
                    recommendation="Increase spend in death overs branding",
                ),
                SponsorMetric(
                    brand_id=brands["CEAT"].id,
                    match_id=match.id,
                    visibility_score=85,
                    social_mentions=95000,
                    sentiment="positive",
                    estimated_roi_pct=250,
                    best_player_association="Shreyas Iyer",
                    best_content_channel="Twitter threads",
                    recommendation="Focus on strategic timeouts",
                ),
                SponsorMetric(
                    brand_id=brands["Puma"].id,
                    match_id=match.id,
                    visibility_score=98,
                    social_mentions=250000,
                    sentiment="very positive",
                    estimated_roi_pct=450,
                    best_player_association="Virat Kohli",
                    best_content_channel="YouTube Shorts",
                    recommendation="Double down on Kohli behind-the-scenes",
                ),
            ]
        )


def log_query(query: str, route: str) -> None:
    with get_session() as session:
        session.add(QueryLog(query=query, route=route))


def save_debate(debate_uuid: str, topic: str, verdict: str, confidence: float, bias: str) -> None:
    with get_session() as session:
        session.add(Debate(
            debate_uuid=debate_uuid,
            topic=topic,
            neutral_verdict=verdict,
            confidence=confidence,
            fan_bias_detected=bias
        ))


def update_vote(debate_uuid: str, side: str, side_a_name: str) -> dict:
    with get_session() as session:
        debate = session.query(Debate).filter_by(debate_uuid=debate_uuid).first()
        if not debate:
            return {}
        if side == side_a_name:
            debate.votes_side_a += 1
        else:
            debate.votes_side_b += 1
        return {
            "votes": {side_a_name: debate.votes_side_a, "Other": debate.votes_side_b},
            "total_votes": debate.votes_side_a + debate.votes_side_b
        }


def get_report_summary() -> dict:
    from services.sponsor_roi import compare_sponsors

    with get_session() as session:
        queries = session.query(QueryLog).order_by(QueryLog.created_at.desc()).limit(10).all()
        sponsor_rows = compare_sponsors()["brands"]
        return {
            "sponsor_metrics": sponsor_rows,
            "recent_queries": [
                {
                    "query": query.query,
                    "route": query.route,
                    "created_at": query.created_at.isoformat(),
                }
                for query in queries
            ],
        }
