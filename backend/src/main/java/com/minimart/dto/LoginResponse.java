package com.minimart.dto;

import java.util.Set;

public class LoginResponse {
    private String token;
    private Long id;
    private String email;
    private String fullName;
    private Set<String> roles;

    public LoginResponse(String token, Long id, String email, String fullName, Set<String> roles) {
        this.token = token; this.id = id; this.email = email; this.fullName = fullName; this.roles = roles;
    }

    public String getToken() { return token; }
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public Set<String> getRoles() { return roles; }
}
