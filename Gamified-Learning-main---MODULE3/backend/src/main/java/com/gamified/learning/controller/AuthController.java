// AuthController.java
package com.gamified.learning.controller;

import com.gamified.learning.dto.ApiResponse;
import com.gamified.learning.dto.AuthResponse;
import com.gamified.learning.dto.LoginRequest;
import com.gamified.learning.dto.RegisterRequest;
import com.gamified.learning.dto.UserProfileResponse;
import com.gamified.learning.model.User;
import com.gamified.learning.service.AuthService;
import com.gamified.learning.service.JwtService;
import com.gamified.learning.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(ApiResponse.success("User registered successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

   @GetMapping("/me")
public ResponseEntity<ApiResponse> getCurrentUser(@RequestHeader("Authorization") String token) {
    try {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid authorization header"));
        }
        
        String jwt = token.substring(7);
        String username = jwtService.extractUsername(jwt);
        User user = userService.getUserByUsername(username);
        
        UserProfileResponse response = new UserProfileResponse(
            user.getUsername(),
            user.getEmail(),
            user.getRole(),
            user.getTotalXP(),
            user.getCurrentStreak(),
            user.getLongestStreak(),
            user.getUnlockedBadges() != null ? user.getUnlockedBadges().size() : 0,
            user.getXpEarnedToday(),
            user.getDailyXPCap()
        );
        
        return ResponseEntity.ok(ApiResponse.success("User profile fetched successfully", response));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
    }
}
}