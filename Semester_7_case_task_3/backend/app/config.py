import os

class Config:
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    PARENT_DIR = os.path.abspath(os.path.dirname(BASE_DIR))
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(PARENT_DIR, 'instance', 'tasks.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'supersecretkey'  # Change in production
