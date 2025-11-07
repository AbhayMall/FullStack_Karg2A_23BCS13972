// backend/src/main/java/com/gamified/learning/dto/UserProfileResponse.java
package com.gamified.learning.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private String username;
    private String email;
    private String role;
    private Integer totalXP;
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer badgeCount;
    private Integer xpEarnedToday;
    private Integer dailyXPCap;
    
    // You can add more fields as needed
    private Integer level;
    private Integer xpToNextLevel;
    private Integer progressToNextLevel;

    public UserProfileResponse(String username, String email, String role, 
                             Integer totalXP, Integer currentStreak, 
                             Integer longestStreak, Integer badgeCount) {
        this.username = username;
        this.email = email;
        this.role = role;
        this.totalXP = totalXP;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.badgeCount = badgeCount;
        this.xpEarnedToday = 0;
        this.dailyXPCap = 1000;
        calculateLevelInfo();
    }

    public UserProfileResponse(String username, String email, String role, 
                             Integer totalXP, Integer currentStreak, 
                             Integer longestStreak, Integer badgeCount,
                             Integer xpEarnedToday, Integer dailyXPCap) {
        this.username = username;
        this.email = email;
        this.role = role;
        this.totalXP = totalXP;
        this.currentStreak = currentStreak;
        this.longestStreak = longestStreak;
        this.badgeCount = badgeCount;
        this.xpEarnedToday = xpEarnedToday != null ? xpEarnedToday : 0;
        this.dailyXPCap = dailyXPCap != null ? dailyXPCap : 1000;
        calculateLevelInfo();
    }

    private void calculateLevelInfo() {
        this.level = calculateLevel(totalXP);
        int xpForCurrentLevel = (level - 1) * 1000;
        int xpForNextLevel = level * 1000;
        this.xpToNextLevel = xpForNextLevel - totalXP;
        this.progressToNextLevel = (int) (((double) (totalXP - xpForCurrentLevel) / 1000) * 100);
    }

    private int calculateLevel(int xp) {
        return (xp / 1000) + 1;
    }
}