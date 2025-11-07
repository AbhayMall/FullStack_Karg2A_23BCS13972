// ProgressService.java
package com.gamified.learning.service;

import com.gamified.learning.model.Progress;
import com.gamified.learning.model.User;
import com.gamified.learning.repository.ProgressRepository;
import com.gamified.learning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressService {
    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final XPService xpService;
    private final BadgeService badgeService;

    public Progress completeLesson(String userId, String lessonId) {
        // Check if already completed
        if (progressRepository.existsByUserIdAndLessonId(userId, lessonId)) {
            throw new RuntimeException("Lesson already completed");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Calculate XP
        Integer xpEarned = xpService.calculateXPEarned(userId, lessonId);
        
        // Create progress record
        Progress progress = new Progress();
        progress.setUserId(userId);
        progress.setLessonId(lessonId);
        progress.setXpEarned(xpEarned);
        
        Progress savedProgress = progressRepository.save(progress);
        
        // Update user stats
        updateUserStats(user, xpEarned);
        
        // Check for badge unlocks
        badgeService.checkAndAwardBadges(userId, "LESSON_COMPLETION");
        
        return savedProgress;
    }

    private void updateUserStats(User user, Integer xpEarned) {
        // Reset daily XP if it's a new day
        if (user.getLastXpReset() == null || 
            user.getLastXpReset().toLocalDate().isBefore(LocalDate.now())) {
            user.setXpEarnedToday(0);
            user.setLastXpReset(LocalDateTime.now());
        }
        
        // Update XP
        user.setTotalXP(user.getTotalXP() + xpEarned);
        user.setXpEarnedToday(user.getXpEarnedToday() + xpEarned);
        
        // Update streak
        updateStreak(user);
        
        userRepository.save(user);
    }

    private void updateStreak(User user) {
        LocalDate today = LocalDate.now();
        LocalDate lastActivity = user.getLastActivity() != null ? 
                                user.getLastActivity().toLocalDate() : null;

        if (lastActivity == null) {
            // First activity
            user.setCurrentStreak(1);
        } else if (lastActivity.plusDays(1).equals(today)) {
            // Consecutive day
            user.setCurrentStreak(user.getCurrentStreak() + 1);
        } else if (!lastActivity.equals(today)) {
            // Streak broken (not same day)
            user.setCurrentStreak(1);
        }
        
        // Update longest streak
        if (user.getCurrentStreak() > user.getLongestStreak()) {
            user.setLongestStreak(user.getCurrentStreak());
        }
        
        user.setLastActivity(LocalDateTime.now());
    }

    public List<Progress> getUserProgress(String userId) {
        return progressRepository.findByUserId(userId);
    }

    public Boolean isLessonCompleted(String userId, String lessonId) {
        return progressRepository.existsByUserIdAndLessonId(userId, lessonId);
    }
}