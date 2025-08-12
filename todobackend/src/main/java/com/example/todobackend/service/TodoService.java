package com.example.todobackend.service;

import com.example.todobackend.model.Todo;
import com.example.todobackend.model.User;
import com.example.todobackend.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TodoService {
    
    @Autowired
    private TodoRepository todoRepository;
    
    public List<Todo> getAllTodosForUser(User user) {
        return todoRepository.findByUser(user);
    }
    
    public Optional<Todo> getTodoByIdForUser(Long id, User user) {
        return todoRepository.findById(id)
                .filter(todo -> todo.getUser().equals(user));
    }
    
    public Todo createTodoForUser(Todo todo, User user) {
        todo.setUser(user);
        todo.setCreatedAt(LocalDateTime.now());
        return todoRepository.save(todo);
    }
    
    public Todo updateTodoForUser(Long id, Todo todoDetails, User user) {
        Todo todo = todoRepository.findById(id)
                .filter(t -> t.getUser().equals(user))
                .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
        
        todo.setText(todoDetails.getText());
        todo.setCompleted(todoDetails.getCompleted());
        todo.setDueDate(todoDetails.getDueDate());
        todo.setUpdatedAt(LocalDateTime.now());
        
        return todoRepository.save(todo);
    }
    
    public void deleteTodoForUser(Long id, User user) {
        Todo todo = todoRepository.findById(id)
                .filter(t -> t.getUser().equals(user))
                .orElseThrow(() -> new RuntimeException("Todo not found with id: " + id));
        
        todoRepository.delete(todo);
    }
    
    public List<Todo> getCompletedTodosForUser(User user) {
        return todoRepository.findByUserAndCompleted(user, true);
    }
    
    public List<Todo> getActiveTodosForUser(User user) {
        return todoRepository.findByUserAndCompleted(user, false);
    }
    
    public List<Todo> getOverdueTodosForUser(User user) {
        return todoRepository.findOverdueTodosByUser(user, LocalDateTime.now());
    }
    
    public List<Todo> getTodosDueTodayForUser(User user) {
        return todoRepository.findTodosDueTodayByUser(user, LocalDateTime.now());
    }
    
    public void clearCompletedTodosForUser(User user) {
        List<Todo> completedTodos = todoRepository.findByUserAndCompleted(user, true);
        todoRepository.deleteAll(completedTodos);
    }
}
