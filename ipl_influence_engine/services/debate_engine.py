from __future__ import annotations

import re
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone

from data.database import save_debate, update_vote
from agents.agent import root_agent
import json


@dataclass(frozen=True)
class PlayerProfile:
    name: str
    role: str
    runs: int
    strike_rate: float
    average: float
    titles_as_player: int
    titles_as_captain: int
    wickets: int
    economy: float | None
    captain_win_pct: float | None
    clutch_score: int
    legacy_tags: tuple[str, ...]


PLAYER_STATS = {
    "Dhoni": PlayerProfile("Dhoni", "WK batter / captain", 5243, 137.5, 39.1, 5, 5, 0, None, 58.8, 96, ("finisher", "tactical calm", "CSK dynasty")),
    "Rohit": PlayerProfile("Rohit", "Opener / captain", 6628, 131.1, 29.7, 6, 5, 15, 8.0, 56.3, 88, ("MI dynasty", "powerplay tempo", "big-match leadership")),
    "Kohli": PlayerProfile("Kohli", "Top-order batter", 8004, 131.9, 38.7, 0, 0, 4, 8.8, 46.2, 91, ("run machine", "chase authority", "RCB icon")),
    "ABD": PlayerProfile("ABD", "Middle-order batter", 5162, 151.7, 39.7, 0, 0, 0, None, None, 89, ("360 hitting", "impact cameos", "RCB icon")),
    "Bumrah": PlayerProfile("Bumrah", "Fast bowler", 69, 89.6, 8.6, 5, 0, 165, 7.4, None, 94, ("death overs", "yorkers", "pressure wickets")),
    "Warner": PlayerProfile("Warner", "Opener / captain", 6565, 139.9, 41.5, 1, 1, 0, None, 52.4, 87, ("consistent scorer", "SRH legend", "aggressive start")),
    "Gayle": PlayerProfile("Gayle", "Opener", 4965, 149.0, 39.7, 2, 0, 18, 8.1, None, 85, ("Universe Boss", "power hitting", "six machine")),
    "Hardik": PlayerProfile("Hardik", "All-rounder / captain", 2525, 145.8, 30.5, 5, 1, 60, 8.8, 62.0, 92, ("impact all-rounder", "GT leadership", "clutch hitting")),
    "Rashid": PlayerProfile("Rashid", "Leg spinner", 450, 138.0, 12.0, 1, 0, 139, 6.7, None, 93, ("mystery spin", "economical god", "match winner")),
    "Sky": PlayerProfile("Sky", "Middle-order batter", 3500, 143.5, 32.2, 5, 0, 0, None, None, 90, ("360 batter", "MI backbone", "innovative strokeplay")),
}

TEAM_PROFILES = {
    "CSK": {"titles": 5, "identity": "continuity, spin control, experienced cores", "fan_base": 94},
    "MI": {"titles": 5, "identity": "scouting, pace depth, explosive batting cycles", "fan_base": 91},
    "RCB": {"titles": 0, "identity": "star power, loyal fandom, batting-first identity", "fan_base": 88},
    "KKR": {"titles": 3, "identity": "mystery spin, flexible all-rounders, aggressive auctions", "fan_base": 74},
    "SRH": {"titles": 1, "identity": "bowling heavy, efficient scouting, dark horse", "fan_base": 65},
    "GT": {"titles": 1, "identity": "new age, team balance, clutch culture", "fan_base": 60},
}

# Keep in-memory caches for fast retrieval of static parts
DEBATE_HISTORY: list[dict] = []


