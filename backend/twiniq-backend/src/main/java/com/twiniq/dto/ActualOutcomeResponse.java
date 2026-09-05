package com.twiniq.dto;

import com.twiniq.entity.ActualOutcome;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ActualOutcomeResponse {

    private Long id;
    private Long businessId;
    private Long decisionId;
    private Long scenarioId;
    private String scenarioType;
    private BigDecimal actualRevenue;
    private BigDecimal actualProfitMargin;
    private BigDecimal actualCustomerRetention;
    private BigDecimal actualCustomerAcquisitionCost;
    private BigDecimal actualOperationalEfficiency;
    private BigDecimal actualRiskLevel;
    private LocalDateTime realizedAt;
    private String notes;
    private LocalDateTime createdAt;

    public ActualOutcomeResponse() {
    }

    public static ActualOutcomeResponse fromEntity(ActualOutcome outcome) {
        ActualOutcomeResponse resp = new ActualOutcomeResponse();
        resp.id = outcome.getId();
        resp.businessId = outcome.getBusiness().getId();
        resp.decisionId = outcome.getDecision().getId();
        resp.scenarioId = outcome.getScenario().getId();
        resp.scenarioType = outcome.getScenario().getScenarioType().name();
        resp.actualRevenue = outcome.getActualRevenue();
        resp.actualProfitMargin = outcome.getActualProfitMargin();
        resp.actualCustomerRetention = outcome.getActualCustomerRetention();
        resp.actualCustomerAcquisitionCost = outcome.getActualCustomerAcquisitionCost();
        resp.actualOperationalEfficiency = outcome.getActualOperationalEfficiency();
        resp.actualRiskLevel = outcome.getActualRiskLevel();
        resp.realizedAt = outcome.getRealizedAt();
        resp.notes = outcome.getNotes();
        resp.createdAt = outcome.getCreatedAt();
        return resp;
    }

    public Long getId() {
        return id;
    }

    public Long getBusinessId() {
        return businessId;
    }

    public Long getDecisionId() {
        return decisionId;
    }

    public Long getScenarioId() {
        return scenarioId;
    }

    public String getScenarioType() {
        return scenarioType;
    }

    public BigDecimal getActualRevenue() {
        return actualRevenue;
    }

    public BigDecimal getActualProfitMargin() {
        return actualProfitMargin;
    }

    public BigDecimal getActualCustomerRetention() {
        return actualCustomerRetention;
    }

    public BigDecimal getActualCustomerAcquisitionCost() {
        return actualCustomerAcquisitionCost;
    }

    public BigDecimal getActualOperationalEfficiency() {
        return actualOperationalEfficiency;
    }

    public BigDecimal getActualRiskLevel() {
        return actualRiskLevel;
    }

    public LocalDateTime getRealizedAt() {
        return realizedAt;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
