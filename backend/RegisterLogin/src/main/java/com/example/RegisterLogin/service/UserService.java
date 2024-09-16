package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.User;
import com.example.RegisterLogin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


public interface UserService {

    public User registerUser(User user, MultipartFile file) throws IOException;
    public User login(String email, String password);
}
