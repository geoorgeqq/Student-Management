package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.Department;
import com.example.RegisterLogin.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class DepartmentServiceImpl {

    @Autowired
    DepartmentRepository departmentRepository;
    @Autowired
    UserService userService;
    @Autowired
    CourseServiceImpl courseService;

    public Department getDepartmentByDepartmentId(long id) {
        Department department = departmentRepository.findById(id).orElse(null);
        return department;
    }

    public List<Department> getDepartmentsWithCourses() {
        courseService.saveCourses();
        return departmentRepository.findAllWithCourses();
    }
    public void addDepartment(Department department) {
        departmentRepository.save(department);
    }

    public void deleteDepartmentById(Long id) {
        Department tempDepartment = departmentRepository.findById(id).orElse(null);
        if (tempDepartment != null) {
            departmentRepository.delete(tempDepartment);
        }

    }

    public Department updateDepartmentById(Long id, Department department) {
        Department tempDepartment = departmentRepository.findById(id).orElse(null);
        if (tempDepartment != null) {
            tempDepartment.setDepartment_name(department.getDepartment_name());
            departmentRepository.save(tempDepartment);
            return tempDepartment;
        } else return null;
    }
}
