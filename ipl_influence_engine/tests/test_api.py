from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_sponsor_roi_endpoint():
    response = client.post("/api/sponsors/roi", json={"brand": "Dream11", "match": "MI vs CSK"})
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["brand_name"] == "Dream11"
    assert "jersey_logo_visibility" in data
    assert "do_not_misrepresent" in data


def test_debate_endpoint():
    response = client.post("/api/debates", json={"topic": "Dhoni vs Rohit as IPL captain"})
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["final_judge"]["verdict"]
    assert data["fan_voting"]["total_votes"] == 0


def test_chat_mixed_route():
    response = client.post("/api/chat", json={"query": "Dream11 ROI and Dhoni vs Rohit debate"})
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["route_taken"] == "mixed"
    assert "module_a_output" in data
    assert "module_b_output" in data

