package com.twiniq.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class DashboardSummaryResponse {

    private Long businessId;
    private String businessName;
    private String businessCode;
    private String industry;
    private String location;

    // Overall Health Index
    private BigDecimal overallHealthScore;
    private String healthGrade;
    private String healthSummary;

    // Multi-Dimensional Category Health Scores (0 - 100)
    private BigDecimal financialHealth;
    private BigDecimal customerHealth;
    private BigDecimal operationalHealth;
    private BigDecimal marketHealth;
    private BigDecimal riskSafetyBuffer;

    // 8 Executive KPI Cards with Period-over-Period Deltas
    private List<KpiCard> kpis = new ArrayList<>();

    // Cognitive Twin Pipeline Lifecycle Status
    private PipelineStats pipelineStats;

    public DashboardSummaryResponse() {
    }

    public static class KpiCard {
        private String key;
        private String title;
        private BigDecimal currentValue;
        private BigDecimal previousValue;
        private BigDecimal deltaPercent;
        private String deltaFormatted;
        private String trend; // "UP", "DOWN", "STABLE"
        private boolean favorable;
        private String unit; // "INR", "PERCENT", "SCORE"

        public KpiCard() {
        }

        public KpiCard(String key, String title, BigDecimal currentValue, BigDecimal previousValue,
                       BigDecimal deltaPercent, String deltaFormatted, String trend, boolean favorable, String unit) {
            this.key = key;
            this.title = title;
            this.currentValue = currentValue;
            this.previousValue = previousValue;
            this.deltaPercent = deltaPercent;
            this.deltaFormatted = deltaFormatted;
            this.trend = trend;
            this.favorable = favorable;
            this.unit = unit;
        }

        public String getKey() { return key; }
        public void setKey(String key) { this.key = key; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public BigDecimal getCurrentValue() { return currentValue; }
        public void setCurrentValue(BigDecimal currentValue) { this.currentValue = currentValue; }

        public BigDecimal getPreviousValue() { return previousValue; }
        public void setPreviousValue(BigDecimal previousValue) { this.previousValue = previousValue; }

        public BigDecimal getDeltaPercent() { return deltaPercent; }
        public void setDeltaPercent(BigDecimal deltaPercent) { this.deltaPercent = deltaPercent; }

        public String getDeltaFormatted() { return deltaFormatted; }
        public void setDeltaFormatted(String deltaFormatted) { this.deltaFormatted = deltaFormatted; }

        public String getTrend() { return trend; }
        public void setTrend(String trend) { this.trend = trend; }

        public boolean isFavorable() { return favorable; }
        public void setFavorable(boolean favorable) { this.favorable = favorable; }

        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }
    }

    public static class PipelineStats {
        private long snapshotCount;
        private long scenarioCount;
        private long simulationCount;
        private long recommendationCount;
        private long decisionCount;
        private long outcomeCount;
        private long evolutionCount;
        private double cognitiveTwinMaturity;

        public PipelineStats() {
        }

        public PipelineStats(long snapshotCount, long scenarioCount, long simulationCount,
                             long recommendationCount, long decisionCount, long outcomeCount,
                             long evolutionCount, double cognitiveTwinMaturity) {
            this.snapshotCount = snapshotCount;
            this.scenarioCount = scenarioCount;
            this.simulationCount = simulationCount;
            this.recommendationCount = recommendationCount;
            this.decisionCount = decisionCount;
            this.outcomeCount = outcomeCount;
            this.evolutionCount = evolutionCount;
            this.cognitiveTwinMaturity = cognitiveTwinMaturity;
        }

        public long getSnapshotCount() { return snapshotCount; }
        public void setSnapshotCount(long snapshotCount) { this.snapshotCount = snapshotCount; }

        public long getScenarioCount() { return scenarioCount; }
        public void setScenarioCount(long scenarioCount) { this.scenarioCount = scenarioCount; }

        public long getSimulationCount() { return simulationCount; }
        public void setSimulationCount(long simulationCount) { this.simulationCount = simulationCount; }

        public long getRecommendationCount() { return recommendationCount; }
        public void setRecommendationCount(long recommendationCount) { this.recommendationCount = recommendationCount; }

        public long getDecisionCount() { return decisionCount; }
        public void setDecisionCount(long decisionCount) { this.decisionCount = decisionCount; }

        public long getOutcomeCount() { return outcomeCount; }
        public void setOutcomeCount(long outcomeCount) { this.outcomeCount = outcomeCount; }

        public long getEvolutionCount() { return evolutionCount; }
        public void setEvolutionCount(long evolutionCount) { this.evolutionCount = evolutionCount; }

        public double getCognitiveTwinMaturity() { return cognitiveTwinMaturity; }
        public void setCognitiveTwinMaturity(double cognitiveTwinMaturity) { this.cognitiveTwinMaturity = cognitiveTwinMaturity; }
    }

    public Long getBusinessId() { return businessId; }
    public void setBusinessId(Long businessId) { this.businessId = businessId; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getBusinessCode() { return businessCode; }
    public void setBusinessCode(String businessCode) { this.businessCode = businessCode; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public BigDecimal getOverallHealthScore() { return overallHealthScore; }
    public void setOverallHealthScore(BigDecimal overallHealthScore) { this.overallHealthScore = overallHealthScore; }

    public String getHealthGrade() { return healthGrade; }
    public void setHealthGrade(String healthGrade) { this.healthGrade = healthGrade; }

    public String getHealthSummary() { return healthSummary; }
    public void setHealthSummary(String healthSummary) { this.healthSummary = healthSummary; }

    public BigDecimal getFinancialHealth() { return financialHealth; }
    public void setFinancialHealth(BigDecimal financialHealth) { this.financialHealth = financialHealth; }

    public BigDecimal getCustomerHealth() { return customerHealth; }
    public void setCustomerHealth(BigDecimal customerHealth) { this.customerHealth = customerHealth; }

    public BigDecimal getOperationalHealth() { return operationalHealth; }
    public void setOperationalHealth(BigDecimal operationalHealth) { this.operationalHealth = operationalHealth; }

    public BigDecimal getMarketHealth() { return marketHealth; }
    public void setMarketHealth(BigDecimal marketHealth) { this.marketHealth = marketHealth; }

    public BigDecimal getRiskSafetyBuffer() { return riskSafetyBuffer; }
    public void setRiskSafetyBuffer(BigDecimal riskSafetyBuffer) { this.riskSafetyBuffer = riskSafetyBuffer; }

    public List<KpiCard> getKpis() { return kpis; }
    public void setKpis(List<KpiCard> kpis) { this.kpis = kpis; }

    public PipelineStats getPipelineStats() { return pipelineStats; }
    public void setPipelineStats(PipelineStats pipelineStats) { this.pipelineStats = pipelineStats; }
}
