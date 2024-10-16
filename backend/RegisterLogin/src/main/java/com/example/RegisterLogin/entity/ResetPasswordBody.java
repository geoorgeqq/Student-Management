package com.example.RegisterLogin.entity;

import lombok.Data;

@Data
public class ResetPasswordBody {
    private String token;
    private String newPassword;
}
