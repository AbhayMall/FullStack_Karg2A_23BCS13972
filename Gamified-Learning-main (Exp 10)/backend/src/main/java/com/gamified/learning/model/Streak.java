// Streak.java
package com.gamified.learning.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Data
@Document(collection = "streaks")
public class Streak {
    @Id
    private String id;
    private String userId;
    private LocalDate date;
    private Boolean completed = false;
}