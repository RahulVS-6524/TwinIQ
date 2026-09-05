package com.twiniq.dto;

import com.twiniq.entity.Recommendation;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RecommendationResponse {

    private Long id;
    private Long businessId;
    private Long scenarioId;
    private Long simulationId;
    private String scenarioType;
    private String recommendationType;
    private String actionStatement;
    private String rationale;
    private BigDecimal expectedRoiPercent;
    private String riskAssessment;
    private BigDecimal confidenceScore;
    private String status;
    private LocalDateTime createdAt;

    public RecommendationResponse() {
    }

    public static RecommendationResponse fromEntity(Recommendation rec) {
        RecommendationResponse resp = new RecommendationResponse();
        resp.id = rec.getId();
        resp.businessId = rec.getBusiness().getId();
        resp.scenarioId = rec.getScenario().getId();
        resp.simulationId = rec.getSimulation().getId();
        resp.scenarioType = rec.getScenario().getScenarioType().name();
        resp.recommendationType = rec.getRecommendationType();
        resp.actionStatement = rec.getActionStatement();
        resp.rationale = rec.getRationale();
        resp.expectedRoiPercent = rec.getExpectedRoiPercent();
        resp.riskAssessment = rec.getRiskAssessment();
        resp.confidenceScore = rec.getConfidenceScore();
        resp.status = rec.getStatus();
        resp.createdAt = rec.getCreatedAt();
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

    public Long getSimulationId() {
        return simulationId;
    }

    public String getScenarioType() {
        return scenarioType;
    }

    public String getRecommendationType() {
        return recommendationType;
    }

    public String getActionStatement() {
        return actionStatement;
    }

    public String getRationale() {
        return rationale;
    }

    public BigDecimal getExpectedRoiPercent() {
        return expectedRoiPercent;
    }

    public String getRiskAssessment() {
        return riskAssessment;
    }

    public BigDecimal getConfidenceScore() {
        return confidenceScore;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
