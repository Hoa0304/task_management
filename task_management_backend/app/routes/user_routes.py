from flask import Blueprint, request, jsonify, session
from sqlalchemy.orm import scoped_session
from app.models import Task, User
from app.database import TaskSessionLocal, UserSessionLocal
from app.routes.task_routes import db as db_task 

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
    db_task = TaskSessionLocal()

    try:
        data = request.get_json()
        user = db_user.query(User).filter(User.id == id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        old_name = user.name
        old_avatar = user.avatar

        user.name = data.get("name", user.name)
        user.email = data.get("email", user.email)
        user.role = data.get("role", user.role)
        user.avatar = data.get("avatar", user.avatar)

        # Update tasks where this user is a member
        if user.name != old_name or user.avatar != old_avatar:
            tasks = db_task.query(Task).filter(Task.members != None).all()
            for task in tasks:
                members_updated = False
                members = task.members if task.members else []
                new_members = []
                for member in members:
                    if member.get("id") == user.id:
                        member["name"] = user.name
                        member["avatar"] = user.avatar
                        members_updated = True
                    new_members.append(member)
                if members_updated:
                    task.members = new_members
                    db_task.add(task)  # Ensure the task is marked for update
            db_task.commit()

        db_user.commit()
        db_user.refresh(user)

        return jsonify(user.to_dict())

    except Exception as e:
        db_user.rollback()
        db_task.rollback()
        print(f"Error updating user or tasks: {e}")
        return jsonify({"error": "Internal server error"}), 500

    finally:
        db_user.close()
        db_task.close()

@user_bp.route("/", methods=["GET"])
def get_all_users():
    db_user = UserSessionLocal()
    try:
        users = db_user.query(User).all()
        return jsonify([u.to_dict() for u in users])
    finally:
        db_user.close()

