package com.example.RegisterLogin.service;

import com.example.RegisterLogin.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl {
    @Autowired
    private JavaMailSender javaMailSender;

    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(to);
        mailMessage.setSubject(subject);
        mailMessage.setText(text);
        javaMailSender.send(mailMessage);
    }

    public void sendResetEmail(String email, String resetToken) {
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
        sendSimpleEmail(email, "Reset Password Request", resetLink);
    }

    public void sendVerificationEmail(String email, String token) {
        String verificationLink = "http://localhost:3000/verify-email?token=" + token;
        String subject = "Email Verification";
        String text = "Click on the following link to verify your email!\n" + verificationLink;
        sendSimpleEmail(email, subject, text);
    }


}
