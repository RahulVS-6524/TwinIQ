package com.twiniq.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class ScenarioCompareRequest {

    @NotEmpty
    private List<Long> scenarioIds;

    public ScenarioCompareRequest() {
    }

    public ScenarioCompareRequest(List<Long> scenarioIds) {
        this.scenarioIds = scenarioIds;
    }

    public List<Long> getScenarioIds() {
        return scenarioIds;
    }

    public void setScenarioIds(List<Long> scenarioIds) {
        this.scenarioIds = scenarioIds;
    }
}
