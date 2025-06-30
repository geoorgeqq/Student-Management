package com.example.RegisterLogin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Set;

@Entity
@Table(name = "department")
@Data
@EqualsAndHashCode(exclude = "courses")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String department_name;

    @JsonIgnore
    @OneToMany(mappedBy = "department", fetch = FetchType.EAGER)
    private Set<Course> courses;


}
