package com.minimart.web;

import com.minimart.dto.LoginRequest;
import com.minimart.dto.LoginResponse;
import com.minimart.dto.RegisterUserRequest;
import com.minimart.model.User;
import com.minimart.repository.UserRepository;
import com.minimart.security.JwtUtil;
import com.minimart.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authManager;
    private final JwtUtil jwt;
    private final UserRepository userRepo;
    private final UserService userService;

    public AuthController(AuthenticationManager authManager, JwtUtil jwt, UserRepository userRepo, UserService userService) {
        this.authManager = authManager; this.jwt = jwt; this.userRepo = userRepo; this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(auth);
        User user = userRepo.findByEmail(req.getEmail()).orElseThrow();
        Set<String> roles = user.getRoles().stream().map(Enum::name).collect(Collectors.toSet());
        String token = jwt.generate(user.getEmail(), Map.of("roles", roles));
        return ResponseEntity.ok(new LoginResponse(token, user.getId(), user.getEmail(), user.getFullName(), roles));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterUserRequest req) {
        // Only ADMIN can create users; this is enforced in SecurityConfig via path /api/users/**
        return ResponseEntity.status(403).body(Map.of("message", "Use /api/users endpoint as ADMIN"));
    }
}
