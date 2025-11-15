// BadgeService.java
package com.gamified.learning.service;

import com.gamified.learning.model.Badge;
import com.gamified.learning.model.User;
import com.gamified.learning.repository.BadgeRepository;
import com.gamified.learning.repository.ProgressRepository;
import com.gamified.learning.repository.UserRepository;
import com.gamified.learning.repository.QuestProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BadgeService {
    private final BadgeRepository badgeRepository;
    private final UserRepository userRepository;
    private final ProgressRepository progressRepository;
    private final QuestProgressRepository questProgressRepository;

    public void checkAndAwardBadges(String userId, String activityType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Badge> eligibleBadges = badgeRepository.findByConditionType(activityType);
        
        for (Badge badge : eligibleBadges) {
            if (meetsBadgeCriteria(user, badge) && !user.getUnlockedBadges().contains(badge.getId())) {
                awardBadge(user, badge);
            }
        }
    }

    private boolean meetsBadgeCriteria(User user, Badge badge) {
        return switch (badge.getConditionType()) {
            case "STREAK_DAYS" -> user.getCurrentStreak() >= badge.getConditionValue();
            case "TOTAL_LESSONS" -> progressRepository.countByUserId(user.getId()) >= badge.getConditionValue();
            case "TOTAL_XP" -> user.getTotalXP() >= badge.getConditionValue();
            case "QUEST_COMPLETION" -> questProgressRepository.countByUserId(user.getId()) >= badge.getConditionValue();
            default -> false;
        };
    }

    private void awardBadge(User user, Badge badge) {
        if (user.getUnlockedBadges() == null) {
            user.setUnlockedBadges(new ArrayList<>());
        }
        user.getUnlockedBadges().add(badge.getId());
        
        // Award bonus XP
        if (badge.getXpBonus() != null) {
            user.setTotalXP(user.getTotalXP() + badge.getXpBonus());
        }
        
        userRepository.save(user);
    }

    public List<Badge> getUserBadges(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<String> unlockedBadgeIds = user.getUnlockedBadges();
        if (unlockedBadgeIds == null) {
            return new ArrayList<>();
        }
        
        return badgeRepository.findAllById(unlockedBadgeIds);
    }

    public List<Badge> getAllBadges() {
        return badgeRepository.findAll();
    }
}