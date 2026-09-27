package com.example.smarttodo.service;

import com.example.smarttodo.dto.TodoRequest;
import com.example.smarttodo.exception.ResourceNotFoundException;
import com.example.smarttodo.model.Todo;
import com.example.smarttodo.model.User;
import com.example.smarttodo.repository.TodoRepository;
import com.example.smarttodo.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TodoService {
    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    public TodoService(TodoRepository todoRepository, UserRepository userRepository) {
        this.todoRepository = todoRepository;
        this.userRepository = userRepository;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public Todo create(String email, TodoRequest request) {
        User user = getUser(email);
        Todo todo = new Todo(request.title(), request.description(), request.completed(), user);
        return todoRepository.save(todo);
    }

    @Transactional(readOnly = true)
    public Page<Todo> getTodos(String email, String keyword, Boolean completed, Pageable pageable) {
        User user = getUser(email);
        return todoRepository.searchAndFilter(user, keyword, completed, pageable);
    }

    @Transactional(readOnly = true)
    public Todo getById(String email, Long id) {
        User user = getUser(email);
        return todoRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found"));
    }

    @Transactional
    public Todo update(String email, Long id, TodoRequest request) {
        Todo todo = getById(email, id);
        todo.setTitle(request.title());
        todo.setDescription(request.description());
        todo.setCompleted(request.completed());
        return todoRepository.save(todo);
    }

    @Transactional
    public void delete(String email, Long id) {
        Todo todo = getById(email, id);
        todoRepository.delete(todo);
    }
}
