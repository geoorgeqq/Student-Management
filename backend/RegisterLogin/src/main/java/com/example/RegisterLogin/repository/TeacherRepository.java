package com.example.RegisterLogin.repository;

import com.example.RegisterLogin.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher,Long> {

    Teacher findByEmail(String email);
    List<Teacher> findTeachersByDepartmentId(Long departmentId);
}
