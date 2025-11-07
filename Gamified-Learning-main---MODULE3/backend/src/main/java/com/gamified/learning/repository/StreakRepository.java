// StreakRepository.java
package com.gamified.learning.repository;

import com.gamified.learning.model.Streak;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface StreakRepository extends MongoRepository<Streak, String> {
    Optional<Streak> findByUserIdAndDate(String userId, LocalDate date);
    List<Streak> findByUserIdAndDateBetween(String userId, LocalDate start, LocalDate end);
    Long countByUserIdAndCompletedTrue(String userId);
}