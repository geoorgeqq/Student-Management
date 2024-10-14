package com.example.RegisterLogin.repository;


import com.example.RegisterLogin.entity.CourseSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface CourseScheduleRepository extends JpaRepository<CourseSchedule, Long> {

    List<CourseSchedule> findByCourseId(Long courseId);

    @Query("SELECT c FROM CourseSchedule c WHERE c.course.department.id = :departmentId " +
            "AND c.dayOfWeek = :dayOfWeek " +
            "AND ((:startTime < c.endTime AND :endTime > c.startTime))")
    List<CourseSchedule> findConflictingSchedules(@Param("departmentId") Long departmentId,
                                                  @Param("dayOfWeek") String dayOfWeek,
                                                  @Param("startTime") LocalTime startTime,
                                                  @Param("endTime") LocalTime endTime);

}
