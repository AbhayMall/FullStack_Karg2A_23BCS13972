
// Progress.java
package com.gamified.learning.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "progress")
public class Progress {
    @Id
    private String id;
    private String userId;
    private String lessonId;
    private LocalDateTime completedAt = LocalDateTime.now();
    private Integer xpEarned;
    private Boolean isCompleted = true;
}