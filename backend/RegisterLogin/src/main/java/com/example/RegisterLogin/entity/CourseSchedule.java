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

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private LocalTime startTime;

    private LocalTime endTime;

    // Comma-separated list of days, e.g., "Monday,Wednesday,Friday"
    private String daysOfWeek;

    private Boolean isActive = true;

}
