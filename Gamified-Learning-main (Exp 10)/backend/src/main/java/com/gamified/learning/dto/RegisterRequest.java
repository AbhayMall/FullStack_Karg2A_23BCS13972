// RegisterRequest.java
package com.gamified.learning.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String role = "STUDENT";
}