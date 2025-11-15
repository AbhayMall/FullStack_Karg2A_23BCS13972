// Quest.java
package com.gamified.learning.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
//import java.util.Map;
@Data
@Document(collection = "quests")
public class Quest {
    @Id
    private String id;
    private String title;
    private String description;
    private List<QuestStep> steps;
    private List<Question> questions; // Quiz questions for the quest
    private Integer xpReward;
    private String difficulty;
    private List<String> prerequisites;
    private List<String> requiredLessonIds;
    private Boolean isActive = true;
    
    @Data
    public static class QuestStep {
        private String description;
        private String type; // LESSON_COMPLETION, QUIZ, etc.
        private String targetId; // lessonId or quizId
        private Boolean isCompleted = false;
    }
    
    @Data
    public static class Question {
        private String questionText;
        private List<String> options; // Multiple choice options
        private Integer correctAnswerIndex; // Index of correct answer (0-based)
        private String explanation; // Optional explanation for the answer
    }
}
