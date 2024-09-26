package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.AddCourse;
import com.example.RegisterLogin.entity.Course;
import com.example.RegisterLogin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("courses")
public class CoursesController {

    @Autowired
    public UserService userService;

    @GetMapping("")
    public ResponseEntity<List<Course>> getCourses(){
        return ResponseEntity.ok(userService.getCourses());
    }

    @GetMapping("{id}")
    public ResponseEntity<Set<Course>> getCoursesByStudentId(@PathVariable("id") Long id){
        Set<Course> courses = userService.getEnrolledCoursesByStudentId(id);
        if(!courses.isEmpty()){
            return ResponseEntity.ok(courses);
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("{courseId}")
    public ResponseEntity<String> deleteCourse(@PathVariable("courseId") Long courseId){
        userService.deleteCourseById(courseId);
        return ResponseEntity.ok("Course deleted!");
    }

    @PutMapping("{courseId}")
    public ResponseEntity<Course> editCourse(@PathVariable("courseId")Long courseId, @RequestBody Course course){
        Course tempCourse = userService.editCourse(courseId, course);
        if(tempCourse != null){
            return ResponseEntity.ok(tempCourse);
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<Course> addCourse(@RequestBody AddCourse addCourse){
        Course tempCourse = userService.addCourse(addCourse.getCourseName(),addCourse.getDepartmentId());
        if(tempCourse != null){
            return ResponseEntity.ok(tempCourse);
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }



}
