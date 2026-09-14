package com.twiniq.dto;

import java.util.List;

public class AssignBusinessesRequest {

    private List<Long> businessIds;

    public AssignBusinessesRequest() {
    }

    public AssignBusinessesRequest(List<Long> businessIds) {
        this.businessIds = businessIds;
    }

    public List<Long> getBusinessIds() {
        return businessIds;
    }

    public void setBusinessIds(List<Long> businessIds) {
        this.businessIds = businessIds;
    }
}
