// ProgressRepository.java
package com.gamified.learning.repository;

import com.gamified.learning.model.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends MongoRepository<Progress, String> {
    List<Progress> findByUserId(String userId);
    Optional<Progress> findByUserIdAndLessonId(String userId, String lessonId);
    Long countByUserId(String userId);
    Boolean existsByUserIdAndLessonId(String userId, String lessonId);
}