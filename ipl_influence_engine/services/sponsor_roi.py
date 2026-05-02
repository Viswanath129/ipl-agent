from __future__ import annotations

from dataclasses import dataclass
from statistics import mean


PLACEMENT_WEIGHTS = {
    "front_jersey": 1.35,
    "helmet": 1.1,
    "sleeve": 0.85,
    "boundary_board": 0.7,
    "bat": 1.0,
}


@dataclass(frozen=True)
class LogoDetection:
    brand: str
    match: str
    team: str
    player: str
    placement: str
    seconds_visible: float
    screen_share_pct: float
    clarity: float
    broadcast_reach_million: float


@dataclass(frozen=True)
class SocialMention:
    brand: str
    platform: str
    player: str
    mentions: int
    impressions: int
    engagements: int
    sentiment_score: float
    meme_format: bool


LOGO_DETECTIONS = [
    LogoDetection("Dream11", "MI vs CSK", "MI", "Rohit Sharma", "front_jersey", 318, 2.8, 0.91, 42),
    LogoDetection("Dream11", "MI vs CSK", "MI", "Hardik Pandya", "front_jersey", 244, 2.4, 0.82, 42),
    LogoDetection("Dream11", "RCB vs KKR", "RCB", "Virat Kohli", "boundary_board", 190, 1.2, 0.78, 35),
    LogoDetection("CEAT", "MI vs CSK", "CSK", "MS Dhoni", "bat", 176, 1.6, 0.88, 42),
    LogoDetection("CEAT", "RCB vs KKR", "KKR", "Shreyas Iyer", "bat", 232, 1.9, 0.86, 35),
    LogoDetection("Puma", "MI vs CSK", "MI", "Rohit Sharma", "sleeve", 210, 1.0, 0.79, 42),
    LogoDetection("Puma", "RCB vs KKR", "RCB", "Virat Kohli", "front_jersey", 402, 3.1, 0.94, 35),
    LogoDetection("Tata", "MI vs CSK", "MI", "Overall", "boundary_board", 520, 1.5, 0.90, 42),
    LogoDetection("Jio", "MI vs CSK", "MI", "Hardik Pandya", "helmet", 180, 0.8, 0.85, 42),
    LogoDetection("Qatar Airways", "RCB vs KKR", "RCB", "Virat Kohli", "front_jersey", 410, 3.2, 0.95, 35),
]

SOCIAL_MENTIONS = [
    SocialMention("Dream11", "Instagram", "Rohit Sharma", 52000, 7900000, 610000, 0.64, True),
    SocialMention("Dream11", "X", "Rohit Sharma", 38000, 4100000, 260000, 0.38, True),
    SocialMention("Dream11", "YouTube", "Hardik Pandya", 19000, 2400000, 128000, 0.12, False),
    SocialMention("CEAT", "Instagram", "MS Dhoni", 28000, 3600000, 390000, 0.72, True),
    SocialMention("CEAT", "X", "Shreyas Iyer", 17000, 1400000, 84000, 0.31, False),
    SocialMention("Puma", "Instagram", "Virat Kohli", 91000, 14200000, 1220000, 0.81, True),
    SocialMention("Puma", "YouTube", "Virat Kohli", 46000, 8800000, 530000, 0.76, True),
    SocialMention("Tata", "X", "Overall", 120000, 15000000, 450000, 0.45, False),
    SocialMention("Jio", "Instagram", "Hardik Pandya", 45000, 6000000, 520000, 0.25, True),
    SocialMention("Qatar Airways", "Instagram", "Virat Kohli", 75000, 12000000, 980000, 0.78, True),
]

# Matchday-equivalent media spend assumptions, not full-season sponsorship fees.
SPONSOR_SPEND_LAKH = {"Dream11": 18, "CEAT": 8, "Puma": 25, "Tata": 45, "Jio": 30, "Qatar Airways": 50}
CPM_INR_BY_CHANNEL = {"broadcast": 180, "Instagram": 95, "X": 55, "YouTube": 80}


def _norm(text: str) -> str:
    return text.strip().lower()


def known_brands() -> list[str]:
    return sorted({row.brand for row in LOGO_DETECTIONS} | {row.brand for row in SOCIAL_MENTIONS})


def _logo_score(row: LogoDetection) -> float:
    placement_weight = PLACEMENT_WEIGHTS.get(row.placement, 1.0)
    return row.seconds_visible * row.screen_share_pct * row.clarity * placement_weight


