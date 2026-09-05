package com.twiniq.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ScenarioComparisonResponse {

    private Long businessId;
    private LocalDateTime comparedAt;
    private List<ScenarioComparisonItem> scenarios;
    private Long bestRevenueScenarioId;
    private Long bestMarginScenarioId;
    private Long lowestRiskScenarioId;
    private String comparativeSynthesis;

    public ScenarioComparisonResponse() {
    }

    public Long getBusinessId() {
        return businessId;
    }

    public void setBusinessId(Long businessId) {
        this.businessId = businessId;
    }

    public LocalDateTime getComparedAt() {
        return comparedAt;
    }

    public void setComparedAt(LocalDateTime comparedAt) {
        this.comparedAt = comparedAt;
    }

    public List<ScenarioComparisonItem> getScenarios() {
        return scenarios;
    }

    public void setScenarios(List<ScenarioComparisonItem> scenarios) {
        this.scenarios = scenarios;
    }

    public Long getBestRevenueScenarioId() {
        return bestRevenueScenarioId;
    }

    public void setBestRevenueScenarioId(Long bestRevenueScenarioId) {
        this.bestRevenueScenarioId = bestRevenueScenarioId;
    }

    public Long getBestMarginScenarioId() {
        return bestMarginScenarioId;
    }

    public void setBestMarginScenarioId(Long bestMarginScenarioId) {
        this.bestMarginScenarioId = bestMarginScenarioId;
    }

    public Long getLowestRiskScenarioId() {
        return lowestRiskScenarioId;
    }

    public void setLowestRiskScenarioId(Long lowestRiskScenarioId) {
        this.lowestRiskScenarioId = lowestRiskScenarioId;
    }

    public String getComparativeSynthesis() {
        return comparativeSynthesis;
    }

    public void setComparativeSynthesis(String comparativeSynthesis) {
        this.comparativeSynthesis = comparativeSynthesis;
    }
}
