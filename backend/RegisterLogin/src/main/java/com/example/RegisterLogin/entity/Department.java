package com.example.RegisterLogin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Set;

@Entity
@Table(name = "department")
@Data
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String department_name;

    @OneToMany(mappedBy = "department", fetch = FetchType.EAGER)
    private Set<Course> courses;


}
