package com.example.smarttodo.controller;

import com.example.smarttodo.dto.TodoRequest;
import com.example.smarttodo.model.Todo;
import com.example.smarttodo.service.TodoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/todos")
public class TodoController {
    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @PostMapping
    public ResponseEntity<Todo> create(Authentication authentication,
                                       @Valid @RequestBody TodoRequest request) {
        return ResponseEntity.status(201)
                .body(todoService.create(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<Page<Todo>> getTodos(
            Authentication authentication,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean completed,
            @PageableDefault(size = 5, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(todoService.getTodos(authentication.getName(), search, completed, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Todo> getById(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(todoService.getById(authentication.getName(), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> update(Authentication authentication,
                                       @PathVariable Long id,
                                       @Valid @RequestBody TodoRequest request) {
        return ResponseEntity.ok(todoService.update(authentication.getName(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(Authentication authentication, @PathVariable Long id) {
        todoService.delete(authentication.getName(), id);
        return ResponseEntity.ok(Map.of(
                "status", 200,
                "message", "Todo deleted successfully",
                "todoId", id
        ));
    }
}
