package com.twiniq.dto;

import java.util.List;

public class ExplanationTraceResponse {

    private Long simulationId;
    private Long scenarioId;
    private String scenarioType;
    private String summary;
    private List<String> traceSteps;

    public ExplanationTraceResponse() {
    }

    public ExplanationTraceResponse(Long simulationId, Long scenarioId, String scenarioType, String summary, List<String> traceSteps) {
        this.simulationId = simulationId;
        this.scenarioId = scenarioId;
        this.scenarioType = scenarioType;
        this.summary = summary;
        this.traceSteps = traceSteps;
    }

    public Long getSimulationId() {
        return simulationId;
    }

    public Long getScenarioId() {
        return scenarioId;
    }

    public String getScenarioType() {
        return scenarioType;
    }

    public String getSummary() {
        return summary;
    }

    public List<String> getTraceSteps() {
        return traceSteps;
    }
}
