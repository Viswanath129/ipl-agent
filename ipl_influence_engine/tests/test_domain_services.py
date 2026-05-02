from services.debate_engine import judge_debate, vote_debate
from services.sponsor_roi import compare_sponsors, estimate_sponsor_roi, export_sponsor_report


def test_sponsor_roi_has_required_problem_statement_fields():
    report = estimate_sponsor_roi("Puma", "RCB vs KKR")

    assert report["brand_name"] == "Puma"
    assert report["data_status"] == "simulated_with_real_api_connectors_ready"
    assert report["jersey_logo_visibility"]["detections"]
    assert report["social_mentions"]["total_mentions"] > 0
    assert report["meme_virality"]["estimated_meme_impressions"] > 0
    assert isinstance(report["estimated_roi_pct"], float)
    assert report["brand_recommendations"]


def test_sponsor_comparison_ranks_multiple_brands():
    comparison = compare_sponsors(match="MI vs CSK")

    assert comparison["leader"]
    assert len(comparison["brands"]) >= 3
    assert comparison["brands"][0]["exposure_score"] >= comparison["brands"][-1]["exposure_score"]


def test_sponsor_report_export_is_markdown_with_disclosure():
    exported = export_sponsor_report("Dream11", "MI vs CSK")

    assert exported["format"] == "markdown"
    assert "Disclosure:" in exported["report"]
    assert "Estimated ROI" in exported["report"]


def test_debate_engine_returns_evidence_bias_verdict_and_viral_output():
    debate = judge_debate("Kohli vs ABD as IPL batter")

    assert debate["side_a"] == "Kohli"
    assert debate["side_b"] == "ABD"
    assert debate["stats_retrieval"]["Kohli"]["runs"] > 0
    assert debate["balanced_arguments"]["for_a"]
    assert debate["bias_detection"]["bias_label"] in {"low", "moderate", "high"}
    assert debate["final_judge"]["confidence_pct"] >= 45
    assert debate["viral_shareable"]["short_post"]


def test_debate_voting_updates_count():
    debate = judge_debate("Dhoni vs Rohit as captain")
    votes = vote_debate(debate["debate_id"], "Dhoni")

    assert votes["votes"]["Dhoni"] == 1
    assert votes["total_votes"] == 1

