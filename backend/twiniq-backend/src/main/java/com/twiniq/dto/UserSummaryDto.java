package com.twiniq.dto;

import java.time.LocalDateTime;
import java.util.List;

public class UserSummaryDto {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private boolean enabled;
    private int assignedBusinessCount;
    private List<Long> assignedBusinessIds;
    private List<String> assignedBusinessNames;
    private LocalDateTime createdAt;

    public UserSummaryDto() {
    }

    public UserSummaryDto(Long id, String username, String email, String fullName, String role, boolean enabled, int assignedBusinessCount, List<Long> assignedBusinessIds, List<String> assignedBusinessNames, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.enabled = enabled;
        this.assignedBusinessCount = assignedBusinessCount;
        this.assignedBusinessIds = assignedBusinessIds;
        this.assignedBusinessNames = assignedBusinessNames;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public int getAssignedBusinessCount() {
        return assignedBusinessCount;
    }

    public void setAssignedBusinessCount(int assignedBusinessCount) {
        this.assignedBusinessCount = assignedBusinessCount;
    }

    public List<Long> getAssignedBusinessIds() {
        return assignedBusinessIds;
    }

    public void setAssignedBusinessIds(List<Long> assignedBusinessIds) {
        this.assignedBusinessIds = assignedBusinessIds;
    }

    public List<String> getAssignedBusinessNames() {
        return assignedBusinessNames;
    }

    public void setAssignedBusinessNames(List<String> assignedBusinessNames) {
        this.assignedBusinessNames = assignedBusinessNames;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
