package com.example.RegisterLogin.entity;

import lombok.Data;
import lombok.extern.java.Log;

@Data
public class LoginResponse {
    String jwtToken;
    Student student;
    Admin admin;
    Teacher teacher;

    public LoginResponse(Admin admin, String jwtToken){
        this.admin = admin;
        this.jwtToken = jwtToken;
    }

    public LoginResponse(Student student, String  jwtToken){
        this.student = student;
        this.jwtToken = jwtToken;
    }

    public LoginResponse(Teacher teacher, String jwtToken){
        this.teacher = teacher;
        this.jwtToken = jwtToken;
    }


}
