package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.Course;
import com.example.RegisterLogin.entity.Enrollment;
import com.example.RegisterLogin.entity.Student;
import com.example.RegisterLogin.repository.CourseRepository;
import com.example.RegisterLogin.repository.EnrollmentRepository;
import com.example.RegisterLogin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
@Service
public class EnrollmentServiceImpl {

    @Autowired
    UserRepository userRepository;
    @Autowired
    CourseRepository courseRepository;
    @Autowired
    EnrollmentRepository enrollmentRepository;

    public Enrollment addEnrollment(Long studentId, Long courseId) {
        Student tempStudent = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found!"));
        Course tempCourse = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found!"));
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(tempStudent);
        enrollment.setCourse(tempCourse);

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        return savedEnrollment;
    }

    public void updateEnrollments(Student existingStudent, Set<Enrollment> updatedEnrollments) {
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

    public List<Enrollment> getEnrollments() {
        // Assuming you have a method to save all enrollments at once
        return enrollmentRepository.findAll();
    }

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

    public Set<Enrollment> findEnrollmentsByCourse(Course course) {
        Set<Enrollment> enrollments = enrollmentRepository.findByCourse(course);
        return enrollments;
    }

    public Set<Enrollment> findEnrollmentsByCourseId(Long courseId) {
        return enrollmentRepository.findByCourse(courseRepository.findById(courseId).orElse(null));
    }

    public void saveEnrollmentsToCourse(Course course) {
        Set<Enrollment> enrollments = findEnrollmentsByCourse(course);
        course.setEnrollment(enrollments);
    }

}
