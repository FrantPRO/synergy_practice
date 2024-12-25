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
    app.config.from_object('backend.config.Config')

    bcrypt.init_app(app)  # Привязываем Bcrypt к приложению
    jwt.init_app(app)  # Привязываем JWT к приложению
    db.init_app(app)  # Привязываем SQLAlchemy к приложению

    from app.models import User, Task

    from app.routes.auth import auth_blueprint
    from app.routes.tasks import tasks_blueprint

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(tasks_blueprint)

    with app.app_context():
        db.create_all()

    return app
