package com.example.RegisterLogin.entity;

import lombok.Data;

@Data
public class LoginResponse {
    String jwtToken;
    Student student;
}
