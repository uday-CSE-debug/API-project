package com.learnhub.controller;

import com.learnhub.dto.ApiResponse;
import com.learnhub.entity.Course;
import com.learnhub.entity.Enrollment;
import com.learnhub.entity.User;
import com.learnhub.repository.CourseRepository;
import com.learnhub.repository.EnrollmentRepository;
import com.learnhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<Enrollment>> createEnrollment(@RequestBody Map<String, String> body, Authentication authentication) {
        String courseId = body.get("courseId");
        if (courseId == null) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "Course ID required", null));
        }

        String email = authentication.getName();
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId)) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "You are already enrolled in this course!", null));
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .status("ACTIVE")
                .build();

        Enrollment saved = enrollmentRepository.save(enrollment);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Successfully enrolled in the course!", saved));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<Enrollment>>> getStudentEnrollments(@PathVariable String studentId) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Student enrollments retrieved", enrollments));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<Enrollment>>> getCourseEnrollments(@PathVariable String courseId) {
        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Course enrollments retrieved", enrollments));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEnrollment(@PathVariable String id) {
        if (!enrollmentRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>(false, "Enrollment not found", null));
        }
        enrollmentRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Enrollment cancelled successfully", null));
    }
}
