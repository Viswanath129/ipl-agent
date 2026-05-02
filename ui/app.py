import streamlit as st
import requests
import pandas as pd
import plotly.express as px

st.set_page_config(page_title="IPL Influence Engine", layout="wide", page_icon="🏏")

# Injecting dark luxury sports theme CSS
st.markdown("""
<style>
    .reportview-container {
        background: #0E1117;
    }
    .stButton>button {
        background-color: #E63946;
        color: white;
        border-radius: 5px;
        font-weight: bold;
    }
    h1, h2, h3 {
        color: #F1FAEE;
        font-family: 'Inter', sans-serif;
    }
    .metric-card {
        background-color: #1D3557;
        padding: 20px;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin: 10px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
</style>
""", unsafe_allow_html=True)

st.title("⚡ IPL Influence Engine (GOD-LEVEL)")
st.subheader("Measure Sponsor ROI & Generate Viral AI Debates")

tabs = st.tabs([
    "🎯 Master Orchestrator", 
    "📈 Sponsor ROI Dashboard", 
    "🔥 Debate Arena", 
    "📊 Compare Brands", 
    "📱 Viral Content Generator", 
    "🗺️ Trend Heatmap",
    "📄 Reports Export"
])

# Tab 1: Chat Orchestrator
with tabs[0]:
    st.markdown("### Ask the AI Engine")
    query = st.text_area("What do you want to know? (e.g. 'How much ROI did Dream11 get from MI vs CSK?')", height=100)
    
    if st.button("Generate Insights"):
        if query:
            with st.spinner("Orchestrating agents..."):
                try:
                    response = requests.post("http://localhost:8000/api/chat", json={"query": query})
                    if response.status_code == 200:
                        data = response.json()["data"]
                        st.success(f"Routed via: {data['route_taken']}")
                        
                        if "module_a_output" in data:
                            st.markdown("#### Module A: Sponsor ROI Insights")
                            st.json(data["module_a_output"])
                        if "module_b_output" in data:
                            st.markdown("#### Module B: AI Debate Generation")
                            st.json(data["module_b_output"])
                    else:
                        st.error("API Error")
                except requests.exceptions.ConnectionError:
                    st.error("Backend server is not running. Please start main.py on port 8000.")
        else:
            st.warning("Please enter a query.")

# Tab 2: Sponsor ROI Dashboard
with tabs[1]:
    st.markdown("### Module A: Sponsor ROI Dashboard")
    col1, col2, col3, col4 = st.columns(4)
    with col1: st.markdown("<div class='metric-card'><h3>Dream11</h3><p>Visibility: 92/100</p></div>", unsafe_allow_html=True)
    with col2: st.markdown("<div class='metric-card'><h3>ROI</h3><p>312%</p></div>", unsafe_allow_html=True)
    with col3: st.markdown("<div class='metric-card'><h3>Social</h3><p>140k Mentions</p></div>", unsafe_allow_html=True)
    with col4: st.markdown("<div class='metric-card'><h3>Top Player</h3><p>Virat Kohli</p></div>", unsafe_allow_html=True)
    
    df = pd.DataFrame({
        "Match Phase": ["Powerplay", "Middle Overs", "Death Overs"],
        "Visibility Seconds": [120, 250, 180]
    })
    fig = px.bar(df, x="Match Phase", y="Visibility Seconds", title="Dream11 Exposure Breakdown", color_discrete_sequence=['#E63946'])
    fig.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)", font_color="white")
    st.plotly_chart(fig, use_container_width=True)

# Tab 3: Debate Arena
with tabs[2]:
    st.markdown("### Module B: AI Debate Engine")
    st.info("Example Topic: Dhoni vs Rohit as IPL captain")
    colA, colB = st.columns(2)
    with colA:
        st.markdown("<div style='background:#f9a826; padding:15px; border-radius:10px; color:black;'><b>MS Dhoni (CSK)</b><br>✅ Unmatched tactical acumen under pressure<br>✅ High win percentage (59%)<br>✅ Master of utilizing spin on slow pitches</div>", unsafe_allow_html=True)
    with colB:
        st.markdown("<div style='background:#004ba0; padding:15px; border-radius:10px; color:white;'><b>Rohit Sharma (MI)</b><br>✅ 5 Titles in shorter span<br>✅ Brilliant aggressive field placements<br>✅ Builds highly aggressive pace attacks</div>", unsafe_allow_html=True)
    
    st.success("**Neutral Verdict:** Dhoni edges tactically, Rohit equals in titles. Confidence: 84%")

# Other tabs placeholders
with tabs[3]:
    st.markdown("### Compare Brand Lift")
    chart_df = pd.DataFrame({"Dream11 Lift (%)": [10, 20, 30], "My11Circle Lift (%)": [15, 18, 25]}, index=["Match 1", "Match 2", "Match 3"])
    st.line_chart(chart_df)

with tabs[4]:
    st.markdown("### Viral Content Generator")
    st.text_area("Generated Instagram Thread Draft:", "Slide 1: Who really runs the IPL? \nSlide 2: Stats say Kohli, Trophies say Rohit... \nSlide 3: Fan bias detected - High Emotional Polarization!")
    st.button("Export to Instagram Drafts")

with tabs[5]:
    st.markdown("### Trend Heatmap")
    st.image("https://via.placeholder.com/800x300/1D3557/F1FAEE?text=Social+Sentiment+Heatmap", use_container_width=True)

with tabs[6]:
    st.markdown("### Reports Export")
    st.button("📄 Download Daily Sponsor Report PDF")
