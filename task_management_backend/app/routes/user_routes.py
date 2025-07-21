from flask import Blueprint, request, jsonify, session

from app.models import User
from app.database import UserSessionLocal

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/me", methods=["GET"])
def get_current_user():
    id = session.get("id")
    if not id:
        return jsonify({"error": "Not authenticated"}), 401

    db_user = UserSessionLocal()
    try:
        user = db_user.query(User).filter(User.id == id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict())
    finally:
        db_user.close()

@user_bp.route("/<int:id>", methods=["PUT"])
def update_user(id):
    db_user = UserSessionLocal()
    try:
        data = request.get_json()
        user = db_user.query(User).filter(User.id == id).first()
        if not user:
            print("User not found")
            return jsonify({"error": "User not found"}), 404

        user.name = data.get("name", user.name)
        user.email = data.get("email", user.email)
        user.role = data.get("role", user.role)
        user.avatar = data.get("avatar", user.avatar)

        db_user.commit()
        db_user.refresh(user)
        return jsonify(user.to_dict())
    finally:
        db_user.close()

@user_bp.route("/", methods=["GET"])
def get_all_users():
    db_user = UserSessionLocal()
    try:
        users = db_user.query(User).all()
        return jsonify([u.to_dict() for u in users])
    finally:
        db_user.close()

