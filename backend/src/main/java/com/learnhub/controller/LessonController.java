package com.learnhub.controller;

import com.learnhub.dto.ApiResponse;
import com.learnhub.entity.Course;
import com.learnhub.entity.Lesson;
import com.learnhub.repository.CourseRepository;
import com.learnhub.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LessonController {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping("/courses/{courseId}/lessons")
    public ResponseEntity<ApiResponse<List<Lesson>>> getLessonsByCourse(@PathVariable String courseId) {
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderNumberAsc(courseId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lessons fetched", lessons));
    }

    @PostMapping("/courses/{courseId}/lessons")
    public ResponseEntity<ApiResponse<Lesson>> createLesson(@PathVariable String courseId, @RequestBody Lesson lesson) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        lesson.setCourse(course);
        Lesson saved = lessonRepository.save(lesson);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Lesson created successfully", saved));
    }

    @PutMapping("/lessons/{id}")
    public ResponseEntity<ApiResponse<Lesson>> updateLesson(@PathVariable String id, @RequestBody Lesson updated) {
        return lessonRepository.findById(id)
                .map(existing -> {
                    if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
                    if (updated.getVideoUrl() != null) existing.setVideoUrl(updated.getVideoUrl());
                    if (updated.getDuration() != null) existing.setDuration(updated.getDuration());
                    Lesson saved = lessonRepository.save(existing);
                    return ResponseEntity.ok(new ApiResponse<>(true, "Lesson updated", saved));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false, "Lesson not found", null)));
    }

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(@PathVariable String id) {
        lessonRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Lesson deleted", null));
    }
}
