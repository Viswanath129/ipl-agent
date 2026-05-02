from services.sponsor_roi import (
    build_logo_detection_pipeline,
    build_social_mention_pipeline,
    compare_sponsors,
    estimate_sponsor_roi,
    export_sponsor_report,
)


def sponsor_roi_tool(brand: str, team: str = "Overall") -> dict:
    """
    Estimate sponsor visibility and ROI for an IPL brand.

    Args:
        brand: Sponsor brand name, for example Dream11, CEAT, or Puma.
        team: Optional IPL team or matchup context.

    Returns:
        dict: Sponsor ROI, visibility, social, sentiment, and recommendation fields.
    """
    return estimate_sponsor_roi(brand=brand, match=team)


def calculate_roi(brand_name: str, spend: float = 50) -> dict:
    """Backward-compatible wrapper for older callers."""
    return estimate_sponsor_roi(brand=brand_name, spend_lakh=spend * 100)


def logo_visibility_tool(brand: str, match: str = "Overall") -> dict:
    """Return CV-ready logo detection output for a sponsor."""
    return build_logo_detection_pipeline(brand=brand, match=match)


def social_mentions_tool(brand: str) -> dict:
    """Return social mention, meme virality, and sentiment metrics."""
    return build_social_mention_pipeline(brand=brand)


def sponsor_comparison_tool(match: str = "Overall") -> dict:
    """Compare IPL sponsors across exposure, ROI, sentiment, and meme impact."""
    return compare_sponsors(match=match)


def sponsor_report_export_tool(brand: str, match: str = "Overall") -> dict:
    """Export a markdown sponsor ROI report."""
    return export_sponsor_report(brand=brand, match=match)
