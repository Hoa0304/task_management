from flask import Blueprint, request, jsonify, session

from task_management_backend.app.models import User
from task_management_backend.app.database import UserSessionLocal

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    db_user = UserSessionLocal()
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = db_user.query(User).filter(User.email == email).first()
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid credentials"}), 401

        session["id"] = user.id
        return jsonify(user.to_dict())
    finally:
        db_user.close()

@auth_bp.route("/register", methods=["POST"])
def register():
    db_user = UserSessionLocal()
    try:
        data = request.get_json()
        email = data.get("email")
        name = data.get("name")
        password = data.get("password")

        if db_user.query(User).filter(User.name == name).first():
            return jsonify({"error": "Name already exists"}), 400
        if db_user.query(User).filter(User.email == email).first():
            return jsonify({"error": "Email already exists"}), 400

        new_user = User(name=name, email=email)
        new_user.set_password(password)
        db_user.add(new_user)
        db_user.commit()
        db_user.refresh(new_user)
        return jsonify(new_user.to_dict()), 201
    finally:
        db_user.close()

@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.pop("id", None)
    return jsonify({"message": "Logged out"})
