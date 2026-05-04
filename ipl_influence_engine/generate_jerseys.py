import os
import requests
import json
import time

# Configuration
API_KEY = "YOUR_IMAGE_GENERATION_API_KEY" # Replace with actual API key
API_URL = "https://api.example.com/v1/images/generations" # Replace with actual API endpoint

TEAMS = [
    {"name": "Chennai Super Kings (CSK)", "id": "csk", "colors": "Yellow with blue accents"},
    {"name": "Mumbai Indians (MI)", "id": "mi", "colors": "Blue with gold accents"},
    {"name": "Royal Challengers Bangalore (RCB)", "id": "rcb", "colors": "Red and black with gold accents"},
    {"name": "Kolkata Knight Riders (KKR)", "id": "kkr", "colors": "Purple with gold accents"},
    {"name": "Sunrisers Hyderabad (SRH)", "id": "srh", "colors": "Orange with black accents"},
    {"name": "Rajasthan Royals (RR)", "id": "rr", "colors": "Pink with royal blue accents"},
    {"name": "Gujarat Titans (GT)", "id": "gt", "colors": "Dark blue with gold accents"},
    {"name": "Punjab Kings (PBKS)", "id": "pbks", "colors": "Red and silver"},
    {"name": "Delhi Capitals (DC)", "id": "dc", "colors": "Blue and red"},
    {"name": "Lucknow Super Giants (LSG)", "id": "lsg", "colors": "Dark maroon/red with gold accents"}
]

BASE_DIR = "public/assets/jerseys"

MASTER_PROMPT = """Create a hyper-realistic 4K image of a professional cricket jersey inspired by {team_name}.

Requirements:
- Ultra high resolution (4K)
- {view_type} view (perfectly centered)
- Clean studio lighting (soft shadows)
- No human model
- Floating jersey (or invisible mannequin)
- Realistic fabric texture (polyester sports mesh)
- High detail stitching and folds
- Official team color scheme ({team_colors})

Design details:
- Modern IPL-style cricket jersey
- Include realistic sponsor-style placeholders (NOT real copyrighted logos)
{back_details}
- Add subtle patterns, gradients, and texture
- Collar + sleeve details visible
- Clean proportions

Background:
- Dark gradient (black to navy)
- Slight glow behind jersey
- Premium sports presentation

Style:
- Photorealistic
- Cinematic lighting
- Sharp edges
- No blur
- No watermark
- No text outside jersey

Output:
- 1:1 or 4:5 ratio
- 4K resolution
- Clean and centered
"""

def generate_image(prompt, save_path):
    print(f"Generating image for {save_path}...")
    # This is a placeholder for actual API call logic
    # Example for DALL-E / OpenAI:
    # headers = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
    # payload = {"prompt": prompt, "n": 1, "size": "1024x1024"}
    # response = requests.post(API_URL, headers=headers, json=payload)
    # ... handle response and save image ...
    
    # Mocking success for the script structure
    time.sleep(1) 
    return True

def main():
    if not os.path.exists(BASE_DIR):
        os.makedirs(BASE_DIR)

    for team in TEAMS:
        team_id = team["id"]
        team_name = team["name"]
        team_colors = team["colors"]
        
        team_dir = os.path.join(BASE_DIR, team_id)
        if not os.path.exists(team_dir):
            os.makedirs(team_dir)

        # Front View
        front_prompt = MASTER_PROMPT.format(
            team_name=team_name,
            view_type="Front",
            team_colors=team_colors,
            back_details=""
        )
        front_path = os.path.join(team_dir, "front.png")
        if not os.path.exists(front_path):
            success = generate_image(front_prompt, front_path)
            if success:
                print(f"✅ Success: {team_id} front")
            else:
                print(f"❌ Failed: {team_id} front")

        # Back View
        back_details = """- Show BACK side of jersey
- Include player name placeholder
- Include number placeholder (e.g., 7 or 18)
- Sponsor area on upper back visible"""
        
        back_prompt = MASTER_PROMPT.format(
            team_name=team_name,
            view_type="Back",
            team_colors=team_colors,
            back_details=back_details
        )
        back_path = os.path.join(team_dir, "back.png")
        if not os.path.exists(back_path):
            success = generate_image(back_prompt, back_path)
            if success:
                print(f"✅ Success: {team_id} back")
            else:
                print(f"❌ Failed: {team_id} back")

if __name__ == "__main__":
    main()
