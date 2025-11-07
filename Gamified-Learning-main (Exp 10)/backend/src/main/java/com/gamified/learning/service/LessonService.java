// LessonService.java
package com.gamified.learning.service;

import com.gamified.learning.model.Lesson;
import com.gamified.learning.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LessonService {
    private final LessonRepository lessonRepository;

    public List<Lesson> getAllLessons() {
        return lessonRepository.findByIsActiveTrueOrderByOrderIndex();
    }

    public Lesson getLessonById(String id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
    }

    public Lesson createLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    public Lesson updateLesson(String id, Lesson lessonDetails) {
        Lesson lesson = getLessonById(id);
        lesson.setTitle(lessonDetails.getTitle());
        lesson.setDescription(lessonDetails.getDescription());
        lesson.setContent(lessonDetails.getContent());
        lesson.setDifficulty(lessonDetails.getDifficulty());
        lesson.setXpValue(lessonDetails.getXpValue());
        lesson.setEstimatedMinutes(lessonDetails.getEstimatedMinutes());
        lesson.setTags(lessonDetails.getTags());
        return lessonRepository.save(lesson);
    }

    public void deleteLesson(String id) {
        Lesson lesson = getLessonById(id);
        lesson.setIsActive(false);
        lessonRepository.save(lesson);
    }
}