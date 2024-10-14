package com.example.RegisterLogin.entity;

import lombok.Data;

@Data
public class AddCourse {
    private String courseName;

    private Long departmentId;

    private String description;

    private String location;

    private Long teacherId;
}
