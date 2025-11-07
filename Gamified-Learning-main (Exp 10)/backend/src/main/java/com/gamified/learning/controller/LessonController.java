// LessonController.java
package com.gamified.learning.controller;

import com.gamified.learning.dto.ApiResponse;
import com.gamified.learning.model.Lesson;
import com.gamified.learning.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@RequiredArgsConstructor
public class LessonController {
    private final LessonService lessonService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllLessons() {
        try {
            List<Lesson> lessons = lessonService.getAllLessons();
            return ResponseEntity.ok(ApiResponse.success("Lessons fetched successfully", lessons));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getLessonById(@PathVariable String id) {
        try {
            Lesson lesson = lessonService.getLessonById(id);
            return ResponseEntity.ok(ApiResponse.success("Lesson fetched successfully", lesson));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createLesson(@RequestBody Lesson lesson) {
        try {
            Lesson createdLesson = lessonService.createLesson(lesson);
            return ResponseEntity.ok(ApiResponse.success("Lesson created successfully", createdLesson));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}