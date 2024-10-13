package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.CourseScheduleRequest;
import com.example.RegisterLogin.entity.*;
import com.example.RegisterLogin.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService {

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
    @Autowired
    private CourseScheduleRepository courseScheduleRepository;

    public Student registerUser(Student user, MultipartFile pic) throws IOException {
        if (pic != null) {
            user.setPic(pic.getBytes());
        }
        return userRepository.save(user);
    }

    public Student loginStudent(String email, String password) {
        Student user = userRepository.findByEmail(email);
        if (user != null && password.equals(user.getPassword())) {
            return user;
        } else {
            return null;
        }
    }

    @Override
    public Student findStudentById(Long id) {
        Student tempStudent = userRepository.findById(id).orElse(null);
        return tempStudent;
    }

    @Override
    public CourseSchedule addCourseSchedule(CourseScheduleRequest courseScheduleRequest) {
        Course course = courseRepository.findById(courseScheduleRequest.getCourseId()).orElse(null);
        if(course != null){
            CourseSchedule courseSchedule = new CourseSchedule();
            courseSchedule.setCourse(course);
            courseSchedule.setStartTime(courseScheduleRequest.getStartTime());
            courseSchedule.setEndTime(courseScheduleRequest.getEndTime());
            courseSchedule.setDayOfWeek(courseScheduleRequest.getDayOfWeek());
            courseSchedule.setIsActive(courseScheduleRequest.getIsActive());
            return courseScheduleRepository.save(courseSchedule);
        }
        return null;

    }

    @Override
    public List<CourseSchedule> getCourseSchedules() {
        List<CourseSchedule> schedules = courseScheduleRepository.findAll();
        return schedules;
    }

    @Override
    public CourseSchedule editCourseSchedule(Long id, CourseSchedule courseSchedule) {
        CourseSchedule tempCourseSchedule = courseScheduleRepository.findById(id).orElse(null);
        if(tempCourseSchedule != null){
            tempCourseSchedule.setStartTime(courseSchedule.getStartTime());
            tempCourseSchedule.setEndTime(courseSchedule.getEndTime());
            tempCourseSchedule.setDayOfWeek(courseSchedule.getDayOfWeek());
            tempCourseSchedule.setIsActive(courseSchedule.getIsActive());

            return courseScheduleRepository.save(tempCourseSchedule);
        }
        return null;
    }

    @Override
    public List<CourseSchedule> listCourseSchedulesByStudentId(Long id) {
       Set<Course> courses  = getEnrolledCoursesByStudentId(id);
       List<CourseSchedule> courseSchedules = courseScheduleRepository.findAll();
        List<CourseSchedule> tempCourseSchedules = new ArrayList<>();
       for(CourseSchedule courseSchedule : courseSchedules){
           for(Course course : courses){
               if(courseSchedule.getCourse() == course){
                   tempCourseSchedules.add(courseSchedule);
               }
           }
       }
       return tempCourseSchedules;
    }

    @Override
    public void deleteCourseScheduleById(Long id) {
        CourseSchedule tempCourseSchedule = courseScheduleRepository.findById(id).orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id));
        courseScheduleRepository.delete(tempCourseSchedule);
    }


    @Override
    public Admin loginAdmin(String email, String password) {
        Admin user = adminRepository.findByEmail(email);
        if (user != null && password.equals(user.getPassword())) {
            return user;
        } else {
            return null;
        }
    }

    @Override
    public List<Teacher> getTeachers() {
        List<Teacher> teachers = teacherRespository.findAll();
        return teachers;
    }

    @Override
    public Teacher getTeacherById(Long id) {
        return teacherRespository.findById(id).orElse(null);
    }

    @Override
    public Teacher editTeacher(Long id, Teacher teacher) {
        Teacher tempTeacher = teacherRespository.findById(id).orElse(null);
        if (tempTeacher != null) {
            tempTeacher.setDepartment(teacher.getDepartment());
            tempTeacher.setName(teacher.getName());
            tempTeacher.setEmail(teacher.getEmail());
            return teacherRespository.save(tempTeacher);
        } else return null;
    }

    @Override
    public void deleteTeacher(Long id) {
        Teacher tempTeacher = teacherRespository.findById(id).orElse(null);
        if (tempTeacher != null) {
            teacherRespository.delete(tempTeacher);
        }
    }

    @Override
    public Teacher loginTeacher(String email, String password) {
        Teacher user = teacherRespository.findByEmail(email);

        if (user != null && password.equals(user.getPassword())) {
            return user;
        } else
            return null;
    }

    @Override
    public Teacher addTeacher(Teacher teacher) {
        Teacher tempTeacher = teacherRespository.save(teacher);
        return tempTeacher;
    }

    @Override
    public Department getDepartmentByDepartmentId(long id) {
        Department department = departmentRepository.findById(id).orElse(null);
        return department;
    }

    @Override
    public List<Course> getCourses() {
        List<Course> courses = courseRepository.findAll();
        for (Course course : courses) {
            saveEnrollmentsToCourse(course);
        }
        return courses;
    }

    @Override
    public void deleteCourseById(Long id) {
        Course tempCourse = courseRepository.findById(id).orElse(null);
        if (tempCourse != null) {
            courseRepository.delete(tempCourse);
        }

    }

    @Override
    public Course editCourse(Long id, Course course) {
        Course tempCourse = courseRepository.findById(id).orElse(null);
        if (tempCourse != null) {
            tempCourse.setCourseName(course.getCourseName());
            courseRepository.save(tempCourse);
            return tempCourse;
        } else return null;
    }

    @Override
    public Course addCourse(String courseName, Long departmentId) {
        Course tempCourse = new Course();
        tempCourse.setCourseName(courseName);
        tempCourse.setDepartment(departmentRepository.findById(departmentId).orElse(null));
        return courseRepository.save(tempCourse);

    }

    @Override
    public List<Department> getDepartmentsWithCourses() {
        saveCourses();
        return departmentRepository.findAllWithCourses();
    }

    @Override
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
            saveEnrollmentsToCourse(course);
        }
        return courses;
    }

    @Override
    public void saveCourses() {
        List<Department> departments = departmentRepository.findAll();
        for (Department department : departments) {
            department.setCourses(findCoursesByDepartmentId(department.getId()));
        }

    }

    @Override
    public List<Student> getStudents() {
        List<Student> students = userRepository.findAll();
        return students;

    }

    @Override
    public void deleteStudentById(Long id) {
        Student tempStudent = userRepository.findById(id).orElse(null);
        if (tempStudent != null) {
            userRepository.delete(tempStudent);
        }
    }

    @Override
    public Enrollment addEnrollment(Long studentId, Long courseId) {
        Student tempStudent = userRepository.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found!"));
        Course tempCourse = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found!"));
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

    @Override
    public void addDepartment(Department department) {
        departmentRepository.save(department);
    }

    @Override
    public void deleteDepartmentById(Long id) {
        Department tempDepartment = departmentRepository.findById(id).orElse(null);
        if (tempDepartment != null) {
            departmentRepository.delete(tempDepartment);
        }

    }

    @Override
    public Department updateDepartmentById(Long id, Department department) {
        Department tempDepartment = departmentRepository.findById(id).orElse(null);
        if (tempDepartment != null) {
            tempDepartment.setDepartment_name(department.getDepartment_name());
            departmentRepository.save(tempDepartment);
            return tempDepartment;
        } else return null;
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
