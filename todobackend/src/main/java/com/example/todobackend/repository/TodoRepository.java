package com.example.todobackend.repository;

import com.example.todobackend.model.Todo;
import com.example.todobackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    
    List<Todo> findByUser(User user);
    List<Todo> findByUserAndCompleted(User user, Boolean completed);
    
    @Query("SELECT t FROM Todo t WHERE t.user = :user AND t.dueDate < :now AND t.completed = false")
    List<Todo> findOverdueTodosByUser(@Param("user") User user, @Param("now") LocalDateTime now);
    
    @Query("SELECT t FROM Todo t WHERE t.user = :user AND DATE(t.dueDate) = DATE(:date) AND t.completed = false")
    List<Todo> findTodosDueTodayByUser(@Param("user") User user, @Param("date") LocalDateTime date);
}
