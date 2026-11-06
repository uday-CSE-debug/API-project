package com.learnhub.repository;

import com.learnhub.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, String> {
    List<QuizAttempt> findByStudentIdAndQuizId(String studentId, String quizId);
    List<QuizAttempt> findByStudentId(String studentId);
}
