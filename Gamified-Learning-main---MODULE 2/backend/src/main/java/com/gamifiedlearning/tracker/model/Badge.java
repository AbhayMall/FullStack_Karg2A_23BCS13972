package com.gamifiedlearning.tracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "badges")
public class Badge {
    @Id
    private String id;
    
    private String name;
    private String description;
    private String iconUrl;
    private String color; // Hex color for badge styling
    private BadgeType badgeType;
    private BadgeRarity rarity;
    private Long requiredValue; // XP threshold, streak count, lesson count, etc.
    private String category; // "xp", "streak", "lessons", "quests"
    private LocalDateTime unlockDate; // When this badge was first available
    private Boolean isActive = true;
    
    @CreatedDate
    private LocalDateTime createdDate;
    
    @LastModifiedDate
    private LocalDateTime lastModifiedDate;
    
    // Constructors
    public Badge() {}
    
    public Badge(String name, String description, BadgeType badgeType, Long requiredValue, String category) {
        this.name = name;
        this.description = description;
        this.badgeType = badgeType;
        this.requiredValue = requiredValue;
        this.category = category;
        this.rarity = BadgeRarity.COMMON;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getIconUrl() { return iconUrl; }
    public void setIconUrl(String iconUrl) { this.iconUrl = iconUrl; }
    
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    
    public BadgeType getBadgeType() { return badgeType; }
    public void setBadgeType(BadgeType badgeType) { this.badgeType = badgeType; }
    
    public BadgeRarity getRarity() { return rarity; }
    public void setRarity(BadgeRarity rarity) { this.rarity = rarity; }
    
    public Long getRequiredValue() { return requiredValue; }
    public void setRequiredValue(Long requiredValue) { this.requiredValue = requiredValue; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public LocalDateTime getUnlockDate() { return unlockDate; }
    public void setUnlockDate(LocalDateTime unlockDate) { this.unlockDate = unlockDate; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
}

enum BadgeType {
    XP_MILESTONE,
    LESSON_COMPLETION,
    QUEST_COMPLETION,
    STREAK_ACHIEVEMENT,
    BADGE_COLLECTOR,
    DAILY_LEARNER,
    SPECIAL_EVENT
}

enum BadgeRarity {
    COMMON, UNCOMMON, RARE, EPIC, LEGENDARY
}
