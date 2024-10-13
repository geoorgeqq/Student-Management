package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.CourseSchedule;
import com.example.RegisterLogin.entity.CourseScheduleRequest;
import com.example.RegisterLogin.service.UserService;
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
    public UserService userService;

    @PostMapping
    private ResponseEntity<CourseSchedule> addCourseSchedule(@RequestBody CourseScheduleRequest courseScheduleRequest) {
        CourseSchedule tempCourseSchedule = userService.addCourseSchedule(courseScheduleRequest);
        if (tempCourseSchedule != null) {
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
    private ResponseEntity<String> deleteCourseSchedule(@PathVariable("scheduleId")Long scheduleId){
        userService.deleteCourseScheduleById(scheduleId);
        return ResponseEntity.ok("Course deleted!");
    }

    @GetMapping("/{studentId}")
    private ResponseEntity<List<CourseSchedule>> listEnrolledCourseSchedulesByStudentId(@PathVariable("studentId") Long studentId){
        return ResponseEntity.ok(userService.listCourseSchedulesByStudentId(studentId));
    }
}
