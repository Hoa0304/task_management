import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Task

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'tasks.db')}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def insert_task(db, task_data):
    mapped_data = {
        "title": task_data.get("title"),
        "description": task_data.get("description"),
        "status": task_data.get("status"),
        "due_date": task_data.get("dueDate"),
        "category": task_data.get("category"),
        "cover": task_data.get("cover"),
        "members": task_data.get("members"),
        "completed": task_data.get("completed"),
        "total": task_data.get("total"),
        "priority": task_data.get("priority"),
    }

    task = Task(**mapped_data)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task
