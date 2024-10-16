package com.example.RegisterLogin.repository;

import com.example.RegisterLogin.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Set;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Set<Course> findByDepartmentId(Long departmentId);
    List<Course> findCoursesByTeacherId(Long teacherId);
}
