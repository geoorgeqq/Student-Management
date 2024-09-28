package com.example.RegisterLogin.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "teacher")
@Data
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    private String email;

    private String password;

    @ManyToOne
    @JoinColumn(name = "department_id",referencedColumnName = "id")
    private Department department;
}
