package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.Course;
import com.example.RegisterLogin.entity.Department;
import com.example.RegisterLogin.entity.Enrollment;
import com.example.RegisterLogin.entity.Student;
import com.example.RegisterLogin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/student")
public class StudentController {

    @Autowired
    public UserService userService;

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
            Student savedUser = userService.registerUser(user,pic);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        }catch (Exception e){
            return new ResponseEntity<>(null,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Student> login (@RequestParam("email") String email, @RequestParam("password") String password){
        Student user = new Student();
        user.setEmail(email);
        user.setPassword(password);
            Student savedUser = userService.loginStudent(user.getEmail(), user.getPassword());
            if(savedUser != null){
                user.setName(savedUser.getName());
                user.setPic(savedUser.getPic());
                return ResponseEntity.ok(user);
            }else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getCourses(){
       return ResponseEntity.ok(userService.getCourses());
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getDepartments(){
        List<Department> departments = userService.getDepartmentsWithCourses();
        return ResponseEntity.ok(departments);
    }
}
