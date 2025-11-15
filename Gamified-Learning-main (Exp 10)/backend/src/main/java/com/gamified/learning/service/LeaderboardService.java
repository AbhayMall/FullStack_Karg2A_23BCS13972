// LeaderboardService.java
package com.gamified.learning.service;

import com.gamified.learning.model.Badge;
import com.gamified.learning.model.User;
import com.gamified.learning.repository.BadgeRepository;
import com.gamified.learning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {
    private final UserRepository userRepository;
    private final BadgeRepository badgeRepository;

    private static final Map<String, Integer> RARITY_RANK = Map.of(
        "LEGENDARY", 3,
        "EPIC", 2,
        "RARE", 1,
        "COMMON", 0
    );

    private static String mapRarityToTier(String rarity) {
        if (rarity == null) return null;
        return switch (rarity) {
            case "LEGENDARY" -> "gold";
            case "EPIC" -> "silver";
            case "RARE" -> "bronze";
            default -> null;
        };
    }

    public List<LeaderboardEntry> getGlobalLeaderboard() {
        return userRepository.findAll()
                .stream()
                .sorted((u1, u2) -> u2.getTotalXP().compareTo(u1.getTotalXP()))
                .limit(100)
                .map(user -> {
                    String topBadgeTier = null;
                    String topBadgeName = null;
                    if (user.getUnlockedBadges() != null && !user.getUnlockedBadges().isEmpty()) {
                        List<Badge> badges = badgeRepository.findAllById(user.getUnlockedBadges());
                        var top = badges.stream()
                                .filter(b -> b.getRarity() != null)
                                .max(Comparator.comparingInt(b -> RARITY_RANK.getOrDefault(b.getRarity(), -1)));
                        if (top.isPresent()) {
                            topBadgeTier = mapRarityToTier(top.get().getRarity());
                            topBadgeName = top.get().getName();
                        }
                    }
                    return new LeaderboardEntry(
                            user.getUsername(),
                            user.getTotalXP(),
                            user.getCurrentStreak(),
                            user.getUnlockedBadges() != null ? user.getUnlockedBadges().size() : 0,
                            topBadgeTier,
                            topBadgeName
                    );
                })
                .collect(Collectors.toList());
    }

    public static class LeaderboardEntry {
        public String username;
        public Integer totalXP;
        public Integer currentStreak;
        public Integer badgeCount;
        public String topBadgeTier; // gold | silver | bronze | null
        public String topBadgeName; // optional display name

        public LeaderboardEntry(String username, Integer totalXP, Integer currentStreak, Integer badgeCount,
                                String topBadgeTier, String topBadgeName) {
            this.username = username;
            this.totalXP = totalXP;
            this.currentStreak = currentStreak;
            this.badgeCount = badgeCount;
            this.topBadgeTier = topBadgeTier;
            this.topBadgeName = topBadgeName;
        }
    }
}
