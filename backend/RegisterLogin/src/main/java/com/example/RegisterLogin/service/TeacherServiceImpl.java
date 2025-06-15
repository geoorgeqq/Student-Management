package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.LoginRequest;
import com.example.RegisterLogin.entity.LoginResponse;
import com.example.RegisterLogin.entity.Teacher;
import com.example.RegisterLogin.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeacherServiceImpl {

    @Autowired
    public TeacherRepository teacherRepository;
    @Autowired
    public AuthenticationManager manager;
    @Autowired
    JwtService jwtService;

    public List<Teacher> getTeachers() {
        List<Teacher> teachers = teacherRepository.findAll();
        return teachers;
    }

    public List<Teacher> getTeachersByDepartmentId(Long departmentId) {
        List<Teacher> teachers = teacherRepository.findTeachersByDepartmentId(departmentId);
        return teachers;
    }

    public Teacher getTeacherById(Long id) {
        return teacherRepository.findById(id).orElse(null);
    }

    public Teacher editTeacher(Long id, Teacher teacher) {
        Teacher tempTeacher = teacherRepository.findById(id).orElse(null);
        if (tempTeacher != null) {
            tempTeacher.setDepartment(teacher.getDepartment());
            tempTeacher.setName(teacher.getName());
            tempTeacher.setEmail(teacher.getEmail());
            return teacherRepository.save(tempTeacher);
        } else return null;
    }

    public void deleteTeacher(Long id) {
        Teacher tempTeacher = teacherRepository.findById(id).orElse(null);
        if (tempTeacher != null) {
            teacherRepository.delete(tempTeacher);
        }
    }

    public LoginResponse loginTeacher(LoginRequest loginRequest) {
        Authentication authentication = manager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),loginRequest.getPassword()));
        if(authentication !=null){
            if(loginRequest.isChecked() ){
                return new LoginResponse(teacherRepository.findByEmail(loginRequest.getEmail()), jwtService.generateNoExpiryToken(loginRequest.getEmail()));
            }
            return new LoginResponse(teacherRepository.findByEmail(loginRequest.getEmail()),jwtService.generateToken(loginRequest.getEmail()));
        }
        return null;
    }


    public Teacher addTeacher(Teacher teacher) {
        Teacher tempTeacher = teacherRepository.save(teacher);
        return tempTeacher;
    }
}
