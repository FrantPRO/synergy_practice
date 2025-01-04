import pytest
from backend.app import create_app, db


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config[
        'SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()


def test_register(client):
    response = client.post('/register', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    assert response.status_code == 201
    assert response.json['message'] == 'User registered successfully'


def test_register_duplicate(client):
    client.post('/register', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    response = client.post('/register', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    assert response.status_code == 409
    assert response.json['error'] == 'Username already exists'


def test_login(client):
    client.post('/register', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json


def test_login_invalid_credentials(client):
    response = client.post('/login', json={
        'username': 'nonexistent',
        'password': 'wrongpassword'
    })
    assert response.status_code == 404
    assert response.json['error'] == 'User not found'
