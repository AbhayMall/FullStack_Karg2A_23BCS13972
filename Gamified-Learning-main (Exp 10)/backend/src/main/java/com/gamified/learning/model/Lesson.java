
// Lesson.java
package com.gamified.learning.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "lessons")
public class Lesson {
    @Id
    private String id;
    private String title;
    private String description;
    private String content;
    private String difficulty; // EASY, MEDIUM, HARD
    private Integer xpValue;
    private Integer estimatedMinutes;
    private List<String> tags;
    private Integer orderIndex;
    private Boolean isActive = true;
    private String createdBy;
}