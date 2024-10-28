package com.example.RegisterLogin.service;

import com.example.RegisterLogin.controller.StayLoggedInResponse;
import com.example.RegisterLogin.entity.CourseScheduleRequest;
import com.example.RegisterLogin.entity.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;


public interface UserService {

    public Student registerUser(Student user, MultipartFile file, String token) throws IOException;

    public LoginResponse loginStudent(LoginRequest loginRequest);

    public Student findStudentByEmail(String email);

    public Student saveTokenAndExpiryDate(Student student, String token, String expiryDate);

    public Student setUserVerified(String token);

    public Student findStudentByToken(String token);

    public Student saveStudentNewPassword(Student student, String newPassword);

    public String generateToken();

    public Student findStudentById(Long id);

    public List<Student> getStudents();

    public void deleteStudentById(Long id);

    public LoginResponse updateStudentById(Long id, Student student);

    public StayLoggedInResponse verifyToken(String token);


}
