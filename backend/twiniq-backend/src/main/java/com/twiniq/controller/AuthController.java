package com.twiniq.controller;

import com.twiniq.dto.LoginRequest;
import com.twiniq.dto.LoginResponse;
import com.twiniq.dto.UserProfileResponse;
import com.twiniq.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest servletRequest) {
        String ipAddress = servletRequest.getRemoteAddr();
        LoginResponse response = userService.login(request, ipAddress);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUser(Authentication authentication) {
        UserProfileResponse profile = userService.getCurrentUserProfile(authentication);
        return ResponseEntity.ok(profile);
    }
}
