// BadgeController.java
package com.gamified.learning.controller;

import com.gamified.learning.dto.ApiResponse;
import com.gamified.learning.model.Badge;
import com.gamified.learning.model.User;
import com.gamified.learning.service.BadgeService;
import com.gamified.learning.service.JwtService;
import com.gamified.learning.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/badges")
@RequiredArgsConstructor
public class BadgeController {
    private final BadgeService badgeService;
    private final JwtService jwtService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllBadges() {
        try {
            List<Badge> badges = badgeService.getAllBadges();
            return ResponseEntity.ok(ApiResponse.success("Badges fetched successfully", badges));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<ApiResponse> getUserBadges(@RequestHeader("Authorization") String tokenHeader) {
        try {
            String userId = extractUserIdFromToken(tokenHeader);
            List<Badge> badges = badgeService.getUserBadges(userId);
            return ResponseEntity.ok(ApiResponse.success("User badges fetched successfully", badges));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    private String extractUserIdFromToken(String tokenHeader) {
        if (tokenHeader == null || !tokenHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid authorization header");
        }
        String jwt = tokenHeader.substring(7);
        String username = jwtService.extractUsername(jwt);
        User user = (User) userService.loadUserByUsername(username);
        return user.getId();
    }
}
