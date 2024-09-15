package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.User;
import com.example.RegisterLogin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user, MultipartFile pic) throws IOException {
        if(pic != null){
            user.setPic(pic.getBytes());
        }

        return userRepository.save(user);
    }
}
