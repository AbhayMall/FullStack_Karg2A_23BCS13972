package com.gamifiedlearning.tracker.service;

import com.gamifiedlearning.tracker.model.User;
import com.gamifiedlearning.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private BadgeService badgeService;

    public User createUser(String username, String email, String password) {
        User user = new User(username, email, passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public User updateUserProfile(String userId, Map<String, Object> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (updates.containsKey("username")) {
            user.setUsername((String) updates.get("username"));
        }
        if (updates.containsKey("email")) {
            user.setEmail((String) updates.get("email"));
        }
        
        return userRepository.save(user);
    }

    public User addXpToUser(String userId, Long xpGained, String source) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Calculate streak bonus
        Long bonusXp = calculateStreakBonus(user, xpGained);
        Long totalXpGained = xpGained + bonusXp;
        
        // Apply daily XP cap
        totalXpGained = Math.min(totalXpGained, getDailyXpCap(user));
        
        user.setTotalXp(user.getTotalXp() + totalXpGained);
        updateUserStreak(user);
        
        User savedUser = userRepository.save(user);
        
        // Check for new badge unlocks
        badgeService.checkAndUnlockBadges(savedUser);
        
        return savedUser;
    }

    private void updateUserStreak(User user) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastActivity = user.getLastActivityDate();
        
        if (lastActivity == null) {
            // First activity
            user.setCurrentStreak(1);
            user.setLongestStreak(1);
        } else {
            long daysBetween = ChronoUnit.DAYS.between(lastActivity.toLocalDate(), now.toLocalDate());
            
            if (daysBetween == 1) {
                // Consecutive day - increase streak
                user.setCurrentStreak(user.getCurrentStreak() + 1);
                if (user.getCurrentStreak() > user.getLongestStreak()) {
                    user.setLongestStreak(user.getCurrentStreak());
                }
            } else if (daysBetween > 1) {
                // Streak broken - reset to 1
                user.setCurrentStreak(1);
            }
            // If daysBetween == 0, same day - don't change streak
        }
        
        user.setLastActivityDate(now);
    }

    private Long calculateStreakBonus(User user, Long baseXp) {
        if (user.getCurrentStreak() == null || user.getCurrentStreak() <= 1) {
            return 0L;
        }
        
        // Bonus increases with streak: 10% at 2 days, 20% at 3 days, capped at 50%
        double bonusMultiplier = Math.min(0.5, (user.getCurrentStreak() - 1) * 0.1);
        return Math.round(baseXp * bonusMultiplier);
    }

    private Long getDailyXpCap(User user) {
        // Base daily cap of 1000 XP, increases by 100 XP per 1000 total XP earned
        Long baseCap = 1000L;
        Long bonusCap = (user.getTotalXp() / 1000) * 100;
        return baseCap + bonusCap;
    }

    public void completeLesson(String userId, String lessonId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!user.getCompletedLessons().contains(lessonId)) {
            user.getCompletedLessons().add(lessonId);
            userRepository.save(user);
        }
    }

    public void completeQuest(String userId, String questId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!user.getCompletedQuests().contains(questId)) {
            user.getCompletedQuests().add(questId);
            userRepository.save(user);
        }
    }

    public Map<String, Object> getUserStats(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalXp", user.getTotalXp());
        stats.put("currentStreak", user.getCurrentStreak());
        stats.put("longestStreak", user.getLongestStreak());
        stats.put("badgesCount", user.getUnlockedBadges().size());
        stats.put("lessonsCompleted", user.getCompletedLessons().size());
        stats.put("questsCompleted", user.getCompletedQuests().size());
        stats.put("level", calculateUserLevel(user.getTotalXp()));
        stats.put("xpToNextLevel", calculateXpToNextLevel(user.getTotalXp()));
        
        return stats;
    }

    public List<User> getLeaderboard(int limit) {
        return userRepository.findTop10ByOrderByTotalXpDesc();
    }

    private Integer calculateUserLevel(Long totalXp) {
        // Level formula: Level = floor(sqrt(XP / 100)) + 1
        return (int) Math.floor(Math.sqrt(totalXp / 100.0)) + 1;
    }

    private Long calculateXpToNextLevel(Long totalXp) {
        Integer currentLevel = calculateUserLevel(totalXp);
        Long xpForNextLevel = (long) Math.pow(currentLevel, 2) * 100;
        return xpForNextLevel - totalXp;
    }
}