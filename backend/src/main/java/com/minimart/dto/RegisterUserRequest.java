package com.minimart.dto;

import com.minimart.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public class RegisterUserRequest {
    @Email @NotBlank
    private String email;
    @NotBlank
    private String fullName;
    @NotBlank
    private String password;
    @NotEmpty
    private Set<Role> roles;

    public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; } public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPassword() { return password; } public void setPassword(String password) { this.password = password; }
    public Set<Role> getRoles() { return roles; } public void setRoles(Set<Role> roles) { this.roles = roles; }
}
