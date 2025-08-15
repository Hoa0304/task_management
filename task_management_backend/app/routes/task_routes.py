import datetime
from flask import Blueprint, request, jsonify
from sqlalchemy.orm import scoped_session

from app.models import Task
from app.database import TaskSessionLocal, insert_task
from app.helpers import VALID_STATUSES, task_to_dict

task_bp = Blueprint("task_bp", __name__)
db = scoped_session(TaskSessionLocal)

@task_bp.route("/all", methods=["GET"])
def get_tasks():
    status = request.args.get("status")
    sort_by = request.args.get("sort_by")

    query = db.query(Task)
    if status:
        query = query.filter(Task.status == status)
    if sort_by == "due_date":
        query = query.order_by(Task.due_date)

    tasks = query.all()
    return jsonify([task_to_dict(task) for task in tasks])

@task_bp.route("/<int:task_id>", methods=["GET", "PUT", "DELETE"])
def handle_task(task_id):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    if request.method == "GET":
        return jsonify(task_to_dict(task))

    if request.method == "PUT":
        try:
            task = db.query(Task).filter(Task.id == task_id).first()
            if not task:
                return jsonify({"error": "Task not found"}), 404

            data = request.json
            task.title = data.get("title", task.title)
            task.description = data.get("description", task.description)
            task.status = data.get("status", task.status)
            task.due_date = data.get("due_date", task.due_date)
            task.category = data.get("category", task.category)
            task.cover = data.get("cover", task.cover)
            task.members = data.get("members", task.members)
            task.completed = data.get("completed", task.completed)
            task.total = data.get("total", task.total)
            task.priority = data.get("priority", task.priority)

            db.commit()
            db.refresh(task)
            return jsonify(task.to_dict())

        except Exception as e:
            db.rollback()
            return jsonify({"error": str(e)}), 500

    if request.method == "DELETE":
        db.delete(task)
        db.commit()
        return jsonify({"message": "Task deleted"})

@task_bp.route("/add", methods=["POST"])
def create_task():
    db_session = TaskSessionLocal()
    try:
        new_task_data = request.get_json() or {}

        # Validate required fields
        if not new_task_data.get("title"):
            return jsonify({"error": "Title is required"}), 400
        if not new_task_data.get("status"):
            return jsonify({"error": "Status is required"}), 400

        # Handle due_date if provided
        if "due_date" in new_task_data and new_task_data["due_date"]:
            if isinstance(new_task_data["due_date"], str):
                try:
                    date_obj = datetime.datetime.strptime(
                        new_task_data["due_date"], "%Y-%m-%d"
                    ).date()
                    new_task_data["due_date"] = date_obj
                except ValueError:
                    return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

        # Insert new task
        created_task = insert_task(db_session, new_task_data)
        db_session.commit()
        return jsonify(created_task.to_dict()), 201

    except Exception as e:
        db_session.rollback()
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()

@task_bp.route("/status/add", methods=["PUT"])
def move_task():
    data = request.get_json()
    task_id = data.get("task_id")
    new_status = data.get("status")

    if not task_id or not new_status:
        return jsonify({"error": "Missing task_id or status"}), 400

    valid_statuses = ["Backlog", "To Do", "In Progress", "Review", "Done"]
    if new_status not in valid_statuses:
        return jsonify({"error": "Invalid status"}), 400

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    task.status = new_status
    db.commit()
    db.refresh(task)

    return jsonify(task.to_dict()), 200

@task_bp.route("/status/rollback", methods=["PUT"])
def rollback_task():
    data = request.get_json()
    task_id = data.get("task_id")

    if not task_id:
        return jsonify({"error": "Missing task_id"}), 400

    status_order = ["Backlog", "To Do", "In Progress", "Review", "Done"]

    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    try:
        current_index = status_order.index(task.status)
        if current_index == 0:
            return jsonify({"error": "Task is already in the first status"}), 400

        new_status = status_order[current_index - 1]
        task.status = new_status
        db.commit()
        db.refresh(task)

        return jsonify(task.to_dict()), 200
    except ValueError:
        return jsonify({"error": "Invalid task status"}), 400
