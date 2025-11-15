// ProgressController.java
package com.gamified.learning.controller;

import com.gamified.learning.dto.ApiResponse;
import com.gamified.learning.model.Progress;
import com.gamified.learning.model.User;
import com.gamified.learning.service.JwtService;
import com.gamified.learning.service.ProgressService;
import com.gamified.learning.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {
    private final ProgressService progressService;
    private final JwtService jwtService;
    private final UserService userService;

    @PostMapping("/lessons/{lessonId}/complete")
    public ResponseEntity<ApiResponse> completeLesson(@PathVariable String lessonId,
                                                      @RequestHeader("Authorization") String tokenHeader) {
        try {
            String userId = extractUserIdFromToken(tokenHeader);
            Progress progress = progressService.completeLesson(userId, lessonId);
            return ResponseEntity.ok(ApiResponse.success("Lesson completed successfully", progress));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse> getUserProgress(@RequestHeader("Authorization") String tokenHeader) {
        try {
            String userId = extractUserIdFromToken(tokenHeader);
            List<Progress> progress = progressService.getUserProgress(userId);
            return ResponseEntity.ok(ApiResponse.success("Progress fetched successfully", progress));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    private String extractUserIdFromToken(String tokenHeader) {
        if (tokenHeader == null || !tokenHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid authorization header");
        }
        String username = jwtService.extractUsername(tokenHeader.substring(7));
        User user = (User) userService.loadUserByUsername(username);
        return user.getId();
    }
}
