package com.learnhub.repository;

import com.learnhub.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByInstructorId(String instructorId);
    List<Course> findByCategory(String category);
    List<Course> findByLevel(String level);

    @Query("SELECT c FROM Course c WHERE " +
           "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:level IS NULL OR c.level = :level)")
    List<Course> searchCourses(@Param("search") String search, @Param("category") String category, @Param("level") String level);
}
