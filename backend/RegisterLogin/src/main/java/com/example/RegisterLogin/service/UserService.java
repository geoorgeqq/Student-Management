package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.Admin;
import com.example.RegisterLogin.entity.Student;
import com.example.RegisterLogin.entity.Teacher;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


public interface UserService {

    public Student registerUser(Student user, MultipartFile file) throws IOException;
    public Student loginStudent(String email, String password);

    public Admin loginAdmin(String email, String password);

    public Teacher loginTeacher(String email, String password);
}
