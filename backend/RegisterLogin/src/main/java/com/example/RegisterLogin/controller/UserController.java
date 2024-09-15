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
@RequestMapping("/register")
@CrossOrigin("http://localhost:3000")
public class UserController {

    @Autowired
    public UserService userService;

    @PostMapping
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
}
