package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.*;
import com.example.RegisterLogin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/student")
public class StudentController {

    @Autowired
    public UserService userService;

    @GetMapping("")
    public ResponseEntity<List<Student>> getStudents() {
        List<Student> students = userService.getStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable("id") Long id) {
        if (userService.findStudentById(id) != null) {
            return ResponseEntity.ok(userService.findStudentById(id));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Student> register(@RequestParam("name") String name,
                                            @RequestParam("email") String email,
                                            @RequestParam("password") String password,
                                            @RequestParam(value = "department_id", required = false) Long department_id,
                                            @RequestParam(value = "dateOfBirth", required = false) java.sql.Date dateOfBirth,
                                            @RequestParam(value = "pic", required = false) MultipartFile pic) {
        Student user = new Student();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password); // Consider hashing this password for security
        Department department = userService.getDepartmentByDepartmentId(department_id);
        user.setDepartment(department);
        user.setDateOfBirth(dateOfBirth);

        try {
            Student savedUser = userService.registerUser(user, pic);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Student> login(@RequestParam("email") String email, @RequestParam("password") String password) {
        Student savedUser = userService.loginStudent(email, password);
        if (savedUser != null) {
            return ResponseEntity.ok(savedUser);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/enroll")
    public ResponseEntity<EnrollmentResponse> enroll(@RequestBody EnrollmentRequest request) {
        Long studentId = request.getStudentId();
        Long courseId = request.getCourseId();

        // Log the received parameters for debugging
        System.out.println("Received studentId: " + studentId + ", courseId: " + courseId);

        try {
            Enrollment enrollment = userService.addEnrollment(studentId, courseId);
            return ResponseEntity.ok(new EnrollmentResponse(enrollment, enrollment.getCourse().getCourseName()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/enrolled/{studentId}")
    public ResponseEntity<Set<Course>> getEnrolledCourses(@PathVariable("studentId") Long studentId) {
        Set<Course> enrolledCourses = userService.getEnrolledCoursesByStudentId(studentId);
        return ResponseEntity.ok(enrolledCourses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudentInfo(@PathVariable("id") Long id, @RequestBody Student student){
        Student tempStudent = userService.updateStudentById(id, student);
        if(tempStudent !=null){
            return ResponseEntity.ok(tempStudent);
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable("id") Long id){
        userService.deleteStudentById(id);
        return ResponseEntity.ok("User Deleted");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email){
        Student student = userService.findStudentByEmail(email);

        if(student != null){
            String token = userService.generateResetToken();
            userService.saveTokenAndExpiryDate(student,token, "15");
            userService.sendResetEmail(email,token);
        }
        return ResponseEntity.ok("Email Sent!");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Student> resetPassword(@RequestBody ResetPasswordBody resetPasswordBody){
        Student student = userService.findStudentByToken(resetPasswordBody.getToken());
        Student updatedStudent = userService.saveStudentNewPassword(student,resetPasswordBody.getNewPassword());
        return ResponseEntity.ok(updatedStudent);
    }
}
