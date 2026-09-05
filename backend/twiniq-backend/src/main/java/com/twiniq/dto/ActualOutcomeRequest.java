package com.twiniq.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ActualOutcomeRequest {

    @NotNull
    private Long decisionId;

    @NotNull
    private BigDecimal actualRevenue;

    @NotNull
    private BigDecimal actualProfitMargin;

    private BigDecimal actualCustomerRetention;

    private BigDecimal actualCustomerAcquisitionCost;

    private BigDecimal actualOperationalEfficiency;

    private BigDecimal actualRiskLevel;

    private LocalDateTime realizedAt;

    private String notes;

    public ActualOutcomeRequest() {
    }

    public Long getDecisionId() {
        return decisionId;
    }

    public void setDecisionId(Long decisionId) {
        this.decisionId = decisionId;
    }

    public BigDecimal getActualRevenue() {
        return actualRevenue;
    }

    public void setActualRevenue(BigDecimal actualRevenue) {
        this.actualRevenue = actualRevenue;
    }

    public BigDecimal getActualProfitMargin() {
        return actualProfitMargin;
    }

    public void setActualProfitMargin(BigDecimal actualProfitMargin) {
        this.actualProfitMargin = actualProfitMargin;
    }

    public BigDecimal getActualCustomerRetention() {
        return actualCustomerRetention;
    }

    public void setActualCustomerRetention(BigDecimal actualCustomerRetention) {
        this.actualCustomerRetention = actualCustomerRetention;
    }

    public BigDecimal getActualCustomerAcquisitionCost() {
        return actualCustomerAcquisitionCost;
    }

    public void setActualCustomerAcquisitionCost(BigDecimal actualCustomerAcquisitionCost) {
        this.actualCustomerAcquisitionCost = actualCustomerAcquisitionCost;
    }

    public BigDecimal getActualOperationalEfficiency() {
        return actualOperationalEfficiency;
    }

    public void setActualOperationalEfficiency(BigDecimal actualOperationalEfficiency) {
        this.actualOperationalEfficiency = actualOperationalEfficiency;
    }

    public BigDecimal getActualRiskLevel() {
        return actualRiskLevel;
    }

    public void setActualRiskLevel(BigDecimal actualRiskLevel) {
        this.actualRiskLevel = actualRiskLevel;
    }

    public LocalDateTime getRealizedAt() {
        return realizedAt;
    }

    public void setRealizedAt(LocalDateTime realizedAt) {
        this.realizedAt = realizedAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
