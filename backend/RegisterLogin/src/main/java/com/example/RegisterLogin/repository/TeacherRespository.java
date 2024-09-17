package com.example.RegisterLogin.repository;

import com.example.RegisterLogin.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherRespository extends JpaRepository<Teacher,Long> {

    Teacher findByEmail(String email);
}
