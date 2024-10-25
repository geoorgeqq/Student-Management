package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.CourseScheduleRequest;
import com.example.RegisterLogin.entity.*;
import com.example.RegisterLogin.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public Student registerUser(Student user, MultipartFile pic, String token) throws IOException {
        if (pic != null) {
            user.setPic(pic.getBytes());
        }
        user.setToken(token);
//        emailService.sendVerificationEmail(user.getEmail(), token);
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Student loginStudent(String email, String password) {
        // facem veirifcare la autentificare
        Authentication authentication = manager.authenticate(new UsernamePasswordAuthenticationToken(email,password));

        if(authentication !=null){
            jwtService.generateToken(email);
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
    public Student updateStudentById(Long id, Student updatedStudent) {
        Student existingStudent = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found!"));

        // Update basic fields
        existingStudent.setDepartment(updatedStudent.getDepartment());
        existingStudent.setName(updatedStudent.getName());
        existingStudent.setPic(updatedStudent.getPic());
        existingStudent.setPassword(updatedStudent.getPassword());
        existingStudent.setDateOfBirth(updatedStudent.getDateOfBirth());
        existingStudent.setEmail(updatedStudent.getEmail());

        // Update enrollments in place (without replacing the collection)
        enrollmentService.updateEnrollments(existingStudent, updatedStudent.getEnrollments());

        return userRepository.save(existingStudent);
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
