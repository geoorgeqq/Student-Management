package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.User;
import com.example.RegisterLogin.repository.UserRepository;
import com.example.RegisterLogin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@CrossOrigin("http://localhost:3000")
public class UserController {

    @Autowired
    public UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestParam("name") String name,
                                         @RequestParam("email") String email,
                                         @RequestParam("password") String password,
                                         @RequestParam(value = "department_id", required = false) Long department_id,
                                         @RequestParam(value = "dateOfBirth", required = false) java.sql.Date dateOfBirth,
                                         @RequestParam(value = "pic", required = false) MultipartFile pic) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password); // Consider hashing this password for security
        user.setDepartment_id(department_id);
        user.setDateOfBirth(dateOfBirth);

        try {
            User savedUser = userService.registerUser(user,pic);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        }catch (Exception e){
            return new ResponseEntity<>(null,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login/student")
    public ResponseEntity<User> login (@RequestParam("email") String email, @RequestParam("password") String password){
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
            User savedUser = userService.login(user.getEmail(), user.getPassword());
            if(savedUser != null){
                return ResponseEntity.ok(user);
            }else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
    }
}
