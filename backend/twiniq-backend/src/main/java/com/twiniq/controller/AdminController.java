package com.twiniq.controller;

import com.twiniq.dto.*;
import com.twiniq.entity.AuditLog;
import com.twiniq.service.AuditService;
import com.twiniq.service.BusinessService;
import com.twiniq.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN') or hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final UserService userService;
    private final BusinessService businessService;
    private final AuditService auditService;

    public AdminController(UserService userService, BusinessService businessService, AuditService auditService) {
        this.userService = userService;
        this.businessService = businessService;
        this.auditService = auditService;
    }

    @GetMapping("/overview")
    public ResponseEntity<AdminOverviewResponse> getOverview() {
        return ResponseEntity.ok(userService.getAdminOverview());
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserSummaryDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<UserSummaryDto> createUser(
            @Valid @RequestBody CreateUserRequest request,
            Authentication authentication,
            HttpServletRequest servletRequest) {
        String adminUsername = authentication != null ? authentication.getName() : "system";
        String ipAddress = servletRequest.getRemoteAddr();
        UserSummaryDto created = userService.createUser(request, adminUsername, ipAddress);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserSummaryDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request,
            Authentication authentication,
            HttpServletRequest servletRequest) {
        String adminUsername = authentication != null ? authentication.getName() : "system";
        String ipAddress = servletRequest.getRemoteAddr();
        UserSummaryDto updated = userService.updateUser(id, request, adminUsername, ipAddress);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<UserSummaryDto> toggleUserStatus(
            @PathVariable Long id,
            Authentication authentication,
            HttpServletRequest servletRequest) {
        String adminUsername = authentication != null ? authentication.getName() : "system";
        String ipAddress = servletRequest.getRemoteAddr();
        UserSummaryDto toggled = userService.toggleUserStatus(id, adminUsername, ipAddress);
        return ResponseEntity.ok(toggled);
    }

    @PostMapping("/users/{id}/assign-businesses")
    public ResponseEntity<Void> assignBusinesses(
            @PathVariable Long id,
            @RequestBody AssignBusinessesRequest request,
            Authentication authentication,
            HttpServletRequest servletRequest) {
        String adminUsername = authentication != null ? authentication.getName() : "system";
        String ipAddress = servletRequest.getRemoteAddr();
        userService.assignBusinesses(id, request.getBusinessIds(), adminUsername, ipAddress);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditService.getRecentLogs());
    }

    @GetMapping("/businesses")
    public ResponseEntity<List<BusinessResponse>> getAllBusinesses() {
        return ResponseEntity.ok(businessService.getAllBusinesses().stream().map(BusinessResponse::fromEntity).toList());
    }
}
