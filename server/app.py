from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from flask_cors import CORS  # Import CORS

# Initialize the app
app = Flask(__name__)

# Enable CORS for all domains (you can configure it for specific domains if needed)
CORS(app)

# Configure database
file_path = os.path.abspath(os.getcwd()) + "/todo.db"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + file_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Create a Todo model
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(200), nullable=False)
    done = db.Column(db.Boolean, default=False)

# Create the database if not exists
if not os.path.exists(file_path):
    with app.app_context():
        db.create_all()

# Route to get all todos
@app.route('/todos', methods=['GET'])
def get_todos():
    todos = Todo.query.all()
    return jsonify([{'id': todo.id, 'task': todo.task, 'done': todo.done} for todo in todos])

# Route to add a new todo
@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    new_task = Todo(task=data['task'])
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'id': new_task.id, 'task': new_task.task, 'done': new_task.done})

# Route to update the task status
@app.route('/todos/<int:id>', methods=['PUT'])
def update_todo(id):
    data = request.get_json()
    todo = Todo.query.get_or_404(id)
    todo.done = data['done']
    db.session.commit()
    return jsonify({'id': todo.id, 'task': todo.task, 'done': todo.done})

# Route to delete a todo
@app.route('/todos/<int:id>', methods=['DELETE'])
def delete_todo(id):
    todo = Todo.query.get_or_404(id)
    db.session.delete(todo)
    db.session.commit()
    return '', 204

# Run the app
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)