def retrieve_stats(entity: str) -> dict:
    name = _canonical_entity(entity)
    if name in PLAYER_STATS:
        row = PLAYER_STATS[name]
        return {
            "type": "player",
            "name": row.name,
            "role": row.role,
            "runs": row.runs,
            "strike_rate": row.strike_rate,
            "average": row.average,
            "titles_as_player": row.titles_as_player,
            "titles_as_captain": row.titles_as_captain,
            "wickets": row.wickets,
            "economy": row.economy,
            "captain_win_pct": row.captain_win_pct,
            "clutch_score": row.clutch_score,
            "legacy_tags": list(row.legacy_tags),
        }
    if name in TEAM_PROFILES:
        return {"type": "team", "name": name, **TEAM_PROFILES[name]}
    return {"type": "unknown", "name": entity, "data_status": "not_found"}


def compare_players(entity_a: str, entity_b: str, lens: str = "overall") -> dict:
    a = retrieve_stats(entity_a)
    b = retrieve_stats(entity_b)
    if a["type"] == "unknown" or b["type"] == "unknown":
        return {"error": "At least one entity was not found", "entity_a": a, "entity_b": b}

    score_a = _score_entity(a, lens)
    score_b = _score_entity(b, lens)
    return {
        "lens": lens,
        "entity_a": a,
        "entity_b": b,
        "score_a": round(score_a, 2),
        "score_b": round(score_b, 2),
        "edge": a["name"] if score_a > score_b else b["name"] if score_b > score_a else "tie",
        "margin": round(abs(score_a - score_b), 2),
    }


def analyze_legacy(entity: str) -> dict:
    stats = retrieve_stats(entity)
    if stats["type"] == "player":
        legacy_score = (
            stats["clutch_score"] * 0.32
            + stats["titles_as_player"] * 7
            + stats["titles_as_captain"] * 5
            + min(stats["runs"] / 100, 80) * 0.25
            + (stats["wickets"] * 0.18)
        )
        return {
            "entity": stats["name"],
            "legacy_score": round(min(100, legacy_score), 2),
            "legacy_tags": stats["legacy_tags"],
            "argument": f"{stats['name']} legacy is anchored by {', '.join(stats['legacy_tags'])}.",
        }
    if stats["type"] == "team":
        return {
            "entity": stats["name"],
            "legacy_score": min(100, stats["titles"] * 13 + stats["fan_base"] * 0.35),
            "legacy_tags": [stats["identity"]],
            "argument": f"{stats['name']} legacy combines {stats['titles']} titles with {stats['identity']}.",
        }
    return {"entity": entity, "legacy_score": 0, "argument": "No reliable local data found."}


def detect_bias(topic: str) -> dict:
    lower = topic.lower()
    loaded_terms = ["goat", "destroy", "owned", "fraud", "finished", "always", "never", "king", "choker"]
    hits = [term for term in loaded_terms if term in lower]
    intensity = min(100, 20 + len(hits) * 22 + (15 if "vs" in lower else 0))
    return {
        "bias_score": intensity,
        "bias_label": "high" if intensity >= 65 else "moderate" if intensity >= 40 else "low",
        "loaded_terms": hits,
        "mitigation": "Use role-specific criteria and state uncertainty instead of declaring a fan-war winner.",
    }


def generate_counterarguments(entity_a: str, entity_b: str, lens: str) -> dict:
    comparison = compare_players(entity_a, entity_b, lens)
    if "error" in comparison:
        return comparison
    a = comparison["entity_a"]
    b = comparison["entity_b"]
    return {
        "for_a": [
            _primary_argument(a, lens),
            f"Counter to {b['name']}: raw trophies or strike rate alone miss role context.",
        ],
        "for_b": [
            _primary_argument(b, lens),
            f"Counter to {a['name']}: legacy needs pressure impact, not only aggregate volume.",
        ],
    }


