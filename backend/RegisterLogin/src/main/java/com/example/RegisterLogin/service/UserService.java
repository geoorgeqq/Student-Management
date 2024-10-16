package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.CourseScheduleRequest;
import com.example.RegisterLogin.entity.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;


public interface UserService {

    public Student registerUser(Student user, MultipartFile file) throws IOException;

    public Student loginStudent(String email, String password);

    public Student findStudentByEmail(String email);

    public Student saveTokenAndExpiryDate(Student student,String token, String expiryDate);

    public void sendResetEmail(String email, String resetToken);

    public Student findStudentByToken(String token);

    public Student saveStudentNewPassword(Student student, String newPassword);

    public String generateResetToken();

    public Student findStudentById(Long id);

    public CourseSchedule addCourseSchedule(CourseScheduleRequest courseScheduleRequest);

    public List<CourseSchedule> getCourseSchedules();

    public CourseSchedule editCourseSchedule(Long id, CourseScheduleRequest courseSchedule);

    public List<CourseSchedule> listCourseSchedulesByStudentId(Long id);

    public List<CourseSchedule> listCourseSchedulesByTeacherId(Long teacherid);

    public void deleteCourseScheduleById(Long id);

    public Admin loginAdmin(String email, String password);

    public List<Teacher> getTeachers();

    public List<Teacher> getTeachersByDepartmentId(Long departmentId);

    public Teacher getTeacherById(Long id);

    public Teacher editTeacher(Long id, Teacher teacher);

    public void deleteTeacher(Long id);

    public Teacher loginTeacher(String email, String password);

    public Teacher addTeacher(Teacher teacher);

    public Department getDepartmentByDepartmentId(long id);

    public List<Course> getCourses();

    public List<Course> getCoursesByTeacherId(Long teacherId);

    public void deleteCourseById(Long id);

    public Course editCourse(Long courseId,AddCourse addCourse);

    public Course addCourse(AddCourse addCourse);

    public Course getCourseById(Long courseId);

    public List<Department> getDepartmentsWithCourses();

    public Set<Course> getCoursesByDepartmentId(Long id);

    public Set<Course> findCoursesByDepartmentId(Long departmentId);

    public void saveCourses();

    public List<Student> getStudents();

    public void deleteStudentById(Long id);

    public Enrollment addEnrollment(Long studentId, Long courseId);

    public List<Enrollment> getEnrollments();

    Set<Course> getEnrolledCoursesByStudentId(Long studentId);

    Set<Enrollment> findEnrollmentsByCourse(Course course);

    Set<Enrollment> findEnrollmentsByCourseId(Long courseId);

    public void saveEnrollmentsToCourse(Course course);

    public Student updateStudentById(Long id, Student student);

    public void addDepartment(Department department);

    public void deleteDepartmentById(Long id);

    public Department updateDepartmentById(Long id, Department department);

}
