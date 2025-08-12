import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import { useFetch } from '../hooks/useFetch';
import './TodoApp.css';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { get, post, put, delete: deleteTodo } = useFetch();

  // Load todos on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await get('/todos');
      setTodos(data || []);
    } catch (error) {
      console.error('Error loading todos:', error);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text, dueDate = null) => {
    try {
      const newTodo = {
        text,
        completed: false,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      };
      
      const savedTodo = await post('/todos', newTodo);
      setTodos(prevTodos => [...prevTodos, savedTodo]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = {
        ...todo,
        completed: !todo.completed,
      };

      const savedTodo = await put(`/todos/${id}`, updatedTodo);
      setTodos(prevTodos =>
        prevTodos.map(t => t.id === id ? savedTodo : t)
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const updateTodo = async (id, text, dueDate = null) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = {
        ...todo,
        text,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      };

      const savedTodo = await put(`/todos/${id}`, updatedTodo);
      setTodos(prevTodos =>
        prevTodos.map(t => t.id === id ? savedTodo : t)
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodoItem = async (id) => {
    try {
      await deleteTodo(`/todos/${id}`);
      setTodos(prevTodos => prevTodos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const clearCompleted = async () => {
    try {
      await deleteTodo('/todos/clear-completed');
      setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
    } catch (error) {
      console.error('Error clearing completed todos:', error);
    }
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your todos...</p>
      </div>
    );
  }

  return (
    <div className="todo-app">
      <Navigation
        filter={filter}
        setFilter={setFilter}
        clearCompleted={clearCompleted}
        completedCount={completedCount}
        totalCount={totalCount}
      />
      
      <main className="main-content">
        <div className="todo-container">
          <TodoInput onAddTodo={addTodo} />
          <TodoList
            todos={getFilteredTodos()}
            onToggleTodo={toggleTodo}
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodoItem}
          />
          
          {todos.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No todos yet</h3>
              <p>Add your first todo above to get started!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TodoApp;