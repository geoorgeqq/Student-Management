package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.Admin;
import com.example.RegisterLogin.repository.AdminRepository;
import com.example.RegisterLogin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Admin> login(@RequestParam("email") String email,
                                       @RequestParam("password") String password){
        Admin user = new Admin();
        user.setEmail(email);
        user.setPassword(password);

        Admin savedAdmin = userService.loginAdmin(user.getEmail(), user.getPassword());
        if(savedAdmin != null){
            return ResponseEntity.ok(savedAdmin);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

    }
}
