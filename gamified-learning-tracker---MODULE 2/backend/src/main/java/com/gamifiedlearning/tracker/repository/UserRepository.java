package com.gamifiedlearning.tracker.repository;

import com.gamifiedlearning.tracker.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    
    // For checking if username or email already exists
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    
    // For leaderboard - get top users by XP
    List<User> findTop10ByOrderByTotalXpDesc();
    List<User> findTop20ByOrderByTotalXpDesc();
    
    // For analytics - active users
    @Query("{ 'lastActivityDate': { $gte: ?0 } }")
    List<User> findActiveUsersSince(LocalDateTime date);
    
    // Count users by streak
    long countByCurrentStreakGreaterThan(Integer streak);
    
    // Find users with specific badges
    @Query("{ 'unlockedBadges': { $in: [?0] } }")
    List<User> findUsersWithBadge(String badgeId);
}
    // Find users with current streak greater than specified value
    List<User> findByCurrentStreakGreaterThan(Integer streak);
}