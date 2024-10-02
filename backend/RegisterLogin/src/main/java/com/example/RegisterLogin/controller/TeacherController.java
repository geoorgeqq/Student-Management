package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.Teacher;
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
@RequestMapping("/teachers")
public class TeacherController {

    @Autowired
    UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Teacher> login(@RequestParam("email") String email, @RequestParam("password") String password) {
        Teacher user = new Teacher();
        user.setEmail(email);
        user.setPassword(password);

        Teacher savedUser = userService.loginTeacher(user.getEmail(), user.getPassword());
        if(savedUser != null){
            return ResponseEntity.ok(savedUser);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping
    public ResponseEntity<Teacher> addTeacher(@RequestBody Teacher teacher){
        Teacher tempTeacher = userService.addTeacher(teacher);
        if(tempTeacher != null){
           return ResponseEntity.ok(tempTeacher);
        }else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{teacherId}")
    public ResponseEntity<String> deleteTeacher(@PathVariable("teacherId") Long teacherId){
        userService.deleteTeacher(teacherId);
        return ResponseEntity.ok("User deleted!");
    }

    @GetMapping
    public ResponseEntity<List<Teacher>> listTeachers(){
        List<Teacher> teachers = userService.getTeachers();
        return ResponseEntity.ok(teachers);
    }

    @PutMapping("/{teacherId}")
    public ResponseEntity<Teacher> editTeacher(@PathVariable("teacherId") Long teacherId,@RequestBody Teacher teacher){
        Teacher tempTeacher = userService.editTeacher(teacherId, teacher);
        if(tempTeacher != null){
            return ResponseEntity.ok(tempTeacher);
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{teacherId}")
    public ResponseEntity<Teacher> listTeacherById(@PathVariable("teacherId") Long teacherId){
        Teacher tempteacher = userService.getTeacherById(teacherId);
        if(tempteacher != null){
            return ResponseEntity.ok(tempteacher);
        }else return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

}
