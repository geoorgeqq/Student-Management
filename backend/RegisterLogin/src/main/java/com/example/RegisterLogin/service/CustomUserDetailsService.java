package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.Admin;
import com.example.RegisterLogin.entity.CustomUserDetails;
import com.example.RegisterLogin.entity.Student;
import com.example.RegisterLogin.entity.Teacher;
import com.example.RegisterLogin.repository.AdminRepository;
import com.example.RegisterLogin.repository.TeacherRepository;
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
    @Autowired
    TeacherRepository teacherRepository;
    @Autowired
    AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (userRepository.existsByEmail(username)) {
            Student student = userRepository.findByEmail(username);
            return new CustomUserDetails(student);
        } else if (teacherRepository.existsByEmail(username)) {
            Teacher teacher = teacherRepository.findByEmail(username);
            return new CustomUserDetails(teacher);
        } else if (adminRepository.existsByEmail(username)) {
            Admin admin = adminRepository.findByEmail(username);
            return new CustomUserDetails(admin);
        } else {
            throw new UsernameNotFoundException("User not found!");
        }
    }
}
