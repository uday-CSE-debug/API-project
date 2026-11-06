package com.learnhub.repository;

import com.learnhub.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, String> {
    List<Enrollment> findByStudentId(String studentId);
    List<Enrollment> findByCourseId(String courseId);
    Optional<Enrollment> findByStudentIdAndCourseId(String studentId, String courseId);
    Boolean existsByStudentIdAndCourseId(String studentId, String courseId);
    Long countByCourseId(String courseId);
}
