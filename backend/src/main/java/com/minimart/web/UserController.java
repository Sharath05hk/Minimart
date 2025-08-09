package com.minimart.web;

import com.minimart.dto.RegisterUserRequest;
import com.minimart.model.User;
import com.minimart.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    // ✅ Get all users
    @GetMapping
    public List<User> all() {
        return service.all();
    }

    // ✅ Create new user
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody RegisterUserRequest req) {
        User u = service.create(req);
        return ResponseEntity.ok(Map.of("id", u.getId()));
    }

    // ✅ Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = service.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // ✅ Update user (only allowed for ADMIN or MANAGER)
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @PutMapping("/{id}")
public ResponseEntity<User> update(@PathVariable Long id, @Valid @RequestBody RegisterUserRequest request) {
    User updatedUser = service.updateUser(id, request);
    return ResponseEntity.ok(updatedUser);
}
@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
 @PatchMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @Valid @RequestBody RegisterUserRequest request) {
        User updated = service.updateUser(id, request);
        return ResponseEntity.ok(updated);
    }
    // ✅ Delete user (only allowed for ADMIN or MANAGER)
    @PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }
}
