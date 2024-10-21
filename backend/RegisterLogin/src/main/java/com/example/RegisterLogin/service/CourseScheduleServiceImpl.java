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

        List<CourseSchedule> conflictingCourseSchedules = courseScheduleRepository.findConflictingSchedules(
                departmentId,
                courseScheduleRequest.getDayOfWeek(),
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

        List<CourseSchedule> conflictingCourseSchedules = courseScheduleRepository.findConflictingSchedules(
                departmentId,
                courseSchedule.getDayOfWeek(),
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

        return updateSchedule(tempCourseSchedule,courseSchedule);
    }

    public CourseSchedule updateSchedule(CourseSchedule tempSchedule, CourseScheduleRequest courseScheduleRequest){
        tempSchedule.setStartTime(courseScheduleRequest.getStartTime());
        tempSchedule.setEndTime(courseScheduleRequest.getEndTime());
        tempSchedule.setDayOfWeek(courseScheduleRequest.getDayOfWeek());
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
