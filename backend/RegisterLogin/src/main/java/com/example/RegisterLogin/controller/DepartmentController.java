package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.Course;
import com.example.RegisterLogin.entity.Department;
import com.example.RegisterLogin.repository.CourseRepository;
import com.example.RegisterLogin.repository.DepartmentRepository;
import com.example.RegisterLogin.service.CourseServiceImpl;
import com.example.RegisterLogin.service.DepartmentServiceImpl;
import com.example.RegisterLogin.service.UserService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/departments")
public class DepartmentController {

    @Autowired
    UserService userService;
    @Autowired
    DepartmentServiceImpl departmentService;
    @Autowired
    CourseServiceImpl courseService;

    @GetMapping("")
    public ResponseEntity<List<Department>> getDepartments() {
        List<Department> departments = departmentService.getDepartmentsWithCourses();
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Set<Course>> getCoursesForDepartmentId(@PathVariable("id") Long id) {
        Set<Course> courses = courseService.findCoursesByDepartmentId(id);
        if (!courses.isEmpty()) {
            return ResponseEntity.ok(courses);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("")
    public ResponseEntity<Department> addDepartment(@RequestBody Department department) {
        departmentService.addDepartment(department);
        return ResponseEntity.ok(department);
    }

    @PostMapping("/{departmentId}")
    public ResponseEntity<Department> editDepartment(@PathVariable("departmentId") Long departmentId, @RequestBody Department department) {
        Department tempDepartment = departmentService.updateDepartmentById(departmentId, department);
        return ResponseEntity.ok(tempDepartment);
    }

    @DeleteMapping("/{departmentId}")
    public ResponseEntity<String> deleteDepartment(@PathVariable("departmentId") Long departmentId) {
        departmentService.deleteDepartmentById(departmentId);
        return ResponseEntity.ok("Department Deleted!");

    }
}
