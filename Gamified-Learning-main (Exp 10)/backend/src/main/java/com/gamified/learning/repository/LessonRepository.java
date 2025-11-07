// LessonRepository.java
package com.gamified.learning.repository;

import com.gamified.learning.model.Lesson;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LessonRepository extends MongoRepository<Lesson, String> {
    List<Lesson> findByIsActiveTrueOrderByOrderIndex();
    List<Lesson> findByDifficultyAndIsActiveTrue(String difficulty);
    Long countByIsActiveTrue();
}