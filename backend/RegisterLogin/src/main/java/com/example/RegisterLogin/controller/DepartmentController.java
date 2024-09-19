package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.Course;
import com.example.RegisterLogin.entity.Department;
import com.example.RegisterLogin.repository.CourseRepository;
import com.example.RegisterLogin.repository.DepartmentRepository;
import com.example.RegisterLogin.service.UserService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/departments")
public class DepartmentController {

    @Autowired
    UserService userService;

    @GetMapping("")
    public ResponseEntity<List<Department>> getDepartments(){
        List<Department> departments = userService.getDepartmentsWithCourses();
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Set<Course>> getCoursesForDepartmentId(@PathVariable("id") Long id){
        Set<Course> courses = userService.findCoursesByDepartmentId(id);
        userService.saveEnrollments();
        if(!courses.isEmpty()){
            return ResponseEntity.ok(courses);
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
