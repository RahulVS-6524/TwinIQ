package com.twiniq.dto;

import java.math.BigDecimal;

public class ScenarioComparisonItem {

    private Long scenarioId;
    private String scenarioType;
    private String parameterDescription;
    private BigDecimal projectedRevenue;
    private BigDecimal revenueImpactPercent;
    private BigDecimal projectedProfitMargin;
    private BigDecimal profitMarginImpactPercent;
    private BigDecimal projectedCustomerRetention;
    private BigDecimal projectedCustomerAcquisitionCost;
    private BigDecimal projectedOperationalEfficiency;
    private BigDecimal projectedRiskLevel;
    private String overallImpact;
    private String recommendedAction;

    public ScenarioComparisonItem() {
    }

    public Long getScenarioId() {
        return scenarioId;
    }

    public void setScenarioId(Long scenarioId) {
        this.scenarioId = scenarioId;
    }

    public String getScenarioType() {
        return scenarioType;
    }

    public void setScenarioType(String scenarioType) {
        this.scenarioType = scenarioType;
    }

    public String getParameterDescription() {
        return parameterDescription;
    }

    public void setParameterDescription(String parameterDescription) {
        this.parameterDescription = parameterDescription;
    }

    public BigDecimal getProjectedRevenue() {
        return projectedRevenue;
    }

    public void setProjectedRevenue(BigDecimal projectedRevenue) {
        this.projectedRevenue = projectedRevenue;
    }

    public BigDecimal getRevenueImpactPercent() {
        return revenueImpactPercent;
    }

    public void setRevenueImpactPercent(BigDecimal revenueImpactPercent) {
        this.revenueImpactPercent = revenueImpactPercent;
    }

    public BigDecimal getProjectedProfitMargin() {
        return projectedProfitMargin;
    }

    public void setProjectedProfitMargin(BigDecimal projectedProfitMargin) {
        this.projectedProfitMargin = projectedProfitMargin;
    }

    public BigDecimal getProfitMarginImpactPercent() {
        return profitMarginImpactPercent;
    }

    public void setProfitMarginImpactPercent(BigDecimal profitMarginImpactPercent) {
        this.profitMarginImpactPercent = profitMarginImpactPercent;
    }

    public BigDecimal getProjectedCustomerRetention() {
        return projectedCustomerRetention;
    }

    public void setProjectedCustomerRetention(BigDecimal projectedCustomerRetention) {
        this.projectedCustomerRetention = projectedCustomerRetention;
    }

    public BigDecimal getProjectedCustomerAcquisitionCost() {
        return projectedCustomerAcquisitionCost;
    }

    public void setProjectedCustomerAcquisitionCost(BigDecimal projectedCustomerAcquisitionCost) {
        this.projectedCustomerAcquisitionCost = projectedCustomerAcquisitionCost;
    }

    public BigDecimal getProjectedOperationalEfficiency() {
        return projectedOperationalEfficiency;
    }

    public void setProjectedOperationalEfficiency(BigDecimal projectedOperationalEfficiency) {
        this.projectedOperationalEfficiency = projectedOperationalEfficiency;
    }

    public BigDecimal getProjectedRiskLevel() {
        return projectedRiskLevel;
    }

    public void setProjectedRiskLevel(BigDecimal projectedRiskLevel) {
        this.projectedRiskLevel = projectedRiskLevel;
    }

    public String getOverallImpact() {
        return overallImpact;
    }

    public void setOverallImpact(String overallImpact) {
        this.overallImpact = overallImpact;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public void setRecommendedAction(String recommendedAction) {
        this.recommendedAction = recommendedAction;
    }
}
