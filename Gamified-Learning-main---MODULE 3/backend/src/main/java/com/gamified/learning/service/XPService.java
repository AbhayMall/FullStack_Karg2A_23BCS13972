// XPService.java
package com.gamified.learning.service;

import com.gamified.learning.model.Lesson;
import com.gamified.learning.model.User;
import com.gamified.learning.repository.LessonRepository;
import com.gamified.learning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class XPService {
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;

    public Integer calculateXPEarned(String userId, String lessonId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        Integer baseXP = lesson.getXpValue();
        Double difficultyMultiplier = getDifficultyMultiplier(lesson.getDifficulty());
        Integer streakBonus = calculateStreakBonus(user.getCurrentStreak());
        
        Integer totalXP = (int)(baseXP * difficultyMultiplier) + streakBonus;
        
        // Apply daily cap
        if (user.getLastXpReset() != null && 
            user.getLastXpReset().toLocalDate().equals(LocalDate.now())) {
            if (user.getXpEarnedToday() + totalXP > user.getDailyXPCap()) {
                totalXP = Math.max(0, user.getDailyXPCap() - user.getXpEarnedToday());
            }
        }
        
        return totalXP;
    }

    private Double getDifficultyMultiplier(String difficulty) {
        return switch (difficulty.toUpperCase()) {
            case "EASY" -> 1.0;
            case "MEDIUM" -> 1.5;
            case "HARD" -> 2.0;
            default -> 1.0;
        };
    }

    private Integer calculateStreakBonus(Integer streak) {
        if (streak >= 7) return 50;
        if (streak >= 3) return 20;
        return 0;
    }
}