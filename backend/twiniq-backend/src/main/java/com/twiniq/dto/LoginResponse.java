package com.twiniq.dto;

import java.util.List;

public class LoginResponse {

    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private List<Long> accessibleBusinessIds;

    public LoginResponse() {
    }

    public LoginResponse(String token, Long id, String username, String email, String fullName, String role, List<Long> accessibleBusinessIds) {
        this.token = token;
        this.tokenType = "Bearer";
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.accessibleBusinessIds = accessibleBusinessIds;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
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

    public List<Long> getAccessibleBusinessIds() {
        return accessibleBusinessIds;
    }

    public void setAccessibleBusinessIds(List<Long> accessibleBusinessIds) {
        this.accessibleBusinessIds = accessibleBusinessIds;
    }
}
