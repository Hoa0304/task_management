from sqlalchemy import Column, Integer, String, Text, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    description = Column(Text)
    status = Column(String(50))
    due_date = Column(String(20))
    category = Column(String(100))
    cover = Column(String(255))
    members = Column(JSON)
    completed = Column(Integer)
    total = Column(Integer)
    priority = Column(String(50))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "dueDate": self.due_date,
            "category": self.category,
            "cover": self.cover,
            "members": self.members,
            "completed": self.completed,
            "total": self.total,
            "priority": self.priority,
        }
