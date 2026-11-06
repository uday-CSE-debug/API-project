package com.learnhub.repository;

import com.learnhub.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, String> {
    Optional<LessonProgress> findByStudentIdAndLessonId(String studentId, String lessonId);
    List<LessonProgress> findByStudentIdAndCompletedTrue(String studentId);
    Long countByStudentIdAndCompletedTrueAndLessonCourseId(String studentId, String courseId);
}
