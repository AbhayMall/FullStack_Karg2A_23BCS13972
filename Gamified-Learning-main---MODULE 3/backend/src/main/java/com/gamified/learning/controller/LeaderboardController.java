// LeaderboardController.java
package com.gamified.learning.controller;

import com.gamified.learning.dto.ApiResponse;
import com.gamified.learning.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {
    private final LeaderboardService leaderboardService;

    @GetMapping("/global")
    public ResponseEntity<ApiResponse> getGlobalLeaderboard() {
        try {
            var leaderboard = leaderboardService.getGlobalLeaderboard();
            return ResponseEntity.ok(ApiResponse.success("Leaderboard fetched successfully", leaderboard));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}