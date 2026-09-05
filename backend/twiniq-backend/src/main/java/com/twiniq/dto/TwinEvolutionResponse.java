package com.twiniq.dto;

import com.twiniq.entity.TwinEvolution;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TwinEvolutionResponse {

    private Long id;
    private Long businessId;
    private Long decisionId;
    private Long simulationId;
    private Long actualOutcomeId;
    private String scenarioType;

    // Predictions vs Actuals
    private BigDecimal projectedRevenue;
    private BigDecimal actualRevenue;
    private BigDecimal projectedProfitMargin;
    private BigDecimal actualProfitMargin;
    private BigDecimal projectedCac;
    private BigDecimal actualCac;

    // Accuracy & Learning
    private BigDecimal revenueVariancePercent;
    private BigDecimal profitMarginVariancePoints;
    private BigDecimal cacVariancePercent;
    private BigDecimal overallAccuracyPercent;
    private String evolutionInsight;
    private String calibrationAction;
    private LocalDateTime appliedAt;

    public TwinEvolutionResponse() {
    }

    public static TwinEvolutionResponse fromEntity(TwinEvolution evo) {
        TwinEvolutionResponse resp = new TwinEvolutionResponse();
        resp.id = evo.getId();
        resp.businessId = evo.getBusiness().getId();
        resp.decisionId = evo.getDecision().getId();
        resp.simulationId = evo.getSimulation().getId();
        resp.actualOutcomeId = evo.getActualOutcome().getId();
        resp.scenarioType = evo.getSimulation().getScenario().getScenarioType().name();

        resp.projectedRevenue = evo.getSimulation().getProjectedRevenue();
        resp.actualRevenue = evo.getActualOutcome().getActualRevenue();
        resp.projectedProfitMargin = evo.getSimulation().getProjectedProfitMargin();
        resp.actualProfitMargin = evo.getActualOutcome().getActualProfitMargin();
        resp.projectedCac = evo.getSimulation().getProjectedCustomerAcquisitionCost();
        resp.actualCac = evo.getActualOutcome().getActualCustomerAcquisitionCost();

        resp.revenueVariancePercent = evo.getRevenueVariancePercent();
        resp.profitMarginVariancePoints = evo.getProfitMarginVariancePoints();
        resp.cacVariancePercent = evo.getCacVariancePercent();
        resp.overallAccuracyPercent = evo.getOverallAccuracyPercent();
        resp.evolutionInsight = evo.getEvolutionInsight();
        resp.calibrationAction = evo.getCalibrationAction();
        resp.appliedAt = evo.getAppliedAt();
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

    public Long getSimulationId() {
        return simulationId;
    }

    public Long getActualOutcomeId() {
        return actualOutcomeId;
    }

    public String getScenarioType() {
        return scenarioType;
    }

    public BigDecimal getProjectedRevenue() {
        return projectedRevenue;
    }

    public BigDecimal getActualRevenue() {
        return actualRevenue;
    }

    public BigDecimal getProjectedProfitMargin() {
        return projectedProfitMargin;
    }

    public BigDecimal getActualProfitMargin() {
        return actualProfitMargin;
    }

    public BigDecimal getProjectedCac() {
        return projectedCac;
    }

    public BigDecimal getActualCac() {
        return actualCac;
    }

    public BigDecimal getRevenueVariancePercent() {
        return revenueVariancePercent;
    }

    public BigDecimal getProfitMarginVariancePoints() {
        return profitMarginVariancePoints;
    }

    public BigDecimal getCacVariancePercent() {
        return cacVariancePercent;
    }

    public BigDecimal getOverallAccuracyPercent() {
        return overallAccuracyPercent;
    }

    public String getEvolutionInsight() {
        return evolutionInsight;
    }

    public String getCalibrationAction() {
        return calibrationAction;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }
}
