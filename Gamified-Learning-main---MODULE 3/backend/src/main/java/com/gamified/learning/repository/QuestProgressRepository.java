package com.gamified.learning.repository;

import com.gamified.learning.model.QuestProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestProgressRepository extends MongoRepository<QuestProgress, String> {
    boolean existsByUserIdAndQuestId(String userId, String questId);
    long countByUserId(String userId);
}