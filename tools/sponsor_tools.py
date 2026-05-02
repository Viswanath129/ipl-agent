from data.database import Brand, SponsorMetric, get_session, init_db


def sponsor_roi_tool(brand: str, team: str = "Overall") -> dict:
    """
    Estimate sponsor visibility and ROI for an IPL brand.

    Args:
        brand: Sponsor brand name, for example Dream11, CEAT, or Puma.
        team: Optional IPL team or matchup context.

    Returns:
        dict: Sponsor ROI, visibility, social, sentiment, and recommendation fields.
    """
    init_db()
    normalized_brand = brand.strip() or "Dream11"

    with get_session() as session:
        record = (
            session.query(SponsorMetric)
            .join(Brand)
            .filter(Brand.name.ilike(normalized_brand))
            .order_by(SponsorMetric.id.desc())
            .first()
        )

        if record is None:
            return {
                "brand_name": normalized_brand,
                "team_context": team,
                "visibility_score": 0,
                "social_mentions": 0,
                "sentiment": "unknown",
                "estimated_roi": "unknown",
                "best_player_association": "unknown",
                "best_content_channel": "unknown",
                "recommendation": "No sponsor data found. Add real campaign metrics before presenting this as ROI intelligence.",
                "data_source": "sqlite",
            }

        brand_name = record.brand.name
        return {
            "brand_name": brand_name,
            "team_context": team,
            "visibility_score": round(record.visibility_score, 2),
            "social_mentions": record.social_mentions,
            "sentiment": record.sentiment,
            "estimated_roi": f"{record.estimated_roi_pct:.0f}%",
            "best_player_association": record.best_player_association,
            "best_content_channel": record.best_content_channel,
            "recommendation": record.recommendation,
            "data_source": "sqlite",
        }


def calculate_roi(brand_name: str, spend: float = 50) -> dict:
    """Backward-compatible wrapper for older callers."""
    result = sponsor_roi_tool(brand=brand_name)
    result["assumed_spend_crore"] = spend
    return {
        **result,
    }
