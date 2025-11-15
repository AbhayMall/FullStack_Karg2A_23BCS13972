// QuestController.java
package com.gamified.learning.controller;

import com.gamified.learning.dto.ApiResponse;
import com.gamified.learning.model.Quest;
import com.gamified.learning.service.BadgeService;
import com.gamified.learning.service.JwtService;
import com.gamified.learning.service.QuestService;
import com.gamified.learning.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/quests")
@RequiredArgsConstructor
public class QuestController {
    private final QuestService questService;
    private final JwtService jwtService;
    private final UserService userService;
    private final BadgeService badgeService;

    @GetMapping
    public ResponseEntity<ApiResponse> getAllQuests() {
        try {
            List<Quest> quests = questService.getAllQuests();
            return ResponseEntity.ok(ApiResponse.success("Quests fetched successfully", quests));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getQuestById(@PathVariable String id) {
        try {
            Quest quest = questService.getQuestById(id);
            return ResponseEntity.ok(ApiResponse.success("Quest fetched successfully", quest));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createQuest(@RequestBody Quest quest) {
        try {
            Quest createdQuest = questService.createQuest(quest);
            return ResponseEntity.ok(ApiResponse.success("Quest created successfully", createdQuest));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<ApiResponse> completeQuest(@PathVariable("id") String questId,
                                                     @RequestHeader(value = "Authorization", required = false) String tokenHeader) {
        try {
            var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            String username = null;
            if (auth != null && auth.isAuthenticated()) {
                username = auth.getName();
            } else if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
                username = jwtService.extractUsername(tokenHeader.substring(7));
            } else {
                return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
            }
            var user = (com.gamified.learning.model.User) userService.loadUserByUsername(username);
            var result = questService.completeQuest(user.getId(), questId);
            // Award badges related to quest completion
            badgeService.checkAndAwardBadges(user.getId(), "QUEST_COMPLETION");
            return ResponseEntity.ok(ApiResponse.success("Quest completed successfully", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/submit-quiz")
    public ResponseEntity<ApiResponse> submitQuiz(@PathVariable("id") String questId,
                                                   @RequestBody List<Integer> answers,
                                                   @RequestHeader(value = "Authorization", required = false) String tokenHeader) {
        try {
            var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            String username = null;
            if (auth != null && auth.isAuthenticated()) {
                username = auth.getName();
            } else if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
                username = jwtService.extractUsername(tokenHeader.substring(7));
            } else {
                return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
            }
            var user = (com.gamified.learning.model.User) userService.loadUserByUsername(username);
            var result = questService.validateQuizAndCompleteQuest(user.getId(), questId, answers);
            // Award badges only if completion succeeded
            if (Boolean.TRUE.equals(result.get("success"))) {
                badgeService.checkAndAwardBadges(user.getId(), "QUEST_COMPLETION");
            }
            return ResponseEntity.ok(ApiResponse.success("Quiz submitted", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
