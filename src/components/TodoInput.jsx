import React, { useState } from 'react';
import './TodoInput.css';

const TodoInput = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(text.trim(), dueDate || null);
      setText('');
      setDueDate('');
      setShowDatePicker(false);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const clearDate = () => {
    setDueDate('');
    setShowDatePicker(false);
  };

  return (
    <div className="todo-input-container">
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
          />
          
          <div className="input-actions">
            <button
              type="button"
              onClick={toggleDatePicker}
              className={`date-toggle-btn ${dueDate ? 'has-date' : ''}`}
              title="Set due date"
            >
              📅
            </button>
            
            <button
              type="submit"
              className="add-btn"
              disabled={!text.trim()}
            >
              Add
            </button>
          </div>
        </div>
        
        {showDatePicker && (
          <div className="date-picker-container">
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="date-input"
              min={new Date().toISOString().slice(0, 16)}
            />
            {dueDate && (
              <button
                type="button"
                onClick={clearDate}
                className="clear-date-btn"
                title="Clear date"
              >
                ✕
              </button>
            )}
          </div>
        )}
        
        {dueDate && (
          <div className="due-date-preview">
            Due: {new Date(dueDate).toLocaleString()}
          </div>
        )}
      </form>
    </div>
  );
};

export default TodoInput;