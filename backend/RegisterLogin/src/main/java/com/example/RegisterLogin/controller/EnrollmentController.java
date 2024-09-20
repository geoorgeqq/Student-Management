package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.Enrollment;
import com.example.RegisterLogin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http:localhost:3000")
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    public UserService userService;

    @GetMapping("")
    public ResponseEntity<List<Enrollment>> getEnrollments(){
        return ResponseEntity.ok(userService.getEnrollments());
    }


}
