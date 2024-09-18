package com.example.RegisterLogin.repository;

import com.example.RegisterLogin.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRepository extends JpaRepository<Enrollment,Long> {
}
