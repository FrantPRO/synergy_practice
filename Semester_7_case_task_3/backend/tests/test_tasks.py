import pytest
from backend.app import create_app, db, bcrypt
from backend.app.models import User


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'

    with app.app_context():
        db.create_all()

        hashed_password = bcrypt.generate_password_hash('testpassword').decode('utf-8')
        user = User(username='testuser', password=hashed_password)
        db.session.add(user)
        db.session.commit()

        yield app.test_client()

        db.session.remove()
        db.drop_all()


def get_auth_token(client):
    """Helper function to get JWT token for the test user."""
    response = client.post('/login', json={
        'username': 'testuser',
        'password': 'testpassword'
    })
    return response.json['access_token']


def test_create_task(client):
    token = get_auth_token(client)

    response = client.post('/tasks', json={
        'title': 'Test Task',
        'description': 'This is a test task.',
        'due_date': '2024-12-31'
    }, headers={'Authorization': f'Bearer {token}'})

    assert response.status_code == 201
    assert response.json['message'] == 'Task created successfully'


def test_get_tasks(client):
    token = get_auth_token(client)

    client.post('/tasks', json={
        'title': 'Test Task',
        'description': 'This is a test task.',
        'due_date': '2024-12-31'
    }, headers={'Authorization': f'Bearer {token}'})

    response = client.get('/tasks',
                          headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]['title'] == 'Test Task'


def test_unauthorized_access(client):
    response = client.get('/tasks')
    assert response.status_code == 401
    assert response.json['msg'] == 'Missing Authorization Header'
