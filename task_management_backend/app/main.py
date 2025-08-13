from flask import Flask
from flask_cors import CORS
from app.routes.task_routes import task_bp
from app.routes.user_routes import user_bp
from app.routes.auth_routes import auth_bp
from app.routes.gemini_routes import gemini_bp
from app.database import init_db

app = Flask(__name__)
app.secret_key = "a89b16c6439d92c5fd0f74992d9a42dc0ff64519772c9a3fa41bc7f2a65f7a4e"
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])

init_db()

app.register_blueprint(task_bp, url_prefix="/api/tasks")
app.register_blueprint(user_bp, url_prefix="/api/users")
app.register_blueprint(auth_bp, url_prefix="/api")
app.register_blueprint(gemini_bp, url_prefix="/api/gemini")

if __name__ == "__main__":
    app.run(debug=True)
