package com.learnhub.controller;

import com.learnhub.dto.ApiResponse;
import com.learnhub.entity.*;
import com.learnhub.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Quiz>> createQuiz(@RequestBody Quiz quiz) {
        Quiz saved = quizRepository.save(quiz);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Quiz created successfully", saved));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Quiz>> getQuizById(@PathVariable String id) {
        return quizRepository.findById(id)
                .map(q -> ResponseEntity.ok(new ApiResponse<>(true, "Quiz details", q)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false, "Quiz not found", null)));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitQuiz(
            @PathVariable String id,
            @RequestBody Map<String, Map<String, String>> body,
            Authentication authentication) {

        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        User student = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Map<String, String> answers = body.get("answers");
        int score = 0;
        int totalMarks = 0;

        if (quiz.getQuestions() != null) {
            for (Question q : quiz.getQuestions()) {
                totalMarks += q.getMarks();
                String ans = answers != null ? answers.get(q.getId()) : null;
                if (q.getCorrectAnswer().equalsIgnoreCase(ans)) {
                    score += q.getMarks();
                }
            }
        }

        double percentage = totalMarks > 0 ? ((double) score / totalMarks) * 100 : 0;
        boolean passed = percentage >= 50;

        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz)
                .student(student)
                .score(score)
                .totalMarks(totalMarks)
                .percentage(percentage)
                .passed(passed)
                .build();

        quizAttemptRepository.save(attempt);

        Map<String, Object> result = new HashMap<>();
        result.put("score", score);
        result.put("totalMarks", totalMarks);
        result.put("percentage", percentage);
        result.put("passed", passed);

        return ResponseEntity.ok(new ApiResponse<>(true, "Quiz submitted successfully", result));
    }
}
