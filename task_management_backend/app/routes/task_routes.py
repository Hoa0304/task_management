import datetime
from flask import Blueprint, request, jsonify
from sqlalchemy.orm import scoped_session

from app.models import Task
from app.database import TaskSessionLocal
from app.services.task_service import TaskService

task_bp = Blueprint("task_bp", __name__)
db = scoped_session(TaskSessionLocal)
task_service = TaskService(db)

def task_to_dict(task: Task):
    return task.to_dict()

@task_bp.route("/all", methods=["GET"])
def get_tasks():
    status = request.args.get("status")
    sort_by = request.args.get("sort_by")
    tasks = task_service.get_tasks(status, sort_by)
    return jsonify(tasks)

@task_bp.route("/<int:task_id>", methods=["GET", "PUT", "DELETE"])
def handle_task(task_id):
    task = task_service.get_task(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404

    if request.method == "GET":
        return jsonify(task.to_dict())

    if request.method == "PUT":
        data = request.json
        updated, err, code = task_service.update_task(task_id, data)
        if not updated:
            return jsonify(err), code
        return jsonify(updated.to_dict()), 200

    if request.method == "DELETE":
        success, err, code = task_service.delete_task(task_id)
        if not success:
            return jsonify(err), code
        return jsonify({"message": "Task deleted"}), 200


@task_bp.route("/add", methods=["POST"])
def create_task():
    db_session = TaskSessionLocal()
    try:
        new_task_data = request.get_json() or {}
        result, status = task_service.create_task_service(db_session, new_task_data)

        if isinstance(result, dict) and "error" in result:
            db_session.rollback()
            return jsonify(result), status

        db_session.commit()
        return jsonify(result.to_dict()), status

    except Exception as e:
        db_session.rollback()
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()

@task_bp.route("/status/add", methods=["PUT"])
def move_task():
    db_session = TaskSessionLocal()
    try:
        data = request.get_json() or {}
        task_id = data.get("task_id")
        new_status = data.get("status")

        result, status = task_service.move_task_service(db_session, task_id, new_status)

        if isinstance(result, dict) and "error" in result:
            db_session.rollback()
            return jsonify(result), status

        return jsonify(result.to_dict()), status
    except Exception as e:
        db_session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()


@task_bp.route("/status/rollback", methods=["PUT"])
def rollback_task():
    db_session = TaskSessionLocal()
    try:
        data = request.get_json() or {}
        task_id = data.get("task_id")

        result, status = task_service.rollback_task_service(db_session, task_id)

        if isinstance(result, dict) and "error" in result:
            db_session.rollback()
            return jsonify(result), status

        return jsonify(result.to_dict()), status
    except Exception as e:
        db_session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()
