package com.gamifiedlearning.tracker.service;

import com.gamifiedlearning.tracker.model.Lesson;
import com.gamifiedlearning.tracker.model.User;
import com.gamifiedlearning.tracker.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserService userService;

    public List<Lesson> getAllActiveLessons() {
        return lessonRepository.findByIsActiveTrueOrderByOrderAsc();
    }

    public Page<Lesson> getLessonsPaginated(Pageable pageable) {
        return lessonRepository.findByIsActiveTrue(pageable);
    }

    public List<Lesson> getLessonsByCategory(String category) {
        return lessonRepository.findByCategoryAndIsActiveTrueOrderByOrderAsc(category);
    }

    public List<Lesson> getLessonsByDifficulty(Integer difficulty) {
        return lessonRepository.findByDifficultyAndIsActiveTrueOrderByOrderAsc(difficulty);
    }

    public Optional<Lesson> getLessonById(String id) {
        return lessonRepository.findById(id);
    }

    public Lesson createLesson(Lesson lesson) {
        if (lesson.getOrder() == null) {
            // Auto-assign order based on existing lessons
            Integer maxOrder = lessonRepository.findMaxOrder();
            lesson.setOrder(maxOrder != null ? maxOrder + 1 : 1);
        }
        
        if (lesson.getXpReward() == null) {
            // Auto-calculate XP based on difficulty and estimated time
            lesson.setXpReward(calculateDefaultXpReward(lesson));
        }
        
        return lessonRepository.save(lesson);
    }

    public Lesson updateLesson(String id, Lesson updatedLesson) {
        Lesson existingLesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        
        existingLesson.setTitle(updatedLesson.getTitle());
        existingLesson.setDescription(updatedLesson.getDescription());
        existingLesson.setContent(updatedLesson.getContent());
        existingLesson.setCategory(updatedLesson.getCategory());
        existingLesson.setDifficulty(updatedLesson.getDifficulty());
        existingLesson.setXpReward(updatedLesson.getXpReward());
        existingLesson.setEstimatedTimeMinutes(updatedLesson.getEstimatedTimeMinutes());
        existingLesson.setIsActive(updatedLesson.getIsActive());
        
        if (updatedLesson.getOrder() != null) {
            existingLesson.setOrder(updatedLesson.getOrder());
        }
        
        return lessonRepository.save(existingLesson);
    }

    public void deleteLesson(String id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        lesson.setIsActive(false);
        lessonRepository.save(lesson);
    }

    public Map<String, Object> completeLesson(String lessonId, String userId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> result = new HashMap<>();
        
        // Check if lesson is already completed
        if (user.getCompletedLessons().contains(lessonId)) {
            result.put("alreadyCompleted", true);
            result.put("xpGained", 0L);
            return result;
        }
        
        // Mark lesson as completed
        userService.completeLesson(userId, lessonId);
        
        // Calculate and award XP
        Long xpGained = calculateLessonXp(lesson, user);
        User updatedUser = userService.addXpToUser(userId, xpGained, "lesson_completion");
        
        result.put("alreadyCompleted", false);
        result.put("xpGained", xpGained);
        result.put("totalXp", updatedUser.getTotalXp());
        result.put("currentStreak", updatedUser.getCurrentStreak());
        result.put("levelUp", checkLevelUp(user.getTotalXp(), updatedUser.getTotalXp()));
        
        return result;
    }

    private Long calculateLessonXp(Lesson lesson, User user) {
        Long baseXp = lesson.getXpReward();
        
        // Apply difficulty multiplier
        double difficultyMultiplier = 1.0 + (lesson.getDifficulty() - 1) * 0.2;
        
        // Apply time-based bonus
        double timeBonus = 1.0;
        if (lesson.getEstimatedTimeMinutes() != null) {
            timeBonus = 1.0 + Math.min(0.5, lesson.getEstimatedTimeMinutes() / 60.0 * 0.1);
        }
        
        return Math.round(baseXp * difficultyMultiplier * timeBonus);
    }

    private Long calculateDefaultXpReward(Lesson lesson) {
        Long baseXp = 50L;
        
        if (lesson.getDifficulty() != null) {
            baseXp += (lesson.getDifficulty() - 1) * 25L;
        }
        
        if (lesson.getEstimatedTimeMinutes() != null) {
            baseXp += lesson.getEstimatedTimeMinutes() * 2L;
        }
        
        return baseXp;
    }

    private boolean checkLevelUp(Long oldXp, Long newXp) {
        int oldLevel = (int) Math.floor(Math.sqrt(oldXp / 100.0)) + 1;
        int newLevel = (int) Math.floor(Math.sqrt(newXp / 100.0)) + 1;
        return newLevel > oldLevel;
    }

    public List<String> getAllCategories() {
        return lessonRepository.findDistinctCategories();
    }

    public Map<String, Object> getLessonStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLessons", lessonRepository.countByIsActiveTrue());
        stats.put("categoriesCount", getAllCategories().size());
        stats.put("averageDifficulty", lessonRepository.calculateAverageDifficulty());
        stats.put("totalXpAvailable", lessonRepository.sumAllXpRewards());
        
        return stats;
    }

    public List<Lesson> getRecommendedLessons(String userId, int limit) {
        User user = userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get lessons not completed by user, ordered by difficulty and XP reward
        return lessonRepository.findRecommendedLessons(
                user.getCompletedLessons(), 
                calculateRecommendedDifficulty(user),
                limit
        );
    }

    private Integer calculateRecommendedDifficulty(User user) {
        // Start with difficulty 1, increase based on completed lessons count
        int completedCount = user.getCompletedLessons().size();
        if (completedCount < 5) return 1;
        if (completedCount < 15) return 2;
        if (completedCount < 30) return 3;
        if (completedCount < 50) return 4;
        return 5;
    }
}