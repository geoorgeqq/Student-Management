package com.example.RegisterLogin.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "course_schedule")
@Data
public class CourseSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private LocalTime startTime;

    private LocalTime endTime;

    private String dayOfWeek;

    private Boolean isActive = true;

}
