package com.example.RegisterLogin.entity;

import lombok.Data;

import java.time.LocalTime;
@Data
public class CourseScheduleRequest {
    private Long courseId;
    private LocalTime startTime;
    private LocalTime endTime;
    private String dayOfWeek;
    private Boolean isActive;
}
