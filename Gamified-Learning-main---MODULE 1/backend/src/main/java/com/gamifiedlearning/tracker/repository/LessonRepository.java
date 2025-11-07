package com.gamifiedlearning.tracker.repository;

import com.gamifiedlearning.tracker.model.Lesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends MongoRepository<Lesson, String> {
    
    // Basic queries
    List<Lesson> findByIsActiveTrueOrderByOrderAsc();
    Page<Lesson> findByIsActiveTrue(Pageable pageable);
    
    // Category-based queries
    List<Lesson> findByCategoryAndIsActiveTrueOrderByOrderAsc(String category);
    List<Lesson> findByDifficultyAndIsActiveTrueOrderByOrderAsc(Integer difficulty);
    
    // Statistics queries
    long countByIsActiveTrue();
    
    @Query(value = "{}", fields = "{ 'category': 1, '_id': 0 }")
    List<String> findDistinctCategories();
    
    @Query("{ 'isActive': true }")
    @Aggregation(pipeline = {
        "{ $match: { 'isActive': true } }",
        "{ $group: { '_id': null, 'avgDifficulty': { $avg: '$difficulty' } } }"
    })
    Double calculateAverageDifficulty();
    
    @Query("{ 'isActive': true }")
    @Aggregation(pipeline = {
        "{ $match: { 'isActive': true } }",
        "{ $group: { '_id': null, 'totalXp': { $sum: '$xpReward' } } }"
    })
    Long sumAllXpRewards();
    
    // Get max order for auto-incrementing
    @Query(value = "{}", sort = "{ 'order': -1 }", fields = "{ 'order': 1, '_id': 0 }")
    Integer findMaxOrder();
    
    // Recommendation system
    @Query("{ 'isActive': true, '_id': { $nin: ?0 }, 'difficulty': { $lte: ?1 } }")
    List<Lesson> findRecommendedLessons(List<String> completedLessonIds, Integer maxDifficulty, int limit);
    
    // Search functionality
    @Query("{ 'isActive': true, $or: [ " +
           "{ 'title': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } }, " +
           "{ 'category': { $regex: ?0, $options: 'i' } } ] }")
    List<Lesson> searchLessons(String searchTerm);
    
    // Analytics queries
    @Query("{ 'isActive': true }")
    @Aggregation(pipeline = {
        "{ $match: { 'isActive': true } }",
        "{ $group: { '_id': '$category', 'count': { $sum: 1 }, 'avgXp': { $avg: '$xpReward' } } }"
    })
    List<Object> getLessonStatsByCategory();
}