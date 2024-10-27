package com.example.RegisterLogin.repository;

import com.example.RegisterLogin.entity.Admin;
import com.example.RegisterLogin.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Student,Long> {
    Student findByEmail(String email);
    Student findByToken(String token);
    boolean existsByEmail(String email);

}
