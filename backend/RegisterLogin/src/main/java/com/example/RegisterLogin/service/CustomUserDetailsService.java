package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.CustomUserDetails;
import com.example.RegisterLogin.entity.Student;
import com.example.RegisterLogin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Student student = userRepository.findByEmail(username);

        if(student == null){
            throw new UsernameNotFoundException("User not found!");
        }

        return new CustomUserDetails(student);
    }
}
