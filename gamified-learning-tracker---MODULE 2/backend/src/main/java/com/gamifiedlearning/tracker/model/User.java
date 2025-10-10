package com.gamifiedlearning.tracker.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String username;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;
    
    private Set<Role> roles = new HashSet<>();
    
    // Gamification fields
    private Long totalXp = 0L;
    private Integer currentStreak = 0;
    private Integer longestStreak = 0;
    private LocalDateTime lastActivityDate;
    private List<String> unlockedBadges = new ArrayList<>();
    private List<String> completedLessons = new ArrayList<>();
    private List<String> completedQuests = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdDate;
    
    @LastModifiedDate
    private LocalDateTime lastModifiedDate;
    
    // Constructors
    public User() {}
    
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles.add(Role.ROLE_USER);
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
    
    public Long getTotalXp() { return totalXp; }
    public void setTotalXp(Long totalXp) { this.totalXp = totalXp; }
    
    public Integer getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(Integer currentStreak) { this.currentStreak = currentStreak; }
    
    public Integer getLongestStreak() { return longestStreak; }
    public void setLongestStreak(Integer longestStreak) { this.longestStreak = longestStreak; }
    
    public LocalDateTime getLastActivityDate() { return lastActivityDate; }
    public void setLastActivityDate(LocalDateTime lastActivityDate) { this.lastActivityDate = lastActivityDate; }
    
    public List<String> getUnlockedBadges() { return unlockedBadges; }
    public void setUnlockedBadges(List<String> unlockedBadges) { this.unlockedBadges = unlockedBadges; }
    
    public List<String> getCompletedLessons() { return completedLessons; }
    public void setCompletedLessons(List<String> completedLessons) { this.completedLessons = completedLessons; }
    
    public List<String> getCompletedQuests() { return completedQuests; }
    public void setCompletedQuests(List<String> completedQuests) { this.completedQuests = completedQuests; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public LocalDateTime getLastModifiedDate() { return lastModifiedDate; }
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) { this.lastModifiedDate = lastModifiedDate; }
}

enum Role {
    ROLE_USER, ROLE_ADMIN
}