def judge_debate(topic: str) -> dict:
    if root_agent:
        try:
            # Ask Gemini to judge the debate using available tools
            prompt = f"Judge this IPL debate topic: {topic}. Provide a JSON response with fields: verdict (detailed explanation), winner (entity name or 'tie'), confidence_pct (int), side_a, side_b."
            response = root_agent.run(prompt)
            # If the response is a JSON string, parse it
            if "{" in response:
                try:
                    # Crude extraction of JSON if wrapped in markdown
                    json_str = response
                    if "```json" in response:
                        json_str = response.split("```json")[1].split("```")[0].strip()
                    elif "```" in response:
                        json_str = response.split("```")[1].split("```")[0].strip()
                    
                    ai_data = json.loads(json_str)
                    entities = [ai_data.get("side_a", ""), ai_data.get("side_b", "")]
                    if not entities[0]: entities = extract_entities(topic)
                except:
                    entities = extract_entities(topic)
                    ai_data = {"verdict": response, "winner": "tie", "confidence_pct": 80}
            else:
                entities = extract_entities(topic)
                ai_data = {"verdict": response, "winner": "tie", "confidence_pct": 80}
            
            debate_uuid = str(uuid.uuid4())
            debate_id = f"debate-{debate_uuid[:8]}"
            save_debate(debate_id, topic, ai_data.get("verdict", ""), ai_data.get("confidence_pct", 80), "low")
            
            result = {
                "debate_id": debate_id,
                "topic": topic,
                "lens": "ai_analyzed",
                "side_a": entities[0] if len(entities) > 0 else "Player A",
                "side_b": entities[1] if len(entities) > 1 else "Player B",
                "stats_retrieval": {
                    entities[0]: retrieve_stats(entities[0]) if len(entities) > 0 else {},
                    entities[1]: retrieve_stats(entities[1]) if len(entities) > 1 else {},
                },
                "final_judge": ai_data,
                "viral_shareable": build_viral_shareable(topic, ai_data.get("winner", "tie"), ai_data.get("confidence_pct", 80)),
                "created_at": datetime.now(timezone.utc).isoformat() + "Z",
                "data_status": "ai_generated",
            }
            DEBATE_HISTORY.append(result)
            return result
        except Exception as e:
            print(f"Gemini Debate Error: {e}")

    entities = extract_entities(topic)
    if len(entities) < 2:
        entities = ["Dhoni", "Rohit"] if "captain" in topic.lower() else ["Kohli", "ABD"]
    lens = _infer_lens(topic)
    comparison = compare_players(entities[0], entities[1], lens)
    counters = generate_counterarguments(entities[0], entities[1], lens)
    bias = detect_bias(topic)
    confidence = _confidence(comparison, bias)
    winner = comparison.get("edge", "tie")
    verdict = _verdict(comparison, lens, winner)
    debate_uuid = str(uuid.uuid4())
    debate_id = f"debate-{debate_uuid[:8]}"
    
    # Persist to DB
    save_debate(debate_id, topic, verdict, confidence, bias["bias_label"])
    
    result = {
        "debate_id": debate_id,
        "topic": topic,
        "lens": lens,
        "side_a": entities[0],
        "side_b": entities[1],
        "stats_retrieval": {
            entities[0]: retrieve_stats(entities[0]),
            entities[1]: retrieve_stats(entities[1]),
        },
        "comparison": comparison,
        "legacy_analysis": {
            entities[0]: analyze_legacy(entities[0]),
            entities[1]: analyze_legacy(entities[1]),
        },
        "balanced_arguments": counters,
        "bias_detection": bias,
        "final_judge": {
            "verdict": verdict,
            "winner": winner,
            "confidence_pct": confidence,
            "caveat": "Verdict is evidence-weighted from local IPL stats and should be refreshed with live season data before publication.",
        },
        "fan_voting": {"votes": {entities[0]: 0, entities[1]: 0}, "total_votes": 0},
        "viral_shareable": build_viral_shareable(topic, winner, confidence),
        "created_at": datetime.now(timezone.utc).isoformat() + "Z",
        "data_status": "curated_local_stats_simulation",
    }
    DEBATE_HISTORY.append(result)
    return result


