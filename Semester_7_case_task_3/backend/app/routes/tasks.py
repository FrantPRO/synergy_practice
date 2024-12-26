from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import datetime

from ..models import Task, db

tasks_blueprint = Blueprint('tasks', __name__)


@tasks_blueprint.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    tasks = Task.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'due_date': task.due_date.strftime(
            '%Y-%m-%d') if task.due_date else None
    } for task in tasks]), 200


@tasks_blueprint.route('/tasks/<int:task_id>', methods=['GET'])
@jwt_required()
def get_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return jsonify({'error': 'Task not found'}), 404

    return jsonify({
        'id': task.id,
        'title': task.title,
        'description': task.description,
        'due_date': task.due_date.strftime(
            '%Y-%m-%d') if task.due_date else None
    }), 200


@tasks_blueprint.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.json
    title = data.get('title')
    description = data.get('description')
    due_date = data.get('due_date')

    if not title:
        return jsonify({'error': 'Title is required'}), 400

    new_task = Task(
        title=title,
        description=description,
        due_date=datetime.datetime.strptime(due_date,
                                            '%Y-%m-%d') if due_date else None,
        user_id=user_id
    )
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task created successfully'}), 201


@tasks_blueprint.route('/tasks/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return jsonify({'error': 'Task not found'}), 404

    data = request.json
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.due_date = datetime.datetime.strptime(data.get('due_date'),
                                               '%Y-%m-%d') if data.get(
        'due_date') else task.due_date
    db.session.commit()
    return jsonify({'message': 'Task updated successfully'}), 200


@tasks_blueprint.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()

    if not task:
        return jsonify({'error': 'Task not found'}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted successfully'}), 200
