package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.Teacher;
import com.example.RegisterLogin.service.UserService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@CrossOrigin("http://localhost:3000")
@RequestMapping("/teacher")
public class TeacherController {

    @Autowired
    UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Teacher> login(@RequestParam("email") String email, @RequestParam("password") String password) {
        Teacher user = new Teacher();
        user.setEmail(email);
        user.setPassword(password);

        Teacher savedUser = userService.loginTeacher(user.getEmail(), user.getPassword());
        if(savedUser != null){
            return ResponseEntity.ok(savedUser);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


}