def _brand_logo_rows(brand: str, match: str | None) -> list[LogoDetection]:
    brand_key = _norm(brand)
    rows = [row for row in LOGO_DETECTIONS if _norm(row.brand) == brand_key]
    if match and _norm(match) not in {"overall", "all"}:
        scoped = [row for row in rows if _norm(row.match) == _norm(match)]
        return scoped or rows
    return rows


def _brand_social_rows(brand: str) -> list[SocialMention]:
    brand_key = _norm(brand)
    return [row for row in SOCIAL_MENTIONS if _norm(row.brand) == brand_key]


def build_logo_detection_pipeline(brand: str, match: str | None = None) -> dict:
    rows = _brand_logo_rows(brand, match)
    total_raw = sum(_logo_score(row) for row in rows)
    max_reference = 1800
    visibility_score = min(100, round((total_raw / max_reference) * 100, 2))
    return {
        "pipeline_status": "simulation_ready_pluggable_cv",
        "data_provenance": "Simulated detections shaped like CV output. Replace LOGO_DETECTIONS with YOLO/OCR/frame sampler results for live use.",
        "brand": brand,
        "match_scope": match or "Overall",
        "detections": [
            {
                "match": row.match,
                "team": row.team,
                "player": row.player,
                "placement": row.placement,
                "seconds_visible": row.seconds_visible,
                "screen_share_pct": row.screen_share_pct,
                "clarity": row.clarity,
                "weighted_exposure": round(_logo_score(row), 2),
            }
            for row in rows
        ],
        "visibility_score": visibility_score,
        "total_weighted_exposure": round(total_raw, 2),
    }


def build_social_mention_pipeline(brand: str) -> dict:
    rows = _brand_social_rows(brand)
    mentions = sum(row.mentions for row in rows)
    impressions = sum(row.impressions for row in rows)
    engagements = sum(row.engagements for row in rows)
    sentiment = mean([row.sentiment_score for row in rows]) if rows else 0
    meme_impressions = sum(row.impressions for row in rows if row.meme_format)
    return {
        "pipeline_status": "simulation_ready_pluggable_social",
        "data_provenance": "Simulated social aggregates. Connect X, YouTube, Instagram, news, and meme page APIs for live ingestion.",
        "brand": brand,
        "total_mentions": mentions,
        "total_impressions": impressions,
        "total_engagements": engagements,
        "engagement_rate_pct": round((engagements / impressions) * 100, 2) if impressions else 0,
        "sentiment_score": round(sentiment, 2),
        "sentiment_label": "positive" if sentiment >= 0.35 else "neutral" if sentiment >= -0.15 else "negative",
        "meme_impressions": meme_impressions,
        "platform_breakdown": [
            {
                "platform": row.platform,
                "player": row.player,
                "mentions": row.mentions,
                "impressions": row.impressions,
                "engagements": row.engagements,
                "sentiment_score": row.sentiment_score,
                "meme_format": row.meme_format,
            }
            for row in rows
        ],
    }


