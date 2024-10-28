package com.example.RegisterLogin.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class LoginRequest {
    private String email;

    @JsonProperty("isChecked")
    private boolean isChecked;

    private String password;

}
