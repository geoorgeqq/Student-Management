package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;


public interface UserService {

    public Student registerUser(Student user, MultipartFile file) throws IOException;

    public Student loginStudent(String email, String password);

    public Admin loginAdmin(String email, String password);

    public Teacher loginTeacher(String email, String password);

    public Department getDepartmentByDepartmentId(long id);

    public List<Course> getCourses();

    public List<Department> getDepartmentsWithCourses();

    public Set<Course> findCoursesByDepartmentId(Long departmentId);

    public void saveCourses();

    public List<Student> getStudents();

    public Enrollment addEnrollment(Long studentId, Long courseId);

    public void saveEnrollments();

    Set<Course> getEnrolledCoursesByStudentId(Long studentId);
}
