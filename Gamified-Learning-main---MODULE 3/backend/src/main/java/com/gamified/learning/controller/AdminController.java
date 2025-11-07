// AdminController.java
package com.gamified.learning.controller;

import com.gamified.learning.dto.ApiResponse;
import com.gamified.learning.model.Lesson;
import com.gamified.learning.model.Quest;
import com.gamified.learning.service.AnalyticsService;
import com.gamified.learning.service.LessonService;
import com.gamified.learning.service.QuestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final LessonService lessonService;
    private final QuestService questService;
    private final AnalyticsService analyticsService;

    // Lessons CRUD
    @PostMapping("/lessons")
    public ResponseEntity<ApiResponse> createLesson(@RequestBody Lesson lesson) {
        try {
            Lesson createdLesson = lessonService.createLesson(lesson);
            return ResponseEntity.ok(ApiResponse.success("Lesson created successfully", createdLesson));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/lessons/{id}")
    public ResponseEntity<ApiResponse> updateLesson(@PathVariable String id, @RequestBody Lesson lesson) {
        try {
            Lesson updated = lessonService.updateLesson(id, lesson);
            return ResponseEntity.ok(ApiResponse.success("Lesson updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<ApiResponse> deleteLesson(@PathVariable String id) {
        try {
            lessonService.deleteLesson(id);
            return ResponseEntity.ok(ApiResponse.success("Lesson deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Quests CRUD
    @PostMapping("/quests")
    public ResponseEntity<ApiResponse> createQuest(@RequestBody Quest quest) {
        try {
            Quest createdQuest = questService.createQuest(quest);
            return ResponseEntity.ok(ApiResponse.success("Quest created successfully", createdQuest));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/quests/{id}")
    public ResponseEntity<ApiResponse> updateQuest(@PathVariable String id, @RequestBody Quest quest) {
        try {
            Quest updated = questService.updateQuest(id, quest);
            return ResponseEntity.ok(ApiResponse.success("Quest updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/quests/{id}")
    public ResponseEntity<ApiResponse> deleteQuest(@PathVariable String id) {
        try {
            questService.deleteQuest(id);
            return ResponseEntity.ok(ApiResponse.success("Quest deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Analytics
    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse> getAnalytics() {
        try {
            var analytics = analyticsService.getAnalyticsSummary();
            return ResponseEntity.ok(ApiResponse.success("Analytics fetched successfully", analytics));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
