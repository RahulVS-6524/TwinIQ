package com.twiniq;

import com.twiniq.dto.*;
import com.twiniq.entity.ScenarioType;
import com.twiniq.service.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class TwinEvolutionServiceTest {

    @Autowired
    private ScenarioService scenarioService;

    @Autowired
    private SimulationService simulationService;

    @Autowired
    private DecisionService decisionService;

    @Autowired
    private ActualOutcomeService actualOutcomeService;

    @Autowired
    private TwinEvolutionService twinEvolutionService;

    @Test
    @DisplayName("Twin Evolution correctly evaluates prediction variance and updates closed-loop model")
    void testEvaluateAndEvolve_ClosedLoop() {
        // 1. Create Scenario
        ScenarioCreateRequest scReq = new ScenarioCreateRequest();
        scReq.setScenarioType(ScenarioType.MARKETING_CHANGE);
        scReq.setMarketingSpendChangePercent(BigDecimal.valueOf(20.0));
        ScenarioResponse scenario = scenarioService.createScenario(1L, scReq);

        // 2. Run Simulation
        SimulationResponse simulation = simulationService.runSimulation(1L, scenario.getId());

        // 3. Record Decision
        DecisionRequest decReq = new DecisionRequest();
        decReq.setScenarioId(scenario.getId());
        decReq.setSimulationId(simulation.getId());
        decReq.setDecisionStatus("ACCEPTED");
        decReq.setDecisionMaker("Rahul QA Test");
        decReq.setNotes("Approved for automated test execution");
        DecisionResponse decision = decisionService.recordDecision(1L, decReq);

        // 4. Record Actual Outcome
        ActualOutcomeRequest outReq = new ActualOutcomeRequest();
        outReq.setDecisionId(decision.getId());
        outReq.setActualRevenue(BigDecimal.valueOf(550000.00));
        outReq.setActualProfitMargin(BigDecimal.valueOf(21.50));
        outReq.setActualCustomerRetention(BigDecimal.valueOf(84.0));
        outReq.setActualCustomerAcquisitionCost(BigDecimal.valueOf(1100.0));
        ActualOutcomeResponse outcome = actualOutcomeService.recordActualOutcome(1L, outReq);

        // 5. Evaluate and Evolve
        TwinEvolutionResponse evo = twinEvolutionService.evaluateAndEvolve(1L, outcome.getId());

        assertNotNull(evo);
        assertEquals(outcome.getId(), evo.getActualOutcomeId());
        assertNotNull(evo.getOverallAccuracyPercent());
        assertTrue(evo.getOverallAccuracyPercent().doubleValue() >= 50.0 && evo.getOverallAccuracyPercent().doubleValue() <= 100.0,
                "Accuracy should be bounded between 50% and 100%");
        assertNotNull(evo.getEvolutionInsight());
        assertNotNull(evo.getCalibrationAction());
    }
}
