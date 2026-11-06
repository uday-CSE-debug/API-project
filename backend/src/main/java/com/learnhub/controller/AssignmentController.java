package com.learnhub.controller;

import com.learnhub.dto.ApiResponse;
import com.learnhub.entity.Assignment;
import com.learnhub.entity.Submission;
import com.learnhub.entity.User;
import com.learnhub.repository.AssignmentRepository;
import com.learnhub.repository.SubmissionRepository;
import com.learnhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/assignments")
    public ResponseEntity<ApiResponse<List<Assignment>>> getAssignments(@RequestParam(required = false) String courseId) {
        List<Assignment> assignments = courseId != null ? 
                assignmentRepository.findByCourseId(courseId) : 
                assignmentRepository.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "Assignments fetched", assignments));
    }

    @PostMapping("/assignments")
    public ResponseEntity<ApiResponse<Assignment>> createAssignment(@RequestBody Assignment assignment) {
        Assignment saved = assignmentRepository.save(assignment);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Assignment created", saved));
    }

    @PostMapping("/assignments/{id}/submit")
    public ResponseEntity<ApiResponse<Submission>> submitAssignment(
            @PathVariable String id,
            @RequestBody Submission submissionReq,
            Authentication authentication) {

        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        User student = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Submission submission = submissionRepository.findByAssignmentIdAndStudentId(id, student.getId())
                .orElse(Submission.builder().assignment(assignment).student(student).build());

        submission.setSubmissionText(submissionReq.getSubmissionText());
        submission.setFileUrl(submissionReq.getFileUrl());
        submission.setStatus("PENDING");

        Submission saved = submissionRepository.save(submission);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Assignment submitted successfully!", saved));
    }

    @PutMapping("/submissions/{id}")
    public ResponseEntity<ApiResponse<Submission>> gradeSubmission(
            @PathVariable String id,
            @RequestBody Submission gradeReq) {

        return submissionRepository.findById(id)
                .map(sub -> {
                    sub.setMarksObtained(gradeReq.getMarksObtained());
                    sub.setFeedback(gradeReq.getFeedback());
                    sub.setStatus("GRADED");
                    Submission saved = submissionRepository.save(sub);
                    return ResponseEntity.ok(new ApiResponse<>(true, "Submission graded", saved));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false, "Submission not found", null)));
    }
}
