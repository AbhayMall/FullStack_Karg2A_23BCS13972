package com.gamified.learning.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "quest_progress")
public class QuestProgress {
    @Id
    private String id;
    private String userId;
    private String questId;
    private LocalDateTime completedAt = LocalDateTime.now();
    private Integer xpEarned;
    private Boolean isCompleted = true;
}