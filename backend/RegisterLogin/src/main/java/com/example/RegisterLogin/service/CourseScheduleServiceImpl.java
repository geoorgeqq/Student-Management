package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.Course;
import com.example.RegisterLogin.entity.CourseSchedule;
import com.example.RegisterLogin.entity.CourseScheduleRequest;
import com.example.RegisterLogin.repository.CourseRepository;
import com.example.RegisterLogin.repository.CourseScheduleRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
public class CourseScheduleServiceImpl{

    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private CourseScheduleRepository courseScheduleRepository;
    @Autowired
    public UserService userService;
    @Autowired
    public EnrollmentServiceImpl enrollmentService;

    public CourseSchedule addCourseSchedule(CourseScheduleRequest courseScheduleRequest) {
        Course course = courseRepository.findById(courseScheduleRequest.getCourseId()).orElse(null);

        if(course == null){
            return null;
        }

        Long departmentId = course.getDepartment().getId();

        List<String> days = List.of(courseScheduleRequest.getDaysOfWeek().split(","));
        // For conflict check, use the first day (for simplicity)
        String firstDay = days.get(0);
        List<CourseSchedule> conflictingCourseSchedules = courseScheduleRepository.findConflictingSchedules(
                departmentId,
                firstDay,
                courseScheduleRequest.getStartTime(),
                courseScheduleRequest.getEndTime(),
                9999L);

        if(!conflictingCourseSchedules.isEmpty()){
            return null;
        }

        CourseSchedule courseSchedule = new CourseSchedule();
        courseSchedule.setCourse(course);
        return updateSchedule(courseSchedule,courseScheduleRequest);

    }

    public List<CourseSchedule> getCourseSchedules() {
        List<CourseSchedule> schedules = courseScheduleRepository.findAll();
        return schedules;
    }

    public CourseSchedule editCourseSchedule(Long id, CourseScheduleRequest courseSchedule) {
        CourseSchedule tempCourseSchedule = courseScheduleRepository.findById(id).orElse(null);

        Long departmentId = tempCourseSchedule.getCourse().getDepartment().getId();

        List<String> days = List.of(courseSchedule.getDaysOfWeek().split(","));
        // For conflict check, use the first day (for simplicity)
        String firstDay = days.get(0);
        List<CourseSchedule> conflictingCourseSchedules = courseScheduleRepository.findConflictingSchedules(
                departmentId,
                firstDay,
                courseSchedule.getStartTime(),
                courseSchedule.getEndTime(),
                tempCourseSchedule.getId());

        for(CourseSchedule courseSchedule1 : conflictingCourseSchedules){
            if(Objects.equals(courseSchedule1.getId(), tempCourseSchedule.getId())){
                updateSchedule(tempCourseSchedule,courseSchedule);
            }
        }

        if(!conflictingCourseSchedules.isEmpty()){
            return null;
        }

        // Set the course if courseId is changed
        if (courseSchedule.getCourseId() != null) {
            Course newCourse = courseRepository.findById(courseSchedule.getCourseId()).orElse(null);
            if (newCourse != null) {
                tempCourseSchedule.setCourse(newCourse);
            }
        }

        return updateSchedule(tempCourseSchedule,courseSchedule);
    }

    public CourseSchedule updateSchedule(CourseSchedule tempSchedule, CourseScheduleRequest courseScheduleRequest){
        tempSchedule.setStartTime(courseScheduleRequest.getStartTime());
        tempSchedule.setEndTime(courseScheduleRequest.getEndTime());
        tempSchedule.setDaysOfWeek(courseScheduleRequest.getDaysOfWeek());
        tempSchedule.setIsActive(courseScheduleRequest.getIsActive());

        return courseScheduleRepository.save(tempSchedule);
    }

    public List<CourseSchedule> listCourseSchedulesByStudentId(Long id) {
        Set<Course> courses  = enrollmentService.getEnrolledCoursesByStudentId(id);
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

    public List<CourseSchedule> listCourseSchedulesByTeacherId(Long teacherId) {
        List<Course> courses = courseRepository.findCoursesByTeacherId(teacherId);

        List<CourseSchedule> courseSchedules = courseScheduleRepository.findAll();

        List<CourseSchedule> tempCourseSchedules = new ArrayList<>();
        for(CourseSchedule courseSchedule : courseSchedules){
            for(Course course : courses){
                if(course == courseSchedule.getCourse()){
                    tempCourseSchedules.add(courseSchedule);
                }
            }
        }
        return tempCourseSchedules;

    }

    public void deleteCourseScheduleById(Long id) {
        CourseSchedule tempCourseSchedule = courseScheduleRepository.findById(id).orElseThrow(() -> new RuntimeException("Schedule not found with id: " + id));
        courseScheduleRepository.delete(tempCourseSchedule);
    }

}
