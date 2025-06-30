package com.example.RegisterLogin.service;

import com.example.RegisterLogin.controller.StayLoggedInResponse;
import com.example.RegisterLogin.entity.CourseScheduleRequest;
import com.example.RegisterLogin.entity.*;
import com.example.RegisterLogin.repository.*;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailServiceImpl emailService;
    @Autowired
    EnrollmentServiceImpl enrollmentService;
    @Autowired
    AuthenticationManager manager;
    @Autowired
    JwtService jwtService;
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private CourseRepository courseRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    @Override
    public Student registerUser(Student user, MultipartFile pic, String token) throws IOException {
        if (pic != null) {
            user.setPic(pic.getBytes());
        }
        user.setToken(token);
        emailService.sendVerificationEmail(user.getEmail(), token);
        user.setPassword(encoder.encode(user.getPassword()));
        Student savedStudent = userRepository.save(user);

        // Enroll in up to 5 courses from their department
        if (user.getDepartment() != null) {
            List<Course> departmentCourses = courseRepository.findByDepartmentId(user.getDepartment().getId()).stream().toList();
            int count = 0;
            for (Course course : departmentCourses) {
                if (count >= 5) break;
                enrollmentService.addEnrollment(savedStudent.getId(), course.getId());
                count++;
            }
        }
        return savedStudent;
    }

    @Override
    public LoginResponse loginStudent(LoginRequest loginRequest) {
        // facem verificare la autentificare
        Authentication authentication = manager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),loginRequest.getPassword()));

        if(authentication !=null){
            if(loginRequest.isChecked() ){
                return new LoginResponse(userRepository.findByEmail(loginRequest.getEmail()), jwtService.generateNoExpiryToken(loginRequest.getEmail()));
            }
            return new LoginResponse(userRepository.findByEmail(loginRequest.getEmail()),jwtService.generateToken(loginRequest.getEmail()));
        }
        return null;
    }

    @Override
    public Student findStudentByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Student saveTokenAndExpiryDate(Student student, String token, String expiryDate) {
        student.setToken(token);
        student.setTokenExpiryDate(expiryDate);
        return userRepository.save(student);
    }

    @Override
    public Student findStudentByToken(String token) {
        return userRepository.findByToken(token);
    }

    @Override
    public Student saveStudentNewPassword(Student student, String newPassword) {
        student.setPassword(newPassword);
        student.setToken(null);
        return userRepository.save(student);
    }

    @Override
    public String generateToken() {
        return UUID.randomUUID().toString();
    }

    @Override
    public Student findStudentById(Long id) {
        Student tempStudent = userRepository.findById(id).orElse(null);
        return tempStudent;
    }


    @Override
    public List<Student> getStudents() {
        List<Student> students = userRepository.findAll();
        return students;

    }

    @Override
    public void deleteStudentById(Long id) {
        Student tempStudent = userRepository.findById(id).orElse(null);
        if (tempStudent != null) {
            userRepository.delete(tempStudent);
        }
    }

    @Override
    public LoginResponse updateStudentById(Long id, Student updatedStudent) {
        Student existingStudent = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found!"));

        // Update basic fields
        existingStudent.setDepartment(updatedStudent.getDepartment());
        existingStudent.setName(updatedStudent.getName());
        existingStudent.setPic(updatedStudent.getPic());

        if (updatedStudent.getPassword() != null && !updatedStudent.getPassword().isEmpty()) {
            existingStudent.setPassword(encoder.encode(updatedStudent.getPassword()));
        }

        existingStudent.setDateOfBirth(updatedStudent.getDateOfBirth());
        existingStudent.setEmail(updatedStudent.getEmail());

        // Update enrollments in place (without replacing the collection)
        enrollmentService.updateEnrollments(existingStudent, updatedStudent.getEnrollments());
        Student tempStudent = userRepository.save(existingStudent);
        String jwtToken = jwtService.generateToken(tempStudent.getEmail());
        return new LoginResponse(tempStudent,jwtToken);

    }

    @Override
    public StayLoggedInResponse verifyToken(String token) {
        if (userRepository.existsByEmail(jwtService.extractUserName(token))) {
            Student student = userRepository.findByEmail(jwtService.extractUserName(token));
            return new StayLoggedInResponse(student,token,"student");
        } else if (teacherRepository.existsByEmail(jwtService.extractUserName(token))) {
            Teacher teacher = teacherRepository.findByEmail(jwtService.extractUserName(token));
            return new StayLoggedInResponse(teacher,token, "teacher");
        } else if (adminRepository.existsByEmail(jwtService.extractUserName(token))) {
            Admin admin = adminRepository.findByEmail(jwtService.extractUserName(token));
            return new StayLoggedInResponse(admin,token,"admin");
        } else {
            throw new UsernameNotFoundException("User not found!");
        }
    }

    @Override
    public Student setUserVerified(String token) {
        Student student = findStudentByToken(token);
        if (student != null) {
            student.setVerified(true);
            student.setToken(null);
            return userRepository.save(student);
        }
        return null;
    }


}
