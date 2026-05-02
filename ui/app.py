import os

import pandas as pd
import plotly.express as px
import requests
import streamlit as st


API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")
API_KEY = os.getenv("API_KEY")


def api_headers() -> dict:
    return {"X-API-Key": API_KEY} if API_KEY else {}


def post_chat(query: str) -> dict:
    response = requests.post(
        f"{API_BASE_URL}/api/chat",
        json={"query": query},
        headers=api_headers(),
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["data"]


def get_summary() -> dict:
    response = requests.get(
        f"{API_BASE_URL}/api/reports/summary",
        headers=api_headers(),
        timeout=15,
    )
    response.raise_for_status()
    return response.json()["data"]


st.set_page_config(page_title="IPL Influence Engine", layout="wide", page_icon="🏏")

st.markdown(
    """
<style>
    .stButton>button {
        background-color: #E63946;
        color: white;
        border-radius: 5px;
        font-weight: 700;
    }
    .metric-card {
        background-color: #182033;
        padding: 16px;
        border-radius: 8px;
        color: white;
        border: 1px solid rgba(255,255,255,0.08);
    }
    .logo-container {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 20px;
    }
    .logo-img {
        width: 80px;
        height: auto;
    }
</style>
""",
    unsafe_allow_html=True,
)

# Header with logo
col_logo, col_title = st.columns([1, 6])
with col_logo:
    st.image("assets/logo.png", width=100)
with col_title:
    st.title("IPL Influence Engine")
    st.caption("AI-powered IPL sponsor intelligence simulator and debate engagement platform")

tabs = st.tabs(["Ask AI", "Sponsor ROI", "Debate Arena", "Reports"])

with tabs[0]:
    st.subheader("Ask AI")
    query = st.text_area(
        "Ask about sponsor ROI, brand visibility, or IPL player/team debates.",
        height=110,
        placeholder="Example: How much ROI did Dream11 get from MI vs CSK?",
    )

    if st.button("Generate insights", type="primary"):
        if not query.strip():
            st.warning("Enter a query first.")
        else:
            with st.spinner("Routing query..."):
                try:
                    data = post_chat(query.strip())
                    st.success(f"Route: {data['route_taken']}")
                    if "module_a_output" in data:
                        st.json(data["module_a_output"])
                    if "module_b_output" in data:
                        st.json(data["module_b_output"])
                    if "message" in data:
                        st.info(data["message"])
                except requests.RequestException as exc:
                    st.error(f"API request failed: {exc}")

with tabs[1]:
    st.subheader("Sponsor ROI")
    brand = st.selectbox("Brand", ["Dream11", "CEAT", "Puma"])
    team = st.text_input("Team or matchup context", value="MI vs CSK")

    if st.button("Estimate sponsor ROI"):
        with st.spinner("Loading sponsor metrics..."):
            try:
                data = post_chat(f"{brand} sponsor ROI visibility marketing {team}")
                roi = data.get("module_a_output", {})
                cols = st.columns(4)
                cols[0].metric("Visibility", roi.get("visibility_score", "n/a"))
                cols[1].metric("ROI", roi.get("estimated_roi", "n/a"))
                cols[2].metric("Mentions", roi.get("social_mentions", "n/a"))
                cols[3].metric("Sentiment", roi.get("sentiment", "n/a"))
                st.json(roi)
            except requests.RequestException as exc:
                st.error(f"API request failed: {exc}")

with tabs[2]:
    st.subheader("Debate Arena")
    topic = st.text_input("Debate topic", value="Dhoni vs Rohit as IPL captain")

    if st.button("Generate debate"):
        with st.spinner("Building balanced debate..."):
            try:
                data = post_chat(topic)
                debate = data.get("module_b_output", {})
                col_a, col_b = st.columns(2)
                with col_a:
                    st.markdown(f"#### {debate.get('side_a', 'Side A')}")
                    for item in debate.get("side_a_strengths", []):
                        st.write(item)
                with col_b:
                    st.markdown(f"#### {debate.get('side_b', 'Side B')}")
                    for item in debate.get("side_b_strengths", []):
                        st.write(item)
                st.info(debate.get("neutral_verdict", "No verdict returned."))
                st.json(debate)
            except requests.RequestException as exc:
                st.error(f"API request failed: {exc}")

with tabs[3]:
    st.subheader("Reports")
    try:
        summary = get_summary()
        metrics = pd.DataFrame(summary["sponsor_metrics"])
        if not metrics.empty:
            st.dataframe(metrics, use_container_width=True, hide_index=True)
            fig = px.bar(
                metrics,
                x="brand_name",
                y="visibility_score",
                color="sentiment",
                title="Sponsor visibility by brand",
            )
            st.plotly_chart(fig, use_container_width=True)

        queries = pd.DataFrame(summary["recent_queries"])
        st.markdown("#### Recent Queries")
        st.dataframe(queries, use_container_width=True, hide_index=True)
    except requests.RequestException as exc:
        st.error(f"Report API failed: {exc}")
