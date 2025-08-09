package com.minimart.service;

import com.minimart.dto.RegisterUserRequest;
import com.minimart.model.Role;
import com.minimart.model.User;
import com.minimart.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    // Create user
    public User create(RegisterUserRequest req) {
        if (repo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Set<Role> roles = req.getRoles(); // assumed roles already parsed and valid
        User user = new User(
                req.getEmail(),
                encoder.encode(req.getPassword()),
                req.getFullName(),
                roles
        );
        return repo.save(user);
    }

    // Get all users
    public List<User> all() {
        return repo.findAll();
    }

    // Get user by ID
    public User getUserById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    // Delete user by ID
    public void deleteById(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("User not found with ID: " + id);
        }
        repo.deleteById(id);
    }

    // PUT - Full update
    public User updateUser(Long id, RegisterUserRequest req) {
        User existingUser = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        existingUser.setEmail(req.getEmail());
        existingUser.setFullName(req.getFullName());
        existingUser.setRoles(req.getRoles());

        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            existingUser.setPassword(encoder.encode(req.getPassword()));
        }

        return repo.save(existingUser);
    }

    // PATCH method in UserService
public User patchUser(Long id, Map<String, Object> updates) {
    User user = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

    if (updates.containsKey("email")) {
        user.setEmail((String) updates.get("email"));
    }

    if (updates.containsKey("fullName")) {
        user.setFullName((String) updates.get("fullName"));
    }

    if (updates.containsKey("password")) {
        String rawPassword = (String) updates.get("password");
        if (rawPassword != null && !rawPassword.isBlank()) {
            user.setPassword(encoder.encode(rawPassword));
        }
    }

    if (updates.containsKey("roles")) {
        // Safely parse roles from the request
        @SuppressWarnings("unchecked")
        List<String> roleStrings = (List<String>) updates.get("roles");
        Set<Role> roles = roleStrings.stream().map(Role::valueOf).collect(Collectors.toSet());
        user.setRoles(roles);
    }

    return repo.save(user);
}
}
