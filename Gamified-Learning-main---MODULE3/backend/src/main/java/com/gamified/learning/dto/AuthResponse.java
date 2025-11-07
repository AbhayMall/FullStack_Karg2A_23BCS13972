// AuthResponse.java
package com.gamified.learning.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private String role;
    private Integer totalXP;
    private Integer currentStreak;
    
    public AuthResponse(String token, String username, String email, String role, Integer totalXP, Integer currentStreak) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.role = role;
        this.totalXP = totalXP;
        this.currentStreak = currentStreak;
    }
}