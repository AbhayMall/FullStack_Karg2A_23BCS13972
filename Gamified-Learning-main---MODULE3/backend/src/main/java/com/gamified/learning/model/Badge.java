
// Badge.java
package com.gamified.learning.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "badges")
public class Badge {
    @Id
    private String id;
    private String name;
    private String description;
    private String icon;
    private String conditionType; // STREAK_DAYS, TOTAL_LESSONS, TOTAL_XP, QUEST_COMPLETION
    private Integer conditionValue;
    private Integer xpBonus;
    private String rarity; // COMMON, RARE, EPIC, LEGENDARY
}