def estimate_sponsor_roi(brand: str, match: str | None = None, spend_lakh: float | None = None) -> dict:
    canonical = next((item for item in known_brands() if _norm(item) == _norm(brand)), brand.strip() or "Dream11")
    logo = build_logo_detection_pipeline(canonical, match)
    social = build_social_mention_pipeline(canonical)
    logo_rows = _brand_logo_rows(canonical, match)
    spend = spend_lakh if spend_lakh is not None else SPONSOR_SPEND_LAKH.get(canonical, 100)

    broadcast_value_lakh = sum(
        (row.broadcast_reach_million * 1_000_000 / 1000) * CPM_INR_BY_CHANNEL["broadcast"] / 100000
        * (row.screen_share_pct / 100)
        * row.clarity
        * PLACEMENT_WEIGHTS.get(row.placement, 1)
        for row in logo_rows
    )
    social_value_lakh = sum(
        (row.impressions / 1000) * CPM_INR_BY_CHANNEL.get(row.platform, 65) / 100000
        * (1 + max(row.sentiment_score, -0.4))
        * (1.25 if row.meme_format else 1)
        for row in _brand_social_rows(canonical)
    )
    media_value_lakh = round(broadcast_value_lakh + social_value_lakh, 2)
    roi_pct = round(((media_value_lakh - spend) / spend) * 100, 2) if spend else 0

    top_players: dict[str, float] = {}
    for row in logo_rows:
        top_players[row.player] = top_players.get(row.player, 0) + _logo_score(row)
    for row in _brand_social_rows(canonical):
        top_players[row.player] = top_players.get(row.player, 0) + row.engagements / 1000
    best_player = max(top_players, key=top_players.get) if top_players else "unknown"

    recommendation = _recommend(canonical, logo, social, roi_pct)
    return {
        "brand_name": canonical,
        "match_scope": match or "Overall",
        "data_status": "simulated_with_real_api_connectors_ready",
        "do_not_misrepresent": "Outputs are estimates unless connected to live CV, broadcast, spend, and social APIs.",
        "jersey_logo_visibility": logo,
        "social_mentions": social,
        "meme_virality": {
            "estimated_meme_impressions": social["meme_impressions"],
            "meme_share_of_voice_pct": round((social["meme_impressions"] / social["total_impressions"]) * 100, 2)
            if social["total_impressions"]
            else 0,
        },
        "sponsor_sentiment": {
            "score": social["sentiment_score"],
            "label": social["sentiment_label"],
        },
        "exposure_score": round((logo["visibility_score"] * 0.55) + min(100, social["engagement_rate_pct"] * 12) * 0.2 + max(0, social["sentiment_score"] * 100) * 0.25, 2),
        "estimated_media_value_lakh": media_value_lakh,
        "assumed_spend_lakh": spend,
        "estimated_roi_pct": roi_pct,
        "best_player_association": best_player,
        "brand_recommendations": recommendation,
    }


def _recommend(brand: str, logo: dict, social: dict, roi_pct: float) -> list[str]:
    recs = []
    if logo["visibility_score"] < 60:
        recs.append("Move high-value inventory toward front-jersey or helmet placements during batting close-ups.")
    else:
        recs.append("Protect current jersey inventory and negotiate highlight-package usage rights.")
    if social["meme_impressions"] > social["total_impressions"] * 0.45:
        recs.append("Fund meme-native creator briefs within two hours of match finish.")
    if social["sentiment_score"] < 0.2:
        recs.append("Shift creative from hard-sell ads to player-led contextual stories.")
    if roi_pct < 0:
        recs.append("Reprice the sponsorship or require guaranteed broadcast close-up minimums.")
    else:
        recs.append(f"Use {brand} player association data for retargeting and search-lift campaigns.")
    return recs


def compare_sponsors(brands: list[str] | None = None, match: str | None = None) -> dict:
    selected = brands or known_brands()
    reports = [estimate_sponsor_roi(brand, match) for brand in selected]
    ranked = sorted(reports, key=lambda item: item["exposure_score"], reverse=True)
    return {
        "data_status": "simulation_comparison",
        "match_scope": match or "Overall",
        "leader": ranked[0]["brand_name"] if ranked else None,
        "brands": [
            {
                "brand_name": row["brand_name"],
                "exposure_score": row["exposure_score"],
                "estimated_roi_pct": row["estimated_roi_pct"],
                "estimated_media_value_lakh": row["estimated_media_value_lakh"],
                "sentiment": row["sponsor_sentiment"]["label"],
                "meme_impressions": row["meme_virality"]["estimated_meme_impressions"],
                "best_player_association": row["best_player_association"],
            }
            for row in ranked
        ],
    }


def export_sponsor_report(brand: str, match: str | None = None) -> dict:
    report = estimate_sponsor_roi(brand, match)
    markdown = "\n".join(
        [
            f"# IPL Sponsor ROI Report: {report['brand_name']}",
            f"Match scope: {report['match_scope']}",
            f"Data status: {report['data_status']}",
            "",
            f"- Exposure score: {report['exposure_score']}",
            f"- Estimated media value: INR {report['estimated_media_value_lakh']} lakh",
            f"- Assumed spend: INR {report['assumed_spend_lakh']} lakh",
            f"- Estimated ROI: {report['estimated_roi_pct']}%",
            f"- Best player association: {report['best_player_association']}",
            f"- Meme impressions: {report['meme_virality']['estimated_meme_impressions']}",
            "",
            "## Recommendations",
            *[f"- {item}" for item in report["brand_recommendations"]],
            "",
            f"Disclosure: {report['do_not_misrepresent']}",
        ]
    )
    return {"format": "markdown", "report": markdown, "raw": report}
