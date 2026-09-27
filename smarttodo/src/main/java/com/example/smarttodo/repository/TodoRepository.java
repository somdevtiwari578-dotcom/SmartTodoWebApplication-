package com.example.smarttodo.repository;

import com.example.smarttodo.model.Todo;
import com.example.smarttodo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    @Query("""
            SELECT t FROM Todo t
            WHERE t.user = :user
              AND (:keyword IS NULL OR :keyword = ''
                   OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(COALESCE(t.description, '')) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:completed IS NULL OR t.completed = :completed)
            """)
    Page<Todo> searchAndFilter(
            @Param("user") User user,
            @Param("keyword") String keyword,
            @Param("completed") Boolean completed,
            Pageable pageable
    );

    Optional<Todo> findByIdAndUser(Long id, User user);
}
