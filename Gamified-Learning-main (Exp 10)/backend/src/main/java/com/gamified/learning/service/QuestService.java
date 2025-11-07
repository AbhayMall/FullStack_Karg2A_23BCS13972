// QuestService.java
package com.gamified.learning.service;

import com.gamified.learning.model.Quest;
import com.gamified.learning.model.User;
import com.gamified.learning.repository.QuestRepository;
import com.gamified.learning.repository.UserRepository;
import com.gamified.learning.repository.QuestProgressRepository;
import com.gamified.learning.model.QuestProgress;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class QuestService {
    private final QuestRepository questRepository;
    private final UserRepository userRepository;
    private final QuestProgressRepository questProgressRepository;

    public List<Quest> getAllQuests() {
        return questRepository.findByIsActiveTrue();
    }

    public Quest getQuestById(String id) {
        return questRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quest not found"));
    }

    public Quest createQuest(Quest quest) {
        return questRepository.save(quest);
    }

    public Quest updateQuest(String id, Quest questDetails) {
        Quest quest = getQuestById(id);
        quest.setTitle(questDetails.getTitle());
        quest.setDescription(questDetails.getDescription());
        quest.setSteps(questDetails.getSteps());
        quest.setXpReward(questDetails.getXpReward());
        quest.setDifficulty(questDetails.getDifficulty());
        quest.setPrerequisites(questDetails.getPrerequisites());
        return questRepository.save(quest);
    }

    public void deleteQuest(String id) {
        Quest quest = getQuestById(id);
        quest.setIsActive(false);
        questRepository.save(quest);
    }

    public Map<String, Object> validateQuizAndCompleteQuest(String userId, String questId, List<Integer> answers) {
        Quest quest = getQuestById(questId);

        // Validate quiz presence
        if (quest.getQuestions() == null || quest.getQuestions().isEmpty()) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "Quest has no quiz questions");
            return result;
        }
        // Validate all questions are answered
        if (answers == null || answers.size() != quest.getQuestions().size()) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "All questions must be answered");
            return result;
        }
        // Prevent duplicate completion
        if (questProgressRepository.existsByUserIdAndQuestId(userId, questId)) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "Quest already completed");
            return result;
        }

        int correctCount = 0;
        for (int i = 0; i < quest.getQuestions().size(); i++) {
            Integer correctIdx = quest.getQuestions().get(i).getCorrectAnswerIndex();
            Integer given = answers.get(i);
            if (correctIdx != null && correctIdx.equals(given)) {
                correctCount++;
            }
        }
        boolean allCorrect = (correctCount == quest.getQuestions().size());
        int xpAwarded = allCorrect
                ? (quest.getXpReward() == null ? quest.getQuestions().size() * 10 : quest.getXpReward())
                : correctCount * 10; // +10 per correct when not all correct

        // Persist quest completion and award XP
        Map<String, Object> result = completeQuestWithXp(userId, questId, xpAwarded, correctCount, quest.getQuestions().size());
        result.put("allCorrect", allCorrect);
        return result;
    }
    
    public Map<String, Object> completeQuest(String userId, String questId) {
        Quest quest = getQuestById(questId);
        int reward = quest.getXpReward() != null ? quest.getXpReward() : 0;
        return completeQuestWithXp(userId, questId, reward, null, null);
    }

    private Map<String, Object> completeQuestWithXp(String userId, String questId, int xpAwarded,
                                                    Integer correctCount, Integer totalQuestions) {
        Quest quest = getQuestById(questId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (questProgressRepository.existsByUserIdAndQuestId(userId, questId)) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "Quest already completed");
            return result;
        }

        // Record quest completion
        QuestProgress qp = new QuestProgress();
        qp.setUserId(userId);
        qp.setQuestId(questId);
        qp.setXpEarned(xpAwarded);
        questProgressRepository.save(qp);

        // Update user XP and daily XP
        if (user.getLastXpReset() == null ||
                user.getLastXpReset().toLocalDate().isBefore(LocalDate.now())) {
            user.setXpEarnedToday(0);
            user.setLastXpReset(LocalDateTime.now());
        }
        user.setTotalXP((user.getTotalXP() == null ? 0 : user.getTotalXP()) + xpAwarded);
        user.setXpEarnedToday((user.getXpEarnedToday() == null ? 0 : user.getXpEarnedToday()) + xpAwarded);
        user.setLastActivity(LocalDateTime.now());
        if (user.getCurrentStreak() == null || user.getCurrentStreak() == 0) {
            user.setCurrentStreak(1);
        }
        if (user.getCurrentStreak() > user.getLongestStreak()) {
            user.setLongestStreak(user.getCurrentStreak());
        }
        userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("questId", questId);
        result.put("xpAwarded", xpAwarded);
        if (correctCount != null) result.put("correctCount", correctCount);
        if (totalQuestions != null) result.put("totalQuestions", totalQuestions);
        result.put("totalXP", user.getTotalXP());
        return result;
    }
}