def vote_debate(debate_id: str, side: str) -> dict:
    # We need to know which players are in this debate to update votes correctly.
    # For simulation, we'll try to find it in history or just update DB.
    # In a real app, we'd fetch the debate from DB first.
    found = next((d for d in DEBATE_HISTORY if d["debate_id"] == debate_id), None)
    side_a_name = found["side_a"] if found else side
    return update_vote(debate_id, side, side_a_name)


def debate_history(limit: int = 10) -> list[dict]:
    return DEBATE_HISTORY[-limit:][::-1]


def build_viral_shareable(topic: str, winner: str, confidence: int) -> dict:
    return {
        "short_post": f"{topic}: evidence edge goes to {winner} with {confidence}% confidence. Debate the criteria, not just the fandom.",
        "poll_text": f"Who wins this IPL debate: {topic}?",
        "hashtags": ["#IPL", "#CricketDebate", "#FanVerdict"],
    }


def extract_entities(topic: str) -> list[str]:
    found = []
    all_names = list(PLAYER_STATS) + list(TEAM_PROFILES)
    for name in all_names:
        if re.search(rf"\b{re.escape(name)}\b", topic, flags=re.IGNORECASE):
            found.append(name)
    return found[:2]


def _canonical_entity(entity: str) -> str:
    for name in list(PLAYER_STATS) + list(TEAM_PROFILES):
        if name.lower() == entity.strip().lower():
            return name
    return entity.strip()


def _infer_lens(topic: str) -> str:
    lower = topic.lower()
    if "captain" in lower or "leader" in lower:
        return "captaincy"
    if "bat" in lower or "kohli" in lower or "abd" in lower or "runs" in lower:
        return "batting"
    if "team" in lower:
        return "team_legacy"
    return "overall"


def _score_entity(stats: dict, lens: str) -> float:
    if stats["type"] == "team":
        return stats["titles"] * 14 + stats["fan_base"] * 0.35
    if lens == "captaincy":
        return (stats.get("titles_as_captain") or 0) * 12 + (stats.get("captain_win_pct") or 45) * 0.55 + stats["clutch_score"] * 0.25
    if lens == "batting":
        return min(stats["runs"] / 90, 90) * 0.35 + stats["strike_rate"] * 0.32 + stats["average"] * 0.5 + stats["clutch_score"] * 0.22
    return (
        min(stats.get("runs", 0) / 100, 85) * 0.25
        + stats.get("strike_rate", 0) * 0.18
        + stats.get("titles_as_player", 0) * 7
        + stats.get("clutch_score", 0) * 0.35
        + stats.get("wickets", 0) * 0.12
    )


def _primary_argument(stats: dict, lens: str) -> str:
    if stats["type"] == "team":
        return f"{stats['name']} has {stats['titles']} titles and an identity built on {stats['identity']}."
    if lens == "captaincy":
        return f"{stats['name']} brings {stats['titles_as_captain']} captaincy titles and {stats.get('captain_win_pct') or 'limited'} win-rate evidence."
    if lens == "batting":
        return f"{stats['name']} combines {stats['runs']} runs, {stats['strike_rate']} strike rate, and {stats['average']} average."
    return f"{stats['name']} has a balanced case across runs, titles, clutch score, and role impact."


def _confidence(comparison: dict, bias: dict) -> int:
    if "error" in comparison:
        return 30
    base = 62 + min(24, comparison["margin"] / 2)
    penalty = 8 if bias["bias_label"] == "high" else 3 if bias["bias_label"] == "moderate" else 0
    return int(max(45, min(92, base - penalty)))


def _verdict(comparison: dict, lens: str, winner: str) -> str:
    if "error" in comparison:
        return "Insufficient reliable data for a judge verdict."
    a = comparison["entity_a"]["name"]
    b = comparison["entity_b"]["name"]
    if winner == "tie":
        return f"{a} vs {b} is too close under the {lens} lens; criteria choice decides the winner."
    return f"Under the {lens} lens, {winner} has the stronger evidence-weighted case, but the verdict changes if fans prioritize a different criterion."

