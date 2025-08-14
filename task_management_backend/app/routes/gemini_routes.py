from flask import Blueprint, request, jsonify
from app.database import TaskSessionLocal, insert_task
from app.services.gemini_service import (
    call_gemini,
    extract_json,
    get_text_from_candidate,
    build_prompt,
    ALLOWED_FIELDS
)
import json
import requests

gemini_bp = Blueprint("gemini_bp", __name__)

@gemini_bp.route("/generate-gemini", methods=["POST"])
def generate_gemini():
    db_session = TaskSessionLocal()
    try:
        user_prompt = request.json.get("prompt")
        prompt, today_str = build_prompt(user_prompt)

        data = call_gemini(prompt)
        if "candidates" not in data or not data["candidates"]:
            return jsonify({"error": "No content returned from Gemini", "raw": data}), 500

        text_output = get_text_from_candidate(data["candidates"][0])
        if not text_output:
            return jsonify({"error": "Gemini returned empty text", "raw_data": data}), 500

        clean_text = extract_json(text_output)
        if not clean_text:
            return jsonify({"error": "Failed to extract JSON", "raw_output": text_output}), 500

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

        return jsonify(created_task.to_dict()), 201

    except requests.RequestException as req_err:
        return jsonify({"error": "Request to Gemini failed", "details": str(req_err)}), 500
    except Exception as e:
        db_session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()
