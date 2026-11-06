package com.learnhub.repository;

import com.learnhub.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, String> {
    List<Submission> findByAssignmentId(String assignmentId);
    List<Submission> findByStudentId(String studentId);
    Optional<Submission> findByAssignmentIdAndStudentId(String assignmentId, String studentId);
}
