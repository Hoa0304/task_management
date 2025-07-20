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
        name = data.get("name")
        password = data.get("password")

        if db_user.query(User).filter(User.name == name).first():
            return jsonify({"error": "name already exists"}), 400
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

@app.route("/api/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    db_user = UserSessionLocal()
    try:
        user = db_user.query(User).filter(User.id == user_id).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        return jsonify(user.to_dict())
    finally:
        db_user.close()


@app.route("/api/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    db_user = UserSessionLocal()
    try:
        data = request.get_json()
        user = db_user.query(User).filter(User.id == user_id).first()
        if not user:
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

@app.route("/api/users", methods=["GET"])
def get_all_users():
    db = UserSessionLocal()
    try:
        users = db.query(User).all()
        return jsonify([user.to_dict() for user in users])
    finally:
        db.close()

@app.route("/api/tasks/status/add", methods=["PUT"])
def move_task_to_another_status():
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

@app.route("/api/tasks/status/rollback", methods=["PUT"])
def move_task_to_previous_status():
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

if __name__ == "__main__":
    app.run(debug=True)
