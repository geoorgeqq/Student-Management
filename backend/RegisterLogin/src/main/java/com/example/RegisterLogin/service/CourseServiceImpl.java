package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.AddCourse;
import com.example.RegisterLogin.entity.Course;
import com.example.RegisterLogin.entity.Department;
import com.example.RegisterLogin.entity.Student;
import com.example.RegisterLogin.repository.CourseRepository;
import com.example.RegisterLogin.repository.DepartmentRepository;
import com.example.RegisterLogin.repository.TeacherRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
@Service
public class CourseServiceImpl {
    @Autowired
    CourseRepository courseRepository;
    @Autowired
    DepartmentRepository departmentRepository;
    @Autowired
    TeacherRepository teacherRepository;
    @Autowired
    UserService userService;
    @Autowired
    EnrollmentServiceImpl enrollmentService;

    public List<Course> getCourses() {
        List<Course> courses = courseRepository.findAll();
        for (Course course : courses) {
            enrollmentService.saveEnrollmentsToCourse(course);
        }
        return courses;
    }

    public List<Course> getCoursesByTeacherId(Long teacherId) {
        return courseRepository.findCoursesByTeacherId(teacherId);
    }

    public void deleteCourseById(Long id) {
        Course tempCourse = courseRepository.findById(id).orElse(null);
        if (tempCourse != null) {
            courseRepository.delete(tempCourse);
        }

    }

    public Course editCourse(Long courseId,AddCourse addCourse) {
        System.out.println(courseId);
        Course tempCourse = courseRepository.findById(courseId).orElse(null);
        if (tempCourse != null) {
            tempCourse.setCourseName(addCourse.getCourseName());
            tempCourse.setDepartment(departmentRepository.findById(addCourse.getDepartmentId()).orElse(null));
            tempCourse.setLocation(addCourse.getLocation());
            tempCourse.setDescription(addCourse.getDescription());
            tempCourse.setTeacher(teacherRepository.findById(addCourse.getTeacherId()).orElse(null));
            return courseRepository.save(tempCourse);
        } else return null;
    }

    public Course addCourse(AddCourse addCourse) {
        Course tempCourse = new Course();
        tempCourse.setCourseName(addCourse.getCourseName());
        tempCourse.setDepartment(departmentRepository.findById(addCourse.getDepartmentId()).orElse(null));
        tempCourse.setLocation(addCourse.getLocation());
        tempCourse.setDescription(addCourse.getDescription());
        tempCourse.setTeacher(teacherRepository.findById(addCourse.getTeacherId()).orElse(null));
        return courseRepository.save(tempCourse);
    }

    public Course getCourseById(Long courseId) {
        return courseRepository.findById(courseId).orElse(null);
    }

    public Set<Course> getCoursesByDepartmentId(Long id) {
        Department department = departmentRepository.findById(id).orElse(null);
        if (department.getCourses() != null) {
            return department.getCourses();
        } else {
            return null;
        }
    }

    public Set<Course> findCoursesByDepartmentId(Long departmentId) {
        Set<Course> courses = courseRepository.findByDepartmentId(departmentId);
        for (Course course : courses) {
            enrollmentService.saveEnrollmentsToCourse(course);
        }
        return courses;
    }

    public void saveCourses() {
        List<Department> departments = departmentRepository.findAll();
        for (Department department : departments) {
            department.setCourses(findCoursesByDepartmentId(department.getId()));
        }

    }

}
