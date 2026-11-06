package com.learnhub.controller;

import com.learnhub.dto.ApiResponse;
import com.learnhub.entity.Course;
import com.learnhub.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Course>>> getAllCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String level) {
        
        List<Course> courses = courseRepository.searchCourses(
                search != null && search.trim().isEmpty() ? null : search,
                category != null && "All".equalsIgnoreCase(category) ? null : category,
                level != null && "All".equalsIgnoreCase(level) ? null : level
        );

        return ResponseEntity.ok(new ApiResponse<>(true, "Courses retrieved successfully", courses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> getCourseById(@PathVariable String id) {
        return courseRepository.findById(id)
                .map(course -> ResponseEntity.ok(new ApiResponse<>(true, "Course details fetched", course)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Course not found", null)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Course>> createCourse(@RequestBody Course course) {
        Course saved = courseRepository.save(course);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Course created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Course>> updateCourse(@PathVariable String id, @RequestBody Course updated) {
        return courseRepository.findById(id)
                .map(existing -> {
                    if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
                    if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
                    if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
                    if (updated.getLevel() != null) existing.setLevel(updated.getLevel());
                    if (updated.getPrice() != null) existing.setPrice(updated.getPrice());
                    Course saved = courseRepository.save(existing);
                    return ResponseEntity.ok(new ApiResponse<>(true, "Course updated successfully", saved));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Course not found", null)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable String id) {
        if (!courseRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Course not found", null));
        }
        courseRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Course deleted successfully", null));
    }
}
