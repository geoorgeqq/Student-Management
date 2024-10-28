package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.*;
import com.example.RegisterLogin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tokens")
@CrossOrigin(origins = "http://localhost:3000")
public class TokenController {

    @Autowired
    UserService userService;

    @PostMapping("/verify-token")
    public ResponseEntity<StayLoggedInResponse> verifyToken(@RequestBody JwtTokenRequest jwtTokenRequest){
        return ResponseEntity.ok(userService.verifyToken(jwtTokenRequest.getJwtToken()));
    }
}
