// QuestRepository.java
package com.gamified.learning.repository;

import com.gamified.learning.model.Quest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestRepository extends MongoRepository<Quest, String> {
    List<Quest> findByIsActiveTrue();
    List<Quest> findByDifficultyAndIsActiveTrue(String difficulty);

    Long countByIsActiveTrue();
}
