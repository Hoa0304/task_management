from flask import Flask, request, jsonify, abort
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

sample_tasks = [
    {
        "id": 1,
        "title": "Create styleguide foundation",
        "description": "Create content for peceland App",
        "status": "Backlog",
        "due_date": "2021-08-20",
        "category": "Design",
        "cover": "/images/stylebg.png",
        "members": [
            {"name": "Alice", "avatar": "/icons/logo.svg"},
            {"name": "Bob", "avatar": "/icons/logo.svg"},
            {"name": "Eve", "avatar": "/icons/logo.svg"}
        ],
        "completed": 0,
        "total": 8,
        "priority": "High"
    },
    {
        "id": 355,
        "title": "auditing information architecture",
        "description": "Create content for peceland App",
        "status": "To Do",
        "due_date": "2021-08-20",
        "category": "Research",
        "members": [
            {"name": "Alice", "avatar": "/icons/logo.svg"},
            {"name": "Bob", "avatar": "/icons/logo.svg"},
            {"name": "Eve", "avatar": "/icons/logo.svg"}
        ],
        "completed": 0,
        "total": 8,
        "priority": "Medium"
    },
    {
        "id": 2,
        "title": "Update support documentation",
        "description": "Create content for peceland App",
        "status": "To Do",
        "due_date": "2021-08-20",
        "category": "Content",
        "cover": "/images/doc.png",
        "members": [
            {"name": "Alice", "avatar": "/icons/logo.svg"},
            {"name": "Bob", "avatar": "/icons/logo.svg"},
            {"name": "Eve", "avatar": "/icons/logo.svg"}
        ],
        "completed": 0,
        "total": 8,
        "priority": "Low"
    },
    {
        "id": 3,
        "title": "Create styleguide foundation",
        "description": "Create content for peceland App",
        "status": "Backlog",
        "due_date": "2021-08-20",
        "category": "Planning",
        "cover": "/images/stylebg.png",
        "members": [
            {"name": "Alice", "avatar": "/icons/logo.svg"},
            {"name": "Bob", "avatar": "/icons/logo.svg"},
            {"name": "Eve", "avatar": "/icons/logo.svg"}
        ],
        "completed": 0,
        "total": 8,
        "priority": "Medium"
    },
    {
        "id": 4,
        "title": "Design System",
        "description": "Create content for peceland App",
        "status": "Review",
        "due_date": "2025-08-20",
        "category": "Content",
        "cover": "/images/designbg.png",
        "members": [
            {"name": "Alice", "avatar": "/icons/logo.svg"},
            {"name": "Bob", "avatar": "/icons/logo.svg"},
            {"name": "Eve", "avatar": "/icons/logo.svg"}
        ],
        "completed": 0,
        "total": 8,
        "priority": "Low"
    },
    {
        "id": 5,
        "title": "Create styleguide foundation",
        "description": "Create content for peceland App",
        "status": "In Progress",
        "due_date": "2025-08-20",
        "category": "Content",
        "cover": "/images/stylebg.png",
        "members": [
            {"name": "Alice", "avatar": "/icons/logo.svg"},
            {"name": "Bob", "avatar": "/icons/logo.svg"},
            {"name": "Eve", "avatar": "/icons/logo.svg"}
        ],
        "completed": 0,
        "total": 8,
        "priority": "High"
    },
    {
        "id": 6,
        "title": "Create styleguide foundation",
        "description": "Create content for peceland App",
        "status": "Done",
        "due_date": "2021-08-20",
        "category": "Planning",
        "cover": "/images/stylebg.png",
        "members": [
            {"name": "Alice", "avatar": "/icons/logo.svg"},
            {"name": "Bob", "avatar": "/icons/logo.svg"},
            {"name": "Eve", "avatar": "/icons/logo.svg"}
        ],
        "completed": 0,
        "total": 8,
        "priority": "Medium"
    },
]


@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    status = request.args.get("status")
    sort_by = request.args.get("sort_by")

    tasks = sample_tasks
    if status:
        tasks = [task for task in tasks if task.get("status") == status]

    if sort_by == "due_date":
        tasks = sorted(tasks, key=lambda x: x.get("due_date") or "")

    return jsonify(tasks)


@app.route("/api/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    task = next((t for t in sample_tasks if t["id"] == task_id), None)
    if task is None:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task)


@app.route("/api/tasks", methods=["POST"])
def create_task():
    data = request.json
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()

    if not title or len(title) > 100:
        return jsonify({"error": "Title is required and must be <= 100 characters."}), 400
    if len(description) > 500:
        return jsonify({"error": "Description must be <= 500 characters."}), 400

    new_task = {
        "id": sample_tasks[-1]["id"] + 1 if sample_tasks else 1,
        "title": title,
        "description": description,
        "status": data.get("status", "Backlog"),
        "due_date": data.get("due_date"),
        "category": data.get("category"),
        "cover": data.get("cover"),
        "members": data.get("members", []),
        "completed": data.get("completed", 0),
        "total": data.get("total", 0),
        "priority": data.get("priority"),
    }
    sample_tasks.append(new_task)
    return jsonify(new_task), 201


@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    task = next((t for t in sample_tasks if t["id"] == task_id), None)
    if not task:
        return jsonify({"error": "Task not found."}), 404

    data = request.json
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()

    if title and len(title) > 100:
        return jsonify({"error": "Title must be <= 100 characters."}), 400
    if description and len(description) > 500:
        return jsonify({"error": "Description must be <= 500 characters."}), 400

    task.update({
        "title": title or task["title"],
        "description": description or task["description"],
        "status": data.get("status", task["status"]),
        "due_date": data.get("due_date", task["due_date"]),
        "category": data.get("category", task.get("category")),
        "cover": data.get("cover", task.get("cover")),
        "members": data.get("members", task.get("members")),
        "completed": data.get("completed", task.get("completed")),
        "total": data.get("total", task.get("total")),
        "priority": data.get("priority", task.get("priority")),
    })
    return jsonify(task)


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    global sample_tasks
    task = next((t for t in sample_tasks if t["id"] == task_id), None)
    if not task:
        return jsonify({"error": "Task not found."}), 404
    sample_tasks = [t for t in sample_tasks if t["id"] != task_id]
    return jsonify({"message": "Task deleted successfully."})


if __name__ == "__main__":
    app.run(debug=True)
