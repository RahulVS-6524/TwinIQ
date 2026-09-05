package com.twiniq.dto;

import com.twiniq.entity.DNAParameterHistory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DNAParameterHistoryResponse {

    private Long id;
    private String parameterName;
    private BigDecimal oldValue;
    private BigDecimal newValue;
    private LocalDateTime changedAt;
    private String reason;

    public DNAParameterHistoryResponse() {
    }

    public static DNAParameterHistoryResponse fromEntity(DNAParameterHistory history) {

        DNAParameterHistoryResponse response = new DNAParameterHistoryResponse();

        response.id = history.getId();
        response.parameterName = history.getParameterName();
        response.oldValue = history.getOldValue();
        response.newValue = history.getNewValue();
        response.changedAt = history.getChangedAt();
        response.reason = history.getReason();

        return response;
    }

    public Long getId() {
        return id;
    }

    public String getParameterName() {
        return parameterName;
    }

    public BigDecimal getOldValue() {
        return oldValue;
    }

    public BigDecimal getNewValue() {
        return newValue;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public String getReason() {
        return reason;
    }
}
