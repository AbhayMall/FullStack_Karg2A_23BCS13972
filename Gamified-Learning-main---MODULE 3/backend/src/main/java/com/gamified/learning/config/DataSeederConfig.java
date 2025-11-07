package com.gamified.learning.config;

import com.gamified.learning.model.Badge;
import com.gamified.learning.model.Lesson;
import com.gamified.learning.model.Quest;
import com.gamified.learning.model.User;
import com.gamified.learning.repository.BadgeRepository;
import com.gamified.learning.repository.LessonRepository;
import com.gamified.learning.repository.QuestRepository;
import com.gamified.learning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataSeederConfig {

    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final QuestRepository questRepository;
    private final BadgeRepository badgeRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedData() {
        return args -> {
            seedUsers();
            seedLessons();
            seedQuests();
            seedBadges();
        };
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User demo = new User();
            demo.setUsername("demo");
            demo.setEmail("demo@example.com");
            demo.setPassword(passwordEncoder.encode("password"));
            demo.setRole("STUDENT");
            userRepository.save(demo);

            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }
    }

    private void seedLessons() {
        if (lessonRepository.count() == 0) {
            Lesson l1 = new Lesson();
            l1.setTitle("Intro to Java");
            l1.setDescription("Basics of Java language");
            l1.setContent("Variables, Types, and Operators");
            l1.setDifficulty("EASY");
            l1.setXpValue(100);
            l1.setEstimatedMinutes(15);
            l1.setTags(List.of("java", "basics"));
            l1.setOrderIndex(1);

            Lesson l2 = new Lesson();
            l2.setTitle("OOP in Java");
            l2.setDescription("Classes, Objects, and Inheritance");
            l2.setContent("OOP principles");
            l2.setDifficulty("MEDIUM");
            l2.setXpValue(200);
            l2.setEstimatedMinutes(25);
            l2.setTags(List.of("java", "oop"));
            l2.setOrderIndex(2);

            Lesson l3 = new Lesson();
            l3.setTitle("Spring Boot Basics");
            l3.setDescription("Build REST APIs with Spring Boot");
            l3.setContent("Controllers, Services, Repos");
            l3.setDifficulty("MEDIUM");
            l3.setXpValue(300);
            l3.setEstimatedMinutes(30);
            l3.setTags(List.of("spring", "rest"));
            l3.setOrderIndex(3);

            lessonRepository.saveAll(Arrays.asList(l1, l2, l3));
        }
    }

    private void seedQuests() {
        if (questRepository.count() == 0) {
            List<Lesson> lessons = lessonRepository.findAll();
            String lesson1 = lessons.size() > 0 ? lessons.get(0).getId() : null;
            String lesson2 = lessons.size() > 1 ? lessons.get(1).getId() : null;

            Quest q1 = new Quest();
            q1.setTitle("Java Beginner Quest");
            q1.setDescription("Complete initial Java lessons");
            q1.setDifficulty("EASY");
            q1.setXpReward(250);
            q1.setRequiredLessonIds(lesson1 != null ? List.of(lesson1) : List.of());

            Quest.QuestStep s1 = new Quest.QuestStep();
            s1.setDescription("Finish Intro to Java");
            s1.setType("LESSON_COMPLETION");
            s1.setTargetId(lesson1);

            q1.setSteps(List.of(s1));

            Quest q2 = new Quest();
            q2.setTitle("Java OOP Challenger");
            q2.setDescription("Master OOP concepts in Java");
            q2.setDifficulty("MEDIUM");
            q2.setXpReward(400);
            q2.setRequiredLessonIds(lesson2 != null ? List.of(lesson2) : List.of());

            Quest.QuestStep s2 = new Quest.QuestStep();
            s2.setDescription("Finish OOP in Java");
            s2.setType("LESSON_COMPLETION");
            s2.setTargetId(lesson2);

            q2.setSteps(List.of(s2));

            questRepository.saveAll(Arrays.asList(q1, q2));
        }
    }

    private void seedBadges() {
        if (badgeRepository.count() == 0) {
            Badge b1 = new Badge();
            b1.setName("First Steps");
            b1.setDescription("Complete your first lesson");
            b1.setIcon("🎓");
            b1.setConditionType("TOTAL_LESSONS");
            b1.setConditionValue(1);
            b1.setXpBonus(50);
            b1.setRarity("COMMON");

            Badge b2 = new Badge();
            b2.setName("Streak Starter");
            b2.setDescription("Maintain a 3-day streak");
            b2.setIcon("🔥");
            b2.setConditionType("STREAK_DAYS");
            b2.setConditionValue(3);
            b2.setXpBonus(100);
            b2.setRarity("RARE");

            Badge b3 = new Badge();
            b3.setName("Quest Finisher");
            b3.setDescription("Complete a quest");
            b3.setIcon("🏆");
            b3.setConditionType("QUEST_COMPLETION");
            b3.setConditionValue(1);
            b3.setXpBonus(150);
            b3.setRarity("RARE");

            badgeRepository.saveAll(Arrays.asList(b1, b2, b3));
        }
    }
}
