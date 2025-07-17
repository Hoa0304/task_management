# 📝 Task Management Backend (Flask API)

This is the **backend** for the Task Management WebApp, built with **Python Flask**. It provides a RESTful API to manage tasks including creating, retrieving, updating, and deleting tasks.

## 📁 Project Structure

task_management_backend/
│
├── app/
│ ├── init.py # Flask app factory
│ ├── models/
│ │ └── task.py # SQLAlchemy Task model
│ ├── routes/
│ │ └── tasks.py # API routes for task CRUD
│ └── config/
│ └── config.py # Configuration (e.g., DB URI)
│
├── app.py # App entry point
├── requirements.txt # Python dependencies
└── .env # Environment variables

yaml
Sao chép
Chỉnh sửa

---

## 🚀 Features

- ✅ Create, view, update, and delete tasks
- ✅ SQLite database (PostgreSQL ready for production)
- ✅ CORS support for frontend integration
- ✅ Environment-based configuration
- 🛡️ Input validation & sanitization (coming soon)
- 🔐 Optional JWT authentication (coming soon)

---

## 🧪 Requirements

- Python 3.8+
- pip

---

## ⚙️ Setup Instructions

### 1. Clone the repository


```bash

git clone https://github.com/Hoa0304/task_management
cd task_management_backend
python -m venv venv
source venv/bin/activate    # macOS/Linux
venv\Scripts\activate       # Windows
pip install -r requirements.txt

```
