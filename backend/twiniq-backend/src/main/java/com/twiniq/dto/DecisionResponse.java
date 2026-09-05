package com.twiniq.dto;

import com.twiniq.entity.Decision;

import java.time.LocalDateTime;

public class DecisionResponse {

    private Long id;
    private Long businessId;
    private Long scenarioId;
    private String scenarioType;
    private Long simulationId;
    private Long recommendationId;
    private String recommendationAction;
    private String decisionStatus;
    private String decisionMaker;
    private String notes;
    private LocalDateTime implementedAt;
    private LocalDateTime createdAt;

    public DecisionResponse() {
    }

    public static DecisionResponse fromEntity(Decision dec) {
        DecisionResponse resp = new DecisionResponse();
        resp.id = dec.getId();
        resp.businessId = dec.getBusiness().getId();
        resp.scenarioId = dec.getScenario().getId();
        resp.scenarioType = dec.getScenario().getScenarioType().name();
        resp.simulationId = dec.getSimulation().getId();
        if (dec.getRecommendation() != null) {
            resp.recommendationId = dec.getRecommendation().getId();
            resp.recommendationAction = dec.getRecommendation().getActionStatement();
        }
        resp.decisionStatus = dec.getDecisionStatus();
        resp.decisionMaker = dec.getDecisionMaker();
        resp.notes = dec.getNotes();
        resp.implementedAt = dec.getImplementedAt();
        resp.createdAt = dec.getCreatedAt();
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

    public Long getSimulationId() {
        return simulationId;
    }

    public Long getRecommendationId() {
        return recommendationId;
    }

    public String getRecommendationAction() {
        return recommendationAction;
    }

    public String getDecisionStatus() {
        return decisionStatus;
    }

    public String getDecisionMaker() {
        return decisionMaker;
    }

    public String getNotes() {
        return notes;
    }

    public LocalDateTime getImplementedAt() {
        return implementedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
