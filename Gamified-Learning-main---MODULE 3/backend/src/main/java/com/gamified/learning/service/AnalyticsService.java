// AnalyticsService.java
package com.gamified.learning.service;

import com.gamified.learning.model.User;
import com.gamified.learning.repository.LessonRepository;
import com.gamified.learning.repository.ProgressRepository;
import com.gamified.learning.repository.QuestRepository;
import com.gamified.learning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final UserRepository userRepository;
    private final ProgressRepository progressRepository;
    private final LessonRepository lessonRepository;
    private final QuestRepository questRepository;

    public Long getDailyActiveUsers() {
        LocalDate today = LocalDate.now();
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getLastActivity() != null &&
                               user.getLastActivity().toLocalDate().equals(today))
                .count();
    }

    public Double getAverageStreak() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .mapToInt(u -> u.getCurrentStreak() == null ? 0 : u.getCurrentStreak())
                .average()
                .orElse(0.0);
    }

    public Long getTotalXPEarned() {
        return userRepository.findAll()
                .stream()
                .mapToLong(u -> u.getTotalXP() == null ? 0 : u.getTotalXP())
                .sum();
    }

    public Map<String, Object> getPopularLessons() {
        // Placeholder; keep existing shape
        Map<String, Object> result = new HashMap<>();
        result.put("totalLessons", progressRepository.count());
        return result;
    }

    public AnalyticsSummary getAnalyticsSummary() {
        AnalyticsSummary summary = new AnalyticsSummary();
        summary.setDailyActiveUsers(getDailyActiveUsers());
        summary.setAverageStreak(getAverageStreak());
        summary.setTotalXPEarned(getTotalXPEarned());
        summary.setTotalUsers(userRepository.count());
        summary.setPopularLessons(getPopularLessons());

        // New required fields
        summary.setStudentsCount(userRepository.countByRole("STUDENT"));
        summary.setLessonsCount(lessonRepository.countByIsActiveTrue());
        summary.setQuestsCount(questRepository.countByIsActiveTrue());
        return summary;
    }

    public static class AnalyticsSummary {
        private Long dailyActiveUsers;
        private Double averageStreak;
        private Long totalXPEarned;
        private Long totalUsers;
        private Map<String, Object> popularLessons;

        // New fields for admin dashboard cards
        private Long studentsCount;
        private Long lessonsCount;
        private Long questsCount;

        public Long getDailyActiveUsers() { return dailyActiveUsers; }
        public void setDailyActiveUsers(Long dailyActiveUsers) { this.dailyActiveUsers = dailyActiveUsers; }
        public Double getAverageStreak() { return averageStreak; }
        public void setAverageStreak(Double averageStreak) { this.averageStreak = averageStreak; }
        public Long getTotalXPEarned() { return totalXPEarned; }
        public void setTotalXPEarned(Long totalXPEarned) { this.totalXPEarned = totalXPEarned; }
        public Long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }
        public Map<String, Object> getPopularLessons() { return popularLessons; }
        public void setPopularLessons(Map<String, Object> popularLessons) { this.popularLessons = popularLessons; }
        public Long getStudentsCount() { return studentsCount; }
        public void setStudentsCount(Long studentsCount) { this.studentsCount = studentsCount; }
        public Long getLessonsCount() { return lessonsCount; }
        public void setLessonsCount(Long lessonsCount) { this.lessonsCount = lessonsCount; }
        public Long getQuestsCount() { return questsCount; }
        public void setQuestsCount(Long questsCount) { this.questsCount = questsCount; }
    }
}
