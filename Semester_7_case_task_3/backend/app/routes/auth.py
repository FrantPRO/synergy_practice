from flask import Blueprint, request, jsonify
from flask_bcrypt import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import datetime

from ..models import User
from .. import bcrypt, db

auth_blueprint = Blueprint('auth', __name__)


@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    # Проверяем, существует ли пользователь с таким именем
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify(
            {'error': 'Username already exists'}), 409  # HTTP 409 Conflict

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()  # Откат изменений в случае ошибки
        return jsonify({'error': str(e)}), 500


@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    # Преобразуем user.id в строку
    access_token = create_access_token(identity=str(user.id),
                                       expires_delta=datetime.timedelta(
                                           hours=1))
    return jsonify({'access_token': access_token}), 200

@auth_blueprint.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    identity = get_jwt_identity()
    if identity:
        return jsonify({"message": "Logged out successfully"}), 200
    return jsonify({"error": "Unauthorized"}), 401
