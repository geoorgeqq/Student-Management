package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.LoginRequest;
import com.example.RegisterLogin.entity.LoginResponse;
import com.example.RegisterLogin.entity.Teacher;
import com.example.RegisterLogin.service.TeacherServiceImpl;
import com.example.RegisterLogin.service.UserService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@CrossOrigin("http://localhost:3000")
@RequestMapping("/teacher")
public class TeacherController {

    @Autowired
    TeacherServiceImpl teacherService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(teacherService.loginTeacher(loginRequest));
    }

    @PostMapping
    public ResponseEntity<Teacher> addTeacher(@RequestBody Teacher teacher) {
        Teacher tempTeacher = teacherService.addTeacher(teacher);
        if (tempTeacher != null) {
            return ResponseEntity.ok(tempTeacher);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{teacherId}")
    public ResponseEntity<String> deleteTeacher(@PathVariable("teacherId") Long teacherId) {
        teacherService.deleteTeacher(teacherId);
        return ResponseEntity.ok("User deleted!");
    }

    @GetMapping
    public ResponseEntity<List<Teacher>> listTeachers() {
        List<Teacher> teachers = teacherService.getTeachers();
        return ResponseEntity.ok(teachers);
    }

    @PutMapping("/{teacherId}")
    public ResponseEntity<Teacher> editTeacher(@PathVariable("teacherId") Long teacherId, @RequestBody Teacher teacher) {
        Teacher tempTeacher = teacherService.editTeacher(teacherId, teacher);
        if (tempTeacher != null) {
            return ResponseEntity.ok(tempTeacher);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{teacherId}")
    public ResponseEntity<Teacher> listTeacherById(@PathVariable("teacherId") Long teacherId) {
        Teacher tempteacher = teacherService.getTeacherById(teacherId);
        if (tempteacher != null) {
            return ResponseEntity.ok(tempteacher);
        } else return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/departments/{departmentId}")
    public ResponseEntity<List<Teacher>> listTeachersByDepartmentId(@PathVariable Long departmentId) {
        return ResponseEntity.ok(teacherService.getTeachersByDepartmentId(departmentId));
    }
}
