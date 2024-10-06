package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.CourseSchedule;
import com.example.RegisterLogin.service.UserService;
import com.example.RegisterLogin.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedules")
@CrossOrigin(origins = "http:localhost:3000")
public class CourseScheduleController {

    @Autowired
    public UserService userService;

    @PostMapping
    private ResponseEntity<CourseSchedule> addCourseSchedule(@RequestBody CourseSchedule courseSchedule) {
        CourseSchedule tempCourseSchedule = userService.addCourseSchedule(courseSchedule);
        if (courseSchedule != null) {
            return ResponseEntity.ok(tempCourseSchedule);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    private ResponseEntity<List<CourseSchedule>> listCourseSchedules(){
        List<CourseSchedule> schedules = userService.getCourseSchedules();

        if(schedules != null){
            return ResponseEntity.ok(schedules);
        }else return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/{scheduleId}")
    private ResponseEntity<CourseSchedule> editCourseSchedule(@PathVariable("scheduleId") Long schedulesId, @RequestBody CourseSchedule courseSchedule){
            CourseSchedule tempCourseSchedule = userService.editCourseSchedule(schedulesId,courseSchedule);
            if(tempCourseSchedule != null){
                return ResponseEntity.ok(tempCourseSchedule);
            }else return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/{scheduleId}")
    private ResponseEntity<Void> deleteCourseSchedule(@PathVariable("scheduleId")Long scheduleId){
        userService.deleteCourseScheduleById(scheduleId);
        return ResponseEntity.noContent().build();
    }
}
