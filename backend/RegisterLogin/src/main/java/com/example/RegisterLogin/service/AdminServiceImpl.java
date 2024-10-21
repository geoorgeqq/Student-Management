package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.Admin;
import com.example.RegisterLogin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl {
    @Autowired
    public AdminRepository adminRepository;

    public Admin loginAdmin(String email, String password) {
        Admin user = adminRepository.findByEmail(email);
        if (user != null && password.equals(user.getPassword())) {
            return user;
        } else {
            return null;
        }
    }
}
