import datetime
from sqlalchemy.orm import scoped_session
from task_management_backend.app.models import Task
from task_management_backend.app.helpers import VALID_STATUSES, task_to_dict
from task_management_backend.app.database import insert_task

class TaskService:
    def __init__(self, db: scoped_session):
        self.db = db

    def get_tasks(self, status=None, sort_by=None):
        query = self.db.query(Task)
        if status:
            query = query.filter(Task.status == status)
        if sort_by == "due_date":
            query = query.order_by(Task.due_date)
        return [task_to_dict(task) for task in query.all()]

    def get_task(self, task_id: int):
        return self.db.query(Task).filter(Task.id == task_id).first()

    def update_task(self, task_id: int, data: dict):
        task = self.get_task(task_id)
        if not task:
            return None, {"error": "Task not found"}, 404

        try:
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

            self.db.commit()
            self.db.refresh(task)
            return task, None, 200
        except Exception as e:
            self.db.rollback()
            return None, {"error": str(e)}, 500

    def delete_task(self, task_id: int):
        task = self.get_task(task_id)
        if not task:
            return None, {"error": "Task not found"}, 404

        self.db.delete(task)
        self.db.commit()
        return True, None, 200

    def create_task_service(db_session, task_data: dict):
        # Validate required fields
        if not task_data.get("title"):
            return {"error": "Title is required"}, 400
        if not task_data.get("status"):
            return {"error": "Status is required"}, 400

        # Handle due_date if provided
        if "due_date" in task_data and task_data["due_date"]:
            if isinstance(task_data["due_date"], str):
                try:
                    date_obj = datetime.datetime.strptime(
                        task_data["due_date"], "%Y-%m-%d"
                    ).date()
                    task_data["due_date"] = date_obj
                except ValueError:
                    return {"error": "Invalid date format. Use YYYY-MM-DD."}, 400

        # Insert new task
        created_task = insert_task(db_session, task_data)
        return created_task, 201

    VALID_STATUSES = ["Backlog", "To Do", "In Progress", "Review", "Done"]

    def move_task_service(db_session, task_id: int, new_status: str):
        if not task_id or not new_status:
            return {"error": "Missing task_id or status"}, 400

        if new_status not in VALID_STATUSES:
            return {"error": "Invalid status"}, 400

        task = db_session.query(Task).filter(Task.id == task_id).first()
        if not task:
            return {"error": "Task not found"}, 404

        task.status = new_status
        db_session.commit()
        db_session.refresh(task)
        return task, 200


    def rollback_task_service(db_session, task_id: int):
        if not task_id:
            return {"error": "Missing task_id"}, 400

        status_order = VALID_STATUSES.copy()
        task = db_session.query(Task).filter(Task.id == task_id).first()
        if not task:
            return {"error": "Task not found"}, 404

        try:
            current_index = status_order.index(task.status)
            if current_index == 0:
                return {"error": "Task is already in the first status"}, 400

            new_status = status_order[current_index - 1]
            task.status = new_status
            db_session.commit()
            db_session.refresh(task)
            return task, 200
        except ValueError:
            return {"error": "Invalid task status"}, 400
