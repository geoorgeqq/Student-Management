package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.Course;
import com.example.RegisterLogin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("courses")
public class CoursesController {

    @Autowired
    public UserService userService;

    @GetMapping("")
    public ResponseEntity<List<Course>> getCourses(){
        return ResponseEntity.ok(userService.getCourses());
    }
}
