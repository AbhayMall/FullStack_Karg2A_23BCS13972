package com.gamifiedlearning.tracker.service;

import com.gamifiedlearning.tracker.model.Badge;
import com.gamifiedlearning.tracker.model.User;
import com.gamifiedlearning.tracker.repository.BadgeRepository;
import com.gamifiedlearning.tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@Service
public class BadgeService {

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Badge> getAllBadges() {
        return badgeRepository.findByIsActiveTrueOrderByRequiredValueAsc();
    }

    public List<Badge> getUserBadges(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return badgeRepository.findByIdInOrderByRequiredValueAsc(user.getUnlockedBadges());
    }

    public Optional<Badge> getBadgeById(String id) {
        return badgeRepository.findById(id);
    }

    public Badge createBadge(Badge badge) {
        if (badge.getUnlockDate() == null) {
            badge.setUnlockDate(LocalDateTime.now());
        }
        return badgeRepository.save(badge);
    }

    public Badge updateBadge(String id, Badge updatedBadge) {
        Badge existingBadge = badgeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Badge not found"));
        
        existingBadge.setName(updatedBadge.getName());
        existingBadge.setDescription(updatedBadge.getDescription());
        existingBadge.setIconUrl(updatedBadge.getIconUrl());
        existingBadge.setBadgeType(updatedBadge.getBadgeType());
        existingBadge.setRequiredValue(updatedBadge.getRequiredValue());
        existingBadge.setRarity(updatedBadge.getRarity());
        existingBadge.setIsActive(updatedBadge.getIsActive());
        
        return badgeRepository.save(existingBadge);
    }

    public void deleteBadge(String id) {
        Badge badge = badgeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Badge not found"));
        badge.setIsActive(false);
        badgeRepository.save(badge);
    }

    public List<Badge> checkAndUnlockBadges(User user) {
        List<Badge> newlyUnlocked = new ArrayList<>();
        List<Badge> allBadges = getAllBadges();
        
        for (Badge badge : allBadges) {
            if (!user.getUnlockedBadges().contains(badge.getId()) && 
                shouldUnlockBadge(user, badge)) {
                
                user.getUnlockedBadges().add(badge.getId());
                newlyUnlocked.add(badge);
            }
        }
        
        if (!newlyUnlocked.isEmpty()) {
            userRepository.save(user);
        }
        
        return newlyUnlocked;
    }

    private boolean shouldUnlockBadge(User user, Badge badge) {
        switch (badge.getBadgeType()) {
            case XP_MILESTONE:
                return user.getTotalXp() >= badge.getRequiredValue();
            
            case LESSON_COMPLETION:
                return user.getCompletedLessons().size() >= badge.getRequiredValue();
            
            case QUEST_COMPLETION:
                return user.getCompletedQuests().size() >= badge.getRequiredValue();
            
            case STREAK_ACHIEVEMENT:
                return user.getCurrentStreak() >= badge.getRequiredValue() || 
                       user.getLongestStreak() >= badge.getRequiredValue();
            
            case BADGE_COLLECTOR:
                return user.getUnlockedBadges().size() >= badge.getRequiredValue();
            
            case DAILY_LEARNER:
                // Check if user has been active for consecutive days
                return checkConsecutiveDaysActive(user, badge.getRequiredValue());
            
            default:
                return false;
        }
    }

    private boolean checkConsecutiveDaysActive(User user, Long requiredDays) {
        // This would require a more complex implementation tracking daily activities
        // For now, use current streak as a proxy
        return user.getCurrentStreak() != null && user.getCurrentStreak() >= requiredDays;
    }

    public Map<String, Object> getBadgeProgress(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Badge> allBadges = getAllBadges();
        Map<String, Object> progress = new HashMap<>();
        
        for (Badge badge : allBadges) {
            Map<String, Object> badgeProgress = new HashMap<>();
            badgeProgress.put("badge", badge);
            badgeProgress.put("unlocked", user.getUnlockedBadges().contains(badge.getId()));
            badgeProgress.put("progress", calculateBadgeProgress(user, badge));
            badgeProgress.put("progressPercentage", calculateBadgeProgressPercentage(user, badge));
            
            progress.put(badge.getId(), badgeProgress);
        }
        
        return progress;
    }

    private Long calculateBadgeProgress(User user, Badge badge) {
        switch (badge.getBadgeType()) {
            case XP_MILESTONE:
                return user.getTotalXp();
            
            case LESSON_COMPLETION:
                return (long) user.getCompletedLessons().size();
            
            case QUEST_COMPLETION:
                return (long) user.getCompletedQuests().size();
            
            case STREAK_ACHIEVEMENT:
                return (long) Math.max(user.getCurrentStreak(), user.getLongestStreak());
            
            case BADGE_COLLECTOR:
                return (long) user.getUnlockedBadges().size();
            
            case DAILY_LEARNER:
                return (long) (user.getCurrentStreak() != null ? user.getCurrentStreak() : 0);
            
            default:
                return 0L;
        }
    }

    private Double calculateBadgeProgressPercentage(User user, Badge badge) {
        Long progress = calculateBadgeProgress(user, badge);
        Long required = badge.getRequiredValue();
        
        if (required == null || required == 0) return 0.0;
        
        return Math.min(100.0, (progress.doubleValue() / required.doubleValue()) * 100.0);
    }

    public List<Badge> getRecentlyUnlockedBadges(String userId, int limit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return badgeRepository.findRecentlyUnlockedBadges(user.getUnlockedBadges(), limit);
    }

    public Map<String, Object> getBadgeStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBadges", badgeRepository.countByIsActiveTrue());
        stats.put("badgesByType", getBadgeCountByType());
        stats.put("badgesByRarity", getBadgeCountByRarity());
        stats.put("totalUnlocks", getTotalBadgeUnlocks());
        
        return stats;
    }

    private Map<String, Long> getBadgeCountByType() {
        Map<String, Long> counts = new HashMap<>();
        List<Badge> allBadges = getAllBadges();
        
        for (Badge badge : allBadges) {
            String type = badge.getBadgeType().toString();
            counts.put(type, counts.getOrDefault(type, 0L) + 1);
        }
        
        return counts;
    }

    private Map<String, Long> getBadgeCountByRarity() {
        Map<String, Long> counts = new HashMap<>();
        List<Badge> allBadges = getAllBadges();
        
        for (Badge badge : allBadges) {
            String rarity = badge.getRarity().toString();
            counts.put(rarity, counts.getOrDefault(rarity, 0L) + 1);
        }
        
        return counts;
    }

    private Long getTotalBadgeUnlocks() {
        List<User> allUsers = userRepository.findAll();
        return allUsers.stream()
                .mapToLong(user -> user.getUnlockedBadges().size())
                .sum();
    }
}