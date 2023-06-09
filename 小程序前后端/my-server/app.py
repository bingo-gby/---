from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


import random

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(255), nullable=False)
    is_completed = db.Column(db.Boolean, default=False)

@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    task = Task(content=data['content'])
    db.session.add(task)
    db.session.commit()
    return jsonify({'message': 'Task added successfully!'})

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.filter_by(is_completed=False).all()
    completed_tasks = Task.query.filter_by(is_completed=True).all()
    return jsonify({
        'tasks': [{'id': task.id, 'content': task.content} for task in tasks],
        'completed_tasks': [{'id': task.id, 'content': task.content} for task in completed_tasks]
    })

@app.route('/tasks/random', methods=['GET'])
def get_random_task():
    tasks = Task.query.filter_by(is_completed=False).all()
    if tasks:
        random_task = random.choice(tasks)
        return jsonify({'id': random_task.id, 'content': random_task.content})
    else:
        return jsonify({'error': 'No tasks available'})

@app.route('/tasks/<int:task_id>/complete', methods=['PUT'])
def complete_task(task_id):
    task = Task.query.get(task_id)
    if task:
        task.is_completed = True
        db.session.commit()
        return jsonify({'message': 'Task marked as completed!'})
    else:
        return jsonify({'error': 'Task not found'})

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

@app.route('/users', methods=['POST'])
def add_user():
    data = request.get_json()
    user = User(name=data['name'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User added successfully!'})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
