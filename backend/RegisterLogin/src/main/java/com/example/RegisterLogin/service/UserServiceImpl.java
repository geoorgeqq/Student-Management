package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.*;
import com.example.RegisterLogin.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Array;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private TeacherRespository teacherRespository;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public Student registerUser(Student user, MultipartFile pic) throws IOException {
        if(pic != null){
            user.setPic(pic.getBytes());
        }

        return userRepository.save(user);
    }

    public Student loginStudent(String email, String password){
        Student user = userRepository.findByEmail(email);

        if(user != null && password.equals(user.getPassword())){
            return user;
        }else{
            return null;
        }
    }

    public Admin loginAdmin (String email, String password){
        Admin user = adminRepository.findByEmail(email);

        if(user != null && password.equals(user.getPassword())){
            return user;
        }else{
            return null;
        }
    }

    @Override
    public Teacher loginTeacher(String email, String password) {
        Teacher user = teacherRespository.findByEmail(email);

        if(user != null && password.equals(user.getPassword())){
            return user;
        }else
            return null;
    }

    @Override
    public Department getDepartmentByDepartmentId(long id) {
        Department department = departmentRepository.findById(id).orElse(null);
        return department;
    }
    
    @Override
    public List<Course> getCourses() {
        return courseRepository.findAll();
    }

    @Override
    public List<Department> getDepartmentsWithCourses() {
        saveCourses();
        return departmentRepository.findAllWithCourses();
    }

    public Set<Course> findCoursesByDepartmentId(Long departmentId){
        Set<Course> courses = courseRepository.findByDepartmentId(departmentId);
        return courses;
    }

    @Override
    public void saveCourses() {
        List<Department> departments= departmentRepository.findAll();
        for(Department department : departments){
            department.setCourses(findCoursesByDepartmentId(department.getId()));
        }

    }

    @Override
    public List<Student> getStudents() {
        List<Student>  students= userRepository.findAll();
        return students;

    }

    @Override
    public Enrollment addEnrollment(Long studentId, Long courseId) {
        Student tempStudent = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found!"));
        Course tempCourse = courseRepository.findById(courseId).orElseThrow(()-> new RuntimeException("Course not found!"));
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(tempStudent);
        enrollment.setCourse(tempCourse);

        enrollmentRepository.save(enrollment);

        return enrollment;
    }

    @Override
    public void saveEnrollments() {
        List<Student> students = userRepository.findAll();
        List<Enrollment> enrollments = new ArrayList<>();

        for (Student student : students) {
            Set<Course> courses = getEnrolledCoursesByStudentId(student.getId());

            if (!courses.isEmpty()) {
                // Convert Set to List to access elements by index
                List<Course> courseList = new ArrayList<>(courses);

                for (int i = 0; i < courseList.size(); i++) {
                    Course course = courseList.get(i);

                    // Create new Enrollment object
                    Enrollment enrollment = new Enrollment();
                    enrollment.setStudent(student);
                    enrollment.setCourse(course);

                    // Add the new Enrollment to the enrollments list
                    enrollments.add(enrollment);
                }
            }
        }

        // Assuming you have a method to save all enrollments at once
        enrollmentRepository.saveAll(enrollments);
    }


    @Override
    public Set<Course> getEnrolledCoursesByStudentId(Long studentId) {
        Student student = userRepository.findById(studentId).orElseThrow(() ->new RuntimeException("Not found!"));
        List<Enrollment> enrollments = enrollmentRepository.findByStudent(student);

        Set<Course> enrolledCourses = new HashSet<>();

        // Iterate through enrollments to get the courses
        for (Enrollment enrollment : enrollments) {
            enrolledCourses.add(enrollment.getCourse());
        }

        return enrolledCourses;

    }


}
