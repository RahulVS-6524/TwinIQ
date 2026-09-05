package com.twiniq.dto;

import com.twiniq.entity.Business;

import java.time.LocalDateTime;

public class BusinessResponse {

    private Long id;
    private String businessCode;
    private String businessName;
    private String industry;
    private String description;
    private String location;
    private String contactEmail;
    private String contactPhone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BusinessResponse() {
    }

    public static BusinessResponse fromEntity(Business business) {

        BusinessResponse response = new BusinessResponse();

        response.id = business.getId();
        response.businessCode = business.getBusinessCode();
        response.businessName = business.getBusinessName();
        response.industry = business.getIndustry();
        response.description = business.getDescription();
        response.location = business.getLocation();
        response.contactEmail = business.getContactEmail();
        response.contactPhone = business.getContactPhone();
        response.createdAt = business.getCreatedAt();
        response.updatedAt = business.getUpdatedAt();

        return response;
    }

    public Long getId() {
        return id;
    }

    public String getBusinessCode() {
        return businessCode;
    }

    public String getBusinessName() {
        return businessName;
    }

    public String getIndustry() {
        return industry;
    }

    public String getDescription() {
        return description;
    }

    public String getLocation() {
        return location;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}