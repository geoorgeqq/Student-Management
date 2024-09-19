package com.example.RegisterLogin.entity;

public class EnrollmentResponse {
    private Enrollment enrollment;
    private String courseName;

    public EnrollmentResponse(Enrollment enrollment, String courseName) {
        this.enrollment = enrollment;
        this.courseName = courseName;
    }

    public Enrollment getEnrollment() {
        return enrollment;
    }

    public String getCourseName() {
        return courseName;
    }
}
