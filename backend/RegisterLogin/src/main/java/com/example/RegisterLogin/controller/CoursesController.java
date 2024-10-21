package com.example.RegisterLogin.controller;

import com.example.RegisterLogin.entity.AddCourse;
import com.example.RegisterLogin.entity.Course;
import com.example.RegisterLogin.entity.CourseSchedule;
import com.example.RegisterLogin.service.CourseScheduleServiceImpl;
import com.example.RegisterLogin.service.CourseServiceImpl;
import com.example.RegisterLogin.service.EnrollmentServiceImpl;
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
    @Autowired
    CourseServiceImpl courseService;
    @Autowired
    public CourseScheduleServiceImpl courseScheduleService;
    @Autowired
    public EnrollmentServiceImpl enrollmentService;

    @GetMapping("")
    public ResponseEntity<List<Course>> getCourses(){
        return ResponseEntity.ok(courseService.getCourses());
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<Set<Course>> getCoursesByStudentId(@PathVariable("id") Long id){
        Set<Course> courses = enrollmentService.getEnrolledCoursesByStudentId(id);
        if(!courses.isEmpty()){
            return ResponseEntity.ok(courses);
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/teachers/{teacherId}")
    public ResponseEntity<List<CourseSchedule>> listCourseSchedulesByTeacherId(@PathVariable Long teacherId){
        return ResponseEntity.ok(courseScheduleService.listCourseSchedulesByTeacherId(teacherId));
    }

    @GetMapping("/{courseId}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long courseId){
        Course tempCourse = courseService.getCourseById(courseId);
        if(tempCourse == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }else return ResponseEntity.ok(tempCourse);
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<String> deleteCourse(@PathVariable("courseId") Long courseId){
        courseService.deleteCourseById(courseId);
        return ResponseEntity.ok("Course deleted!");
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<Course> editCourse(@PathVariable("courseId") Long courseId, @RequestBody AddCourse addCourse){
        Course tempCourse = courseService.editCourse(courseId,addCourse);
        if(tempCourse != null){
            return ResponseEntity.ok(tempCourse);
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping
    public ResponseEntity<Course> addCourse(@RequestBody AddCourse addCourse){
        Course tempCourse = courseService.addCourse(addCourse);
        if(tempCourse != null){
            return ResponseEntity.ok(tempCourse);
        }else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }






}
