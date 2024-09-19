package com.example.RegisterLogin.repository;

import com.example.RegisterLogin.entity.Enrollment;
import com.example.RegisterLogin.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment,Long> {
    public List<Enrollment> findByStudent(Student student);
}
