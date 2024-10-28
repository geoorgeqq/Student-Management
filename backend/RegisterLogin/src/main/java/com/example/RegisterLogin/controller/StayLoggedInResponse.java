package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.Admin;
import com.example.RegisterLogin.entity.Student;
import com.example.RegisterLogin.entity.Teacher;
import lombok.Data;
@Data
public class StayLoggedInResponse {
    String jwtToken;
    Student student;
    Admin admin;
    Teacher teacher;
    String type;

        public StayLoggedInResponse(Admin admin, String jwtToken, String type){
            this.admin = admin;
            this.jwtToken = jwtToken;
            this.type = type;
        }

        public StayLoggedInResponse(Student student, String  jwtToken, String type){
            this.student = student;
            this.jwtToken = jwtToken;
            this.type = type;
        }

        public StayLoggedInResponse(Teacher teacher, String jwtToken, String type){
            this.teacher = teacher;
            this.jwtToken = jwtToken;
            this.type = type;
        }




}
