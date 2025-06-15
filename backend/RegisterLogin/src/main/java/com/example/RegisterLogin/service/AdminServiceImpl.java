package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.Admin;
import com.example.RegisterLogin.entity.LoginRequest;
import com.example.RegisterLogin.entity.LoginResponse;
import com.example.RegisterLogin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl {
    @Autowired
    public AdminRepository adminRepository;
    @Autowired
    public AuthenticationManager manager;
    @Autowired
    JwtService jwtService;

    public LoginResponse loginAdmin(LoginRequest loginRequest) {
        // facem verificare la autentificare
        Authentication authentication = manager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),loginRequest.getPassword()));

        if(authentication !=null){
            if(loginRequest.isChecked() ){
                return new LoginResponse(adminRepository.findByEmail(loginRequest.getEmail()), jwtService.generateNoExpiryToken(loginRequest.getEmail()));
            }
            return new LoginResponse(adminRepository.findByEmail(loginRequest.getEmail()),jwtService.generateToken(loginRequest.getEmail()));
        }
        return null;
    }
}
