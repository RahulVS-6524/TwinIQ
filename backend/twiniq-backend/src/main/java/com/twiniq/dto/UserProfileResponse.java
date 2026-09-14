package com.twiniq.dto;

import java.util.List;

public class UserProfileResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private boolean enabled;
    private List<Long> accessibleBusinessIds;
    private List<BusinessResponse> accessibleBusinesses;

    public UserProfileResponse() {
    }

    public UserProfileResponse(Long id, String username, String email, String fullName, String role, boolean enabled, List<Long> accessibleBusinessIds, List<BusinessResponse> accessibleBusinesses) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.enabled = enabled;
        this.accessibleBusinessIds = accessibleBusinessIds;
        this.accessibleBusinesses = accessibleBusinesses;
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

    public List<Long> getAccessibleBusinessIds() {
        return accessibleBusinessIds;
    }

    public void setAccessibleBusinessIds(List<Long> accessibleBusinessIds) {
        this.accessibleBusinessIds = accessibleBusinessIds;
    }

    public List<BusinessResponse> getAccessibleBusinesses() {
        return accessibleBusinesses;
    }

    public void setAccessibleBusinesses(List<BusinessResponse> accessibleBusinesses) {
        this.accessibleBusinesses = accessibleBusinesses;
    }
}
