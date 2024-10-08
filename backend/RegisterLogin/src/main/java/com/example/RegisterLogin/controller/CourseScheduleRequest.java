package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.RecurrenceType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
@Data
public class CourseScheduleRequest {
    private Long courseId;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate startDate;
    private LocalDate endDate;
    private RecurrenceType recurrenceType;
    private String dayOfWeek;
    private Integer interval;
    private Boolean isActive;
}
