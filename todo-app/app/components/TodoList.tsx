"use client";
import React, { useState, useEffect } from 'react';
import '../styles/TodoList.css';
import axios from 'axios';

interface Todo {
  id: number;
  task: string;
  done: boolean;
}

const apiUrl = 'http://127.0.0.1:5000/todos'; // Flask API URL

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');

  // Fetch todos from Flask API
  useEffect(() => {
    const fetchTodos = async () => {
      const response = await axios.get(apiUrl);
      setTodos(response.data);
    };
    fetchTodos();
  }, []);

  // Add a new todo
  const addTodo = async () => {
    if (!newTask.trim()) return;

    const response = await axios.post(apiUrl, { task: newTask });
    setTodos([...todos, response.data]);
    setNewTask('');
  };

  // Toggle completion of a todo
  const toggleTodo = async (id: number, done: boolean) => {
    const updatedTodo = { done: !done };
    const response = await axios.put(`${apiUrl}/${id}`, updatedTodo);
    setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
  };

  // Delete a todo
  const deleteTodo = async (id: number) => {
    await axios.delete(`${apiUrl}/${id}`);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>
      <div className="todo-form">
        <input
          type="text"
          placeholder="Enter a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTodo}>Add Task</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className={todo.done ? 'completed' : ''}>
            <span>{todo.task}</span>
            <button onClick={() => toggleTodo(todo.id, todo.done)}>
              {todo.done ? 'Undo' : 'Done'}
            </button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;