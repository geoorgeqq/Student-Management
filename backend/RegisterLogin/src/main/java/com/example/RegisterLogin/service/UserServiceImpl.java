package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.*;
import com.example.RegisterLogin.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @Override
    public Student findStudentById(Long id) {
        Student tempStudent = userRepository.findById(id).orElse(null);

        return tempStudent;
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
        List<Course> courses = courseRepository.findAll();
        for(Course course : courses){
            saveEnrollmentsToCourse(course);
        }
        return courses;
    }

    @Override
    public List<Department> getDepartmentsWithCourses() {
        saveCourses();
        return departmentRepository.findAllWithCourses();
    }

    @Override
    public Set<Course> getCoursesByDepartmentId(Long id) {
        Department department = departmentRepository.findById(id).orElse(null);
        if(department.getCourses() != null){
            return department.getCourses();
        }else {
            return null;
        }
    }

    public Set<Course> findCoursesByDepartmentId(Long departmentId){
        Set<Course> courses = courseRepository.findByDepartmentId(departmentId);
        for(Course course : courses){
            saveEnrollmentsToCourse(course);
        }
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
    public void deleteStudentById(Long id) {
        Student tempStudent = userRepository.findById(id).orElse(null);
        if(tempStudent !=null){
            userRepository.delete(tempStudent);
        }
    }

    @Override
    public Enrollment addEnrollment(Long studentId, Long courseId) {
        Student tempStudent = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found!"));
        Course tempCourse = courseRepository.findById(courseId).orElseThrow(()-> new RuntimeException("Course not found!"));
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(tempStudent);
        enrollment.setCourse(tempCourse);

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        return savedEnrollment;
    }

    @Override
    public List<Enrollment> getEnrollments() {
        // Assuming you have a method to save all enrollments at once
        return enrollmentRepository.findAll();
    }


    @Override
    public Set<Course> getEnrolledCoursesByStudentId(Long studentId) {
        Student student = userRepository.findById(studentId).orElse(null);

        List<Enrollment> enrollments = enrollmentRepository.findByStudent(student);

        Set<Course> enrolledCourses = new HashSet<>();

        // Iterate through enrollments to get the courses
        for (Enrollment enrollment : enrollments) {
            enrolledCourses.add(enrollment.getCourse());
        }

        return enrolledCourses;

    }

    @Override
    public Set<Enrollment> findEnrollmentsByCourse(Course course) {
            Set<Enrollment> enrollments = enrollmentRepository.findByCourse(course);
            return enrollments;
    }



    @Override
    public void saveEnrollmentsToCourse(Course course) {
        Set<Enrollment> enrollments = findEnrollmentsByCourse(course);
        course.setEnrollment(enrollments);


    }

    @Override
    public Student updateStudentById(Long id, Student updatedStudent) {
        Student existingStudent = userRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found!"));

        // Update basic fields
        existingStudent.setDepartment(updatedStudent.getDepartment());
        existingStudent.setName(updatedStudent.getName());
        existingStudent.setPic(updatedStudent.getPic());
        existingStudent.setPassword(updatedStudent.getPassword());
        existingStudent.setDateOfBirth(updatedStudent.getDateOfBirth());
        existingStudent.setEmail(updatedStudent.getEmail());

        // Update enrollments in place (without replacing the collection)
        updateEnrollments(existingStudent, updatedStudent.getEnrollments());

        return userRepository.save(existingStudent);
    }

    private void updateEnrollments(Student existingStudent, Set<Enrollment> updatedEnrollments) {
        // Initialize updatedEnrollments if null
        if (updatedEnrollments == null) {
            updatedEnrollments = new HashSet<>();
        }

        // Fetch current enrollments
        Set<Enrollment> currentEnrollments = existingStudent.getEnrollments();
        if (currentEnrollments == null) {
            currentEnrollments = new HashSet<>();
        }

        // Create a set of IDs for quick lookup
        Set<Long> updatedEnrollmentIds = new HashSet<>();
        for (Enrollment enrollment : updatedEnrollments) {
            updatedEnrollmentIds.add(enrollment.getId());
        }

        // Remove enrollments that are no longer present
        currentEnrollments.removeIf(existingEnrollment ->
                !updatedEnrollmentIds.contains(existingEnrollment.getId())
        );

        // Add new enrollments that are not already present
        for (Enrollment updatedEnrollment : updatedEnrollments) {
            if (currentEnrollments.stream().noneMatch(e -> e.getId() == updatedEnrollment.getId())) {
                updatedEnrollment.setStudent(existingStudent);  // Maintain bidirectional relationship
                currentEnrollments.add(updatedEnrollment);
            }
        }

        // Update the student object with the modified set of enrollments
        existingStudent.setEnrollments(currentEnrollments);
    }



}
