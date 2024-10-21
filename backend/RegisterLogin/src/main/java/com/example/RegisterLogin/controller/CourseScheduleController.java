package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.CourseSchedule;
import com.example.RegisterLogin.entity.CourseScheduleRequest;
import com.example.RegisterLogin.service.CourseScheduleServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedules")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseScheduleController {

    @Autowired
    public CourseScheduleServiceImpl courseScheduleService;

    @PostMapping
    private ResponseEntity<CourseSchedule> addCourseSchedule(@RequestBody CourseScheduleRequest courseScheduleRequest) {
        CourseSchedule tempCourseSchedule = courseScheduleService.addCourseSchedule(courseScheduleRequest);
        if (tempCourseSchedule != null) {
            return ResponseEntity.ok(tempCourseSchedule);
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @GetMapping
    private ResponseEntity<List<CourseSchedule>> listCourseSchedules() {
        List<CourseSchedule> schedules = courseScheduleService.getCourseSchedules();

        if (schedules != null) {
            return ResponseEntity.ok(schedules);
        } else return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/{scheduleId}")
    private ResponseEntity<CourseSchedule> editCourseSchedule(@PathVariable("scheduleId") Long scheduleId, @RequestBody CourseScheduleRequest courseScheduleRequest) {
        CourseSchedule tempCourseSchedule = courseScheduleService.editCourseSchedule(scheduleId, courseScheduleRequest);
        if (tempCourseSchedule != null) {
            return ResponseEntity.ok(tempCourseSchedule);
        } else return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @DeleteMapping("/{scheduleId}")
    private ResponseEntity<String> deleteCourseSchedule(@PathVariable("scheduleId") Long scheduleId) {
        courseScheduleService.deleteCourseScheduleById(scheduleId);
        return ResponseEntity.ok("Course deleted!");
    }

    @GetMapping("/{studentId}")
    private ResponseEntity<List<CourseSchedule>> listEnrolledCourseSchedulesByStudentId(@PathVariable("studentId") Long studentId) {
        return ResponseEntity.ok(courseScheduleService.listCourseSchedulesByStudentId(studentId));
    }
}
