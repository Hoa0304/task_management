from datetime import date
import os
import json
import requests
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

load_dotenv()

gemini_bp = Blueprint("gemini", __name__)
GEMINI_KEY = os.getenv("GEMINI_KEY")

ALLOWED_FIELDS = {
    "title",
    "description",
    "status",
    "dueDate",
    "category",
    "priority"
}

STRICT_JSON_PROMPT_TEMPLATE = """
Return ONLY a single JSON object matching exactly this schema:

{{
  "title": "string",
  "description": "string",
  "status": "Backlog | To Do | In Progress | Review | Done",
  "dueDate": "YYYY-MM-DD",
  "category": "Design | Content | Research | Planning",
  "priority": "Low | Medium | High"
}}

Rules:
- ALL fields must be present.
- No markdown, no extra text, no bullet points.
- Output must be valid JSON parsable by json.loads().
- "dueDate" must be exactly {today}.
- Use realistic values for a software project research task.
"""

def call_gemini(prompt):
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_KEY
    }
    body = {"contents": [{"parts": [{"text": prompt}]}]}
    res = requests.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent",
        headers=headers,
        json=body
    )
    res.raise_for_status()
    return res.json()

def extract_json(text_output):
    """Extract first valid JSON object using brace counting."""
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
    """Safely get text from Gemini candidate, handling both 'parts' and 'text'."""
    content = candidate.get("content", {})
    if "parts" in content and content["parts"]:
        return content["parts"][0].get("text", "")
    elif "text" in content:
        return content["text"]
    return ""

@gemini_bp.route("/generate-gemini", methods=["POST"])
def generate_gemini():
    try:
        today_str = date.today().strftime("%Y-%m-%d")
        user_prompt = request.json.get("prompt")

        # Build strict JSON prompt
        if not user_prompt:
            prompt = STRICT_JSON_PROMPT_TEMPLATE.format(today=today_str)
        else:
            # Append user's text context but enforce JSON-only rules
            prompt = f"{user_prompt}\n\n{STRICT_JSON_PROMPT_TEMPLATE.format(today=today_str)}"

        # Call Gemini
        data = call_gemini(prompt)
        if "candidates" not in data or not data["candidates"]:
            return jsonify({"error": "No content returned from Gemini", "raw": data}), 500

        text_output = get_text_from_candidate(data["candidates"][0])
        clean_text = extract_json(text_output)

        # Retry once with minimal strict prompt if extraction fails
        if not clean_text:
            fallback_prompt = STRICT_JSON_PROMPT_TEMPLATE.format(today=today_str)
            data_retry = call_gemini(fallback_prompt)
            text_output = get_text_from_candidate(data_retry["candidates"][0])
            clean_text = extract_json(text_output)
            if not clean_text:
                return jsonify({
                    "error": "Failed to extract JSON from Gemini output",
                    "raw_output": text_output
                }), 500

        try:
            gemini_data = json.loads(clean_text)
        except json.JSONDecodeError as e:
            return jsonify({
                "error": "Invalid JSON format",
                "raw_output": text_output,
                "parse_error": str(e)
            }), 500

        # Keep only allowed fields
        gemini_data = {k: v for k, v in gemini_data.items() if k in ALLOWED_FIELDS}

        # Retry missing fields
        missing = ALLOWED_FIELDS - set(gemini_data.keys())
        if missing:
            retry_prompt = f"{STRICT_JSON_PROMPT_TEMPLATE.format(today=today_str)}\nMissing fields: {', '.join(missing)}"
            data_retry = call_gemini(retry_prompt)
            text_retry = get_text_from_candidate(data_retry["candidates"][0])
            clean_retry = extract_json(text_retry)
            if clean_retry:
                gemini_data = json.loads(clean_retry)
                gemini_data = {k: v for k, v in gemini_data.items() if k in ALLOWED_FIELDS}

        # Force dueDate
        gemini_data["dueDate"] = today_str

        return jsonify(gemini_data)

    except requests.RequestException as req_err:
        return jsonify({"error": "Request to Gemini failed", "details": str(req_err)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
