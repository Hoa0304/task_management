from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy.orm import scoped_session
from datetime import datetime

from models import Task, User
from database import TaskSessionLocal, UserSessionLocal, init_db, insert_task

app = Flask(__name__)
CORS(app)

init_db()
db = scoped_session(TaskSessionLocal)


def task_to_dict(task: Task):
    return task.to_dict()


@app.route("/api/tasks", methods=["GET"])
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


@app.route("/api/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task_to_dict(task))


@app.route("/api/tasks", methods=["POST"])
def create_task():
    db_session = TaskSessionLocal()
    try:
        new_task_data = request.get_json()

        if 'due_date' in new_task_data and isinstance(new_task_data['due_date'], str):
            try:
                date_obj = datetime.strptime(new_task_data['due_date'], "%Y-%m-%d").date()
                new_task_data['due_date'] = date_obj.isoformat()
            except ValueError:
                return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

        created_task = insert_task(db_session, new_task_data)
        return jsonify(created_task.to_dict()), 201
    except Exception as e:
        db_session.rollback()
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        db_session.close()


@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
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


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.delete(task)
    db.commit()
    return jsonify({"message": "Task deleted successfully."})

@app.route("/api/login", methods=["POST"])
def login():
    db_user = UserSessionLocal()
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        user = db_user.query(User).filter(User.email == email).first()
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid credentials"}), 401

        return jsonify(user.to_dict())
    finally:
        db_user.close()


@app.route("/api/register", methods=["POST"])
def register():
    db_user = UserSessionLocal()
    try:
        data = request.get_json()
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")

        if db_user.query(User).filter(User.username == username).first():
            return jsonify({"error": "Username already exists"}), 400
        if db_user.query(User).filter(User.email == email).first():
            return jsonify({"error": "Email already exists"}), 400

        new_user = User(username=username, email=email)
        new_user.set_password(password)
        db_user.add(new_user)
        db_user.commit()
        db_user.refresh(new_user)
        return jsonify(new_user.to_dict()), 201
    finally:
        db_user.close()

if __name__ == "__main__":
    app.run(debug=True)
