import React, { useState } from 'react';
import './TodoItem.css';

const TodoItem = ({ todo, onToggle, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDueDate, setEditDueDate] = useState(
    todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 16) : ''
  );

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText.trim(), editDueDate || null);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 16) : '');
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const isOverdue = () => {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  };

  const isDueToday = () => {
    if (!todo.dueDate || todo.completed) return false;
    const today = new Date();
    const dueDate = new Date(todo.dueDate);
    return (
      dueDate.toDateString() === today.toDateString() &&
      dueDate > today
    );
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return `Due today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Due tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return `Due ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue() ? 'overdue' : ''} ${isDueToday() ? 'due-today' : ''}`}>
      <div className="todo-content">
        <button
          className="toggle-btn"
          onClick={onToggle}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed ? '✓' : '○'}
        </button>

        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyPress}
              className="edit-input"
              autoFocus
            />
            <input
              type="datetime-local"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="edit-date-input"
              min={new Date().toISOString().slice(0, 16)}
            />
            <div className="edit-actions">
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={handleCancel} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="todo-info">
            <span className="todo-text">{todo.text}</span>
            {todo.dueDate && (
              <div className={`due-date ${isOverdue() ? 'overdue' : ''} ${isDueToday() ? 'due-today' : ''}`}>
                {formatDueDate(todo.dueDate)}
              </div>
            )}
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="todo-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="edit-btn"
            aria-label="Edit todo"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="delete-btn"
            aria-label="Delete todo"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoItem;