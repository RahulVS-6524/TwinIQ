package com.twiniq.dto;

import com.twiniq.entity.Simulation;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class SimulationResponse {

    private Long id;
    private Long businessId;
    private Long scenarioId;
    private String scenarioType;
    private Long twinSnapshotId;

    // Baseline metrics
    private BigDecimal baselineRevenue;
    private BigDecimal baselineProfitMargin;
    private BigDecimal baselineCustomerRetention;
    private BigDecimal baselineCustomerAcquisitionCost;
    private BigDecimal baselineOperationalEfficiency;
    private BigDecimal baselineRiskLevel;

    // Projected metrics
    private BigDecimal projectedRevenue;
    private BigDecimal projectedProfitMargin;
    private BigDecimal projectedCustomerRetention;
    private BigDecimal projectedCustomerAcquisitionCost;
    private BigDecimal projectedOperationalEfficiency;
    private BigDecimal projectedRiskLevel;

    // Impacts
    private BigDecimal revenueImpactPercent;
    private BigDecimal profitMarginImpactPercent;
    private BigDecimal riskImpactPercent;
    private String overallImpact;

    private String summary;
    private List<String> explanationSteps;
    private LocalDateTime createdAt;

    public SimulationResponse() {
    }

    public static SimulationResponse fromEntity(Simulation sim) {
        SimulationResponse resp = new SimulationResponse();
        resp.id = sim.getId();
        resp.businessId = sim.getBusiness().getId();
        resp.scenarioId = sim.getScenario().getId();
        resp.scenarioType = sim.getScenario().getScenarioType().name();
        resp.twinSnapshotId = sim.getTwinSnapshot().getId();

        var snap = sim.getTwinSnapshot();
        resp.baselineRevenue = snap.getRevenue();
        resp.baselineProfitMargin = snap.getProfitMargin();
        resp.baselineCustomerRetention = snap.getCustomerRetention();
        resp.baselineCustomerAcquisitionCost = snap.getCustomerAcquisitionCost();
        resp.baselineOperationalEfficiency = snap.getOperationalEfficiency();
        resp.baselineRiskLevel = snap.getRiskLevel();

        resp.projectedRevenue = sim.getProjectedRevenue();
        resp.projectedProfitMargin = sim.getProjectedProfitMargin();
        resp.projectedCustomerRetention = sim.getProjectedCustomerRetention();
        resp.projectedCustomerAcquisitionCost = sim.getProjectedCustomerAcquisitionCost();
        resp.projectedOperationalEfficiency = sim.getProjectedOperationalEfficiency();
        resp.projectedRiskLevel = sim.getProjectedRiskLevel();

        resp.revenueImpactPercent = sim.getRevenueImpactPercent();
        resp.profitMarginImpactPercent = sim.getProfitMarginImpactPercent();
        resp.riskImpactPercent = sim.getRiskImpactPercent();
        resp.overallImpact = sim.getOverallImpact();
        resp.summary = sim.getSummary();

        if (sim.getExplanationSteps() != null && !sim.getExplanationSteps().isBlank()) {
            resp.explanationSteps = Arrays.asList(sim.getExplanationSteps().split("\\|\\|\\|"));
        } else {
            resp.explanationSteps = Collections.emptyList();
        }

        resp.createdAt = sim.getCreatedAt();
        return resp;
    }

    public Long getId() {
        return id;
    }

    public Long getBusinessId() {
        return businessId;
    }

    public Long getScenarioId() {
        return scenarioId;
    }

    public String getScenarioType() {
        return scenarioType;
    }

    public Long getTwinSnapshotId() {
        return twinSnapshotId;
    }

    public BigDecimal getBaselineRevenue() {
        return baselineRevenue;
    }

    public BigDecimal getBaselineProfitMargin() {
        return baselineProfitMargin;
    }

    public BigDecimal getBaselineCustomerRetention() {
        return baselineCustomerRetention;
    }

    public BigDecimal getBaselineCustomerAcquisitionCost() {
        return baselineCustomerAcquisitionCost;
    }

    public BigDecimal getBaselineOperationalEfficiency() {
        return baselineOperationalEfficiency;
    }

    public BigDecimal getBaselineRiskLevel() {
        return baselineRiskLevel;
    }

    public BigDecimal getProjectedRevenue() {
        return projectedRevenue;
    }

    public BigDecimal getProjectedProfitMargin() {
        return projectedProfitMargin;
    }

    public BigDecimal getProjectedCustomerRetention() {
        return projectedCustomerRetention;
    }

    public BigDecimal getProjectedCustomerAcquisitionCost() {
        return projectedCustomerAcquisitionCost;
    }

    public BigDecimal getProjectedOperationalEfficiency() {
        return projectedOperationalEfficiency;
    }

    public BigDecimal getProjectedRiskLevel() {
        return projectedRiskLevel;
    }

    public BigDecimal getRevenueImpactPercent() {
        return revenueImpactPercent;
    }

    public BigDecimal getProfitMarginImpactPercent() {
        return profitMarginImpactPercent;
    }

    public BigDecimal getRiskImpactPercent() {
        return riskImpactPercent;
    }

    public String getOverallImpact() {
        return overallImpact;
    }

    public String getSummary() {
        return summary;
    }

    public List<String> getExplanationSteps() {
        return explanationSteps;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
