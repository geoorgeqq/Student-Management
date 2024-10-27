package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.Admin;
import com.example.RegisterLogin.entity.LoginRequest;
import com.example.RegisterLogin.entity.LoginResponse;
import com.example.RegisterLogin.repository.AdminRepository;
import com.example.RegisterLogin.service.AdminServiceImpl;
import com.example.RegisterLogin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    UserService userService;
    @Autowired
    AdminServiceImpl adminService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        Admin user = new Admin();
        user.setEmail(loginRequest.getEmail());
        user.setPassword(loginRequest.getPassword());

        LoginResponse savedAdmin = adminService.loginAdmin(user.getEmail(), user.getPassword());
        if(savedAdmin != null){
            return ResponseEntity.ok(savedAdmin);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

    }
}
