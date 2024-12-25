import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    if os.getenv("FLASK_ENV") == "test":
        app.config.from_object('backend.app.config.Config')  # Для тестов
    else:
        app.config.from_object('app.config.Config')  # Для запуска приложения

    bcrypt.init_app(app)  # Привязываем Bcrypt к приложению
    jwt.init_app(app)  # Привязываем JWT к приложению
    db.init_app(app)  # Привязываем SQLAlchemy к приложению

    from .models import User, Task

    from .routes.auth import auth_blueprint
    from .routes.tasks import tasks_blueprint

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(tasks_blueprint)

    with app.app_context():
        db.create_all()

    return app
