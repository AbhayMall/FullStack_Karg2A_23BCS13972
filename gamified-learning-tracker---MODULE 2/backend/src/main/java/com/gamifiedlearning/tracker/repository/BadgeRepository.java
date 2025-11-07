package com.gamifiedlearning.tracker.repository;

import com.gamifiedlearning.tracker.model.Badge;
import com.gamifiedlearning.tracker.model.BadgeType;
import com.gamifiedlearning.tracker.model.BadgeRarity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BadgeRepository extends MongoRepository<Badge, String> {
    
    // Basic queries
    List<Badge> findByIsActiveTrueOrderByRequiredValueAsc();
    List<Badge> findByIdInOrderByRequiredValueAsc(List<String> ids);
    
    // Filter by type and category
    List<Badge> findByBadgeTypeAndIsActiveTrueOrderByRequiredValueAsc(BadgeType badgeType);
    List<Badge> findByCategoryAndIsActiveTrueOrderByRequiredValueAsc(String category);
    List<Badge> findByRarityAndIsActiveTrueOrderByRequiredValueAsc(BadgeRarity rarity);
    
    // Statistics
    long countByIsActiveTrue();
    long countByBadgeTypeAndIsActiveTrue(BadgeType badgeType);
    long countByRarityAndIsActiveTrue(BadgeRarity rarity);
    
    // Recently unlocked badges (for a user)
    @Query("{ '_id': { $in: ?0 }, 'isActive': true }")
    List<Badge> findRecentlyUnlockedBadges(List<String> unlockedBadgeIds, int limit);
    
    // Find badges by difficulty/rarity for recommendations
    @Query("{ 'isActive': true, 'rarity': { $in: ?0 } }")
    List<Badge> findByRarityIn(List<BadgeRarity> rarities);
    
    // Analytics - badges grouped by type
    @Query(value = "{ 'isActive': true }", fields = "{ 'badgeType': 1, '_id': 0 }")
    List<String> findAllBadgeTypes();
    
    // Find badges with specific requirements range
    List<Badge> findByRequiredValueBetweenAndIsActiveTrueOrderByRequiredValueAsc(Long minValue, Long maxValue);
    
    // Search badges
    @Query("{ 'isActive': true, $or: [ " +
           "{ 'name': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } }, " +
           "{ 'category': { $regex: ?0, $options: 'i' } } ] }")
    List<Badge> searchBadges(String searchTerm);
}