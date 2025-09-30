from flask import Blueprint, request, jsonify
from task_management_backend.app.database import TaskSessionLocal
import requests
from task_management_backend.app.services.gemini_service import generate_task_from_gemini

gemini_bp = Blueprint("gemini_bp", __name__)

@gemini_bp.route("/generate-gemini", methods=["POST"])
def generate_gemini():
    db_session = TaskSessionLocal()
    try:
        user_prompt = request.json.get("prompt")

        if not user_prompt:
            return jsonify({"error": "Missing prompt"}), 400

        result, status = generate_task_from_gemini(db_session, user_prompt)

        if isinstance(result, dict) and "error" in result:
            db_session.rollback()
            return jsonify(result), status

        return jsonify(result.to_dict()), status

    except requests.RequestException as req_err:
        return jsonify({"error": "Request to Gemini failed", "details": str(req_err)}), 500
    except Exception as e:
        db_session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()
