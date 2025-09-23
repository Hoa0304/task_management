from datetime import date
import os
import json
import requests
from dotenv import load_dotenv

from app.database import insert_task

load_dotenv()
GEMINI_KEY = os.getenv("GEMINI_KEY")

ALLOWED_FIELDS = {
    "title",
    "description",
    "status",
    "due_date",
    "category",
    "priority"
}

STRICT_JSON_PROMPT_TEMPLATE = """
Return ONLY a single JSON object matching exactly this schema:

{{
  "title": "string",
  "description": "string",
  "status": "Backlog",
  "due_date": "YYYY-MM-DD",
  "category": "Design | Content | Research | Planning",
  "priority": "Low | Medium | High"
}}

Rules:
- ALL fields must be present.
- No markdown, no extra text, no bullet points.
- Output must be valid JSON parsable by json.loads().
- "due_date" must be exactly {today}.
- Use realistic values for a software project research task.
"""

def call_gemini(prompt):
    headers = {"Content-Type": "application/json", "x-goog-api-key": GEMINI_KEY}
    body = {"contents": [{"parts": [{"text": prompt}]}]}
    res = requests.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent",
        headers=headers,
        json=body
    )
    res.raise_for_status()
    return res.json()

def extract_json(text_output):
    braces_stack = []
    start = None
    for i, c in enumerate(text_output):
        if c == '{':
            if start is None:
                start = i
            braces_stack.append(c)
        elif c == '}':
            if braces_stack:
                braces_stack.pop()
                if not braces_stack:
                    return text_output[start:i+1]
    return None

def get_text_from_candidate(candidate):
    content = candidate.get("content", {})
    parts = content.get("parts", [])
    if parts and isinstance(parts, list):
        first_part = parts[0]
        if isinstance(first_part, dict) and "text" in first_part:
            return first_part["text"]
    if "text" in content:
        return content["text"]
    return None 

def build_prompt(user_prompt: str = None):
    today_str = date.today().strftime("%Y-%m-%d")
    prompt = STRICT_JSON_PROMPT_TEMPLATE.format(today=today_str)
    if user_prompt:
        prompt = f"{user_prompt}\n\n{prompt}"
    return prompt, today_str

def generate_task_from_gemini(db_session, user_prompt: str):

    prompt, today_str = build_prompt(user_prompt)
    data = call_gemini(prompt)

    if "candidates" not in data or not data["candidates"]:
        return {"error": "No content returned from Gemini", "raw": data}, 500

    text_output = get_text_from_candidate(data["candidates"][0])
    if not text_output:
        return {"error": "Gemini returned empty text", "raw_data": data}, 500

    clean_text = extract_json(text_output)
    if not clean_text:
        return {"error": "Failed to extract JSON", "raw_output": text_output}, 500

    gemini_data = json.loads(clean_text)
    gemini_data = {k: v for k, v in gemini_data.items() if k in ALLOWED_FIELDS}
    gemini_data["due_date"] = today_str

    task_data_for_db = {
        "title": gemini_data.get("title"),
        "description": gemini_data.get("description"),
        "status": gemini_data.get("status"),
        "due_date": gemini_data.get("due_date"),
        "category": gemini_data.get("category"),
        "priority": gemini_data.get("priority")
    }

    created_task = insert_task(db_session, task_data_for_db)
    db_session.commit()
    return created_task, 201
