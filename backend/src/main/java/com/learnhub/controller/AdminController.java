package com.learnhub.controller;

import com.learnhub.dto.ApiResponse;
import com.learnhub.entity.User;
import com.learnhub.repository.CourseRepository;
import com.learnhub.repository.EnrollmentRepository;
import com.learnhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalStudents", userRepository.countByRole("STUDENT"));
        stats.put("totalInstructors", userRepository.countByRole("INSTRUCTOR"));
        stats.put("totalCourses", courseRepository.count());
        stats.put("totalEnrollments", enrollmentRepository.count());

        return ResponseEntity.ok(new ApiResponse<>(true, "Admin statistics fetched", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, "Users fetched", users));
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<User>> updateUserStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {

        String status = body.get("status");
        return userRepository.findById(id)
                .map(user -> {
                    user.setStatus(status);
                    User saved = userRepository.save(user);
                    return ResponseEntity.ok(new ApiResponse<>(true, "User status updated to " + status, saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
