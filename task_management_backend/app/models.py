from sqlalchemy import Column, Integer, String, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from werkzeug.security import generate_password_hash, check_password_hash

Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)    # Optional
    status = Column(String(50), nullable=True)   # Optional
    due_date = Column(String(20), nullable=True) # Optional
    category = Column(String(100), nullable=True) 
    cover = Column(String(255), nullable=True)   # Optional
    members = Column(JSON, nullable=True)        # Optional
    completed = Column(Integer, default=0)       # Optional,
    total = Column(Integer, default=8)           # Optional,
    priority = Column(String(50), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "due_date": self.due_date,
            "category": self.category,
            "cover": self.cover,
            "members": self.members,
            "completed": self.completed,
            "total": self.total,
            "priority": self.priority,
        }

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    role = Column(String(50))
    avatar = Column(String(255))

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "avatar": self.avatar,
        }
