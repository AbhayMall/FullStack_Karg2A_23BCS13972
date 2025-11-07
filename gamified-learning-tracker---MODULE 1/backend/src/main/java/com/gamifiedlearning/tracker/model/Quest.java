package com.gamifiedlearning.tracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "quests")
public class Quest {
    @Id
    private String id;
    
    private String title;
    private String description;
    private List<QuestStep> steps = new ArrayList<>();
    private Integer difficulty; // 1-5 scale
    private Long xpReward;
    private String badgeReward; // Badge ID to unlock
    private Boolean isActive = true;
    
    @CreatedDate
    private LocalDateTime createdDate;
    
    @LastModifiedDate
    private LocalDateTime lastModifiedDate;
    
    // Constructors
    public Quest() {}
    
    public Quest(String title, String description, Integer difficulty, Long xpReward) {
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.xpReward = xpReward;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public List<QuestStep> getSteps() { return steps; }
    public void setSteps(List<QuestStep> steps) { this.steps = steps; }
    
    public Integer getDifficulty() { return difficulty; }
    public void setDifficulty(Integer difficulty) { this.difficulty = difficulty; }
    
    public Long getXpReward() { return xpReward; }
    public void setXpReward(Long xpReward) { this.xpReward = xpReward; }
    
    public String getBadgeReward() { return badgeReward; }
    public void setBadgeReward(String badgeReward) { this.badgeReward = badgeReward; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
}

class QuestStep {
    private String title;
    private String description;
    private String type; // "lesson", "streak", "xp_target"
    private String targetId; // lessonId for lesson type, null for others
    private Integer targetValue; // streak count, XP amount, etc.
    
    public QuestStep() {}
    
    public QuestStep(String title, String description, String type, Integer targetValue) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.targetValue = targetValue;
    }
    
    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }
    
    public Integer getTargetValue() { return targetValue; }
    public void setTargetValue(Integer targetValue) { this.targetValue = targetValue; }
}