from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Task, User
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# TASK DATABASE
TASK_DB_URL = f"sqlite:///{os.path.join(BASE_DIR, 'tasks.db')}"
task_engine = create_engine(TASK_DB_URL, connect_args={"check_same_thread": False})
TaskSessionLocal = sessionmaker(bind=task_engine)

# USER DATABASE
USER_DB_URL = f"sqlite:///{os.path.join(BASE_DIR, 'users.db')}"
user_engine = create_engine(USER_DB_URL, connect_args={"check_same_thread": False})
UserSessionLocal = sessionmaker(bind=user_engine)

def init_db():
    Base.metadata.create_all(bind=task_engine)
    Base.metadata.create_all(bind=user_engine)

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

def insert_user(db, user_data):
    user = User(
        name=user_data["name"],
        email=user_data["email"],
        role=user_data.get("role"),
        avatar=user_data.get("avatar"),
    )
    user.set_password(user_data["password"])
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def update_user(db, user_id, user_data):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    user.name = user_data.get("name", user.name)
    user.email = user_data.get("email", user.email)
    user.role = user_data.get("role", user.role)
    user.avatar = user_data.get("avatar", user.avatar)

    db.commit()
    db.refresh(user)
    return user

def get_user(db, user_id):
    return db.query(User).filter(User.id == user_id).first()
