import React from 'react';
import TodoItem from './TodoItem';
import './TodoList.css';

const TodoList = ({ todos, onToggleTodo, onUpdateTodo, onDeleteTodo }) => {
  if (todos.length === 0) {
    return null;
  }

  return (
    <div className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggleTodo(todo.id)}
          onUpdate={onUpdateTodo}
          onDelete={() => onDeleteTodo(todo.id)}
        />
      ))}
    </div>
  );
};

export default TodoList;