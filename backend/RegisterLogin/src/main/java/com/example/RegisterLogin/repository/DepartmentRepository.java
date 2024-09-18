package com.example.RegisterLogin.repository;

import com.example.RegisterLogin.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface DepartmentRepository extends JpaRepository<Department,Long> {
    @Query("SELECT d FROM Department d LEFT JOIN FETCH d.courses")
    List<Department> findAllWithCourses();
}
