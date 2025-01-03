package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.Enrollment;
import com.example.RegisterLogin.service.EnrollmentServiceImpl;
import com.example.RegisterLogin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http:localhost:3000")
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    public UserService userService;
    @Autowired
    public EnrollmentServiceImpl enrollmentService;

    @GetMapping("")
    public ResponseEntity<List<Enrollment>> getEnrollments(){
        return ResponseEntity.ok(enrollmentService.getEnrollments());
    }

    @GetMapping("{courseId}")
    public ResponseEntity<Set<Enrollment>> getEnrollmentsByCourseId(@PathVariable Long courseId){
        return ResponseEntity.ok(enrollmentService.findEnrollmentsByCourseId(courseId));
    }


}
