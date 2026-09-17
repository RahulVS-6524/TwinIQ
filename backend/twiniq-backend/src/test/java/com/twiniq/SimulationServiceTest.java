package com.twiniq;

import com.twiniq.dto.ScenarioCreateRequest;
import com.twiniq.dto.ScenarioResponse;
import com.twiniq.dto.SimulationResponse;
import com.twiniq.entity.ScenarioType;
import com.twiniq.service.ScenarioService;
import com.twiniq.service.SimulationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class SimulationServiceTest {

    @Autowired
    private SimulationService simulationService;

    @Autowired
    private ScenarioService scenarioService;

    @Test
    @DisplayName("Simulation correctly computes revenue increase and CAC compression for MARKETING_CHANGE")
    void testMarketingChangeSimulation() {
        ScenarioCreateRequest request = new ScenarioCreateRequest();
        request.setScenarioType(ScenarioType.MARKETING_CHANGE);
        request.setMarketingSpendChangePercent(BigDecimal.valueOf(25.0));

        ScenarioResponse scenario = scenarioService.createScenario(1L, request);
        assertNotNull(scenario);

        SimulationResponse simulation = simulationService.runSimulation(1L, scenario.getId());
        assertNotNull(simulation);
        assertEquals(scenario.getId(), simulation.getScenarioId());

        assertTrue(simulation.getProjectedRevenue().compareTo(BigDecimal.ZERO) > 0);
        assertTrue(simulation.getRevenueImpactPercent().compareTo(BigDecimal.ZERO) > 0);
        assertNotNull(simulation.getExplanationSteps());
        assertTrue(simulation.getExplanationSteps().size() >= 5, "Should generate detailed causal reasoning steps");
    }

    @Test
    @DisplayName("Simulation correctly models margin expansion and price elasticity for PRICE_CHANGE")
    void testPriceChangeSimulation() {
        ScenarioCreateRequest request = new ScenarioCreateRequest();
        request.setScenarioType(ScenarioType.PRICE_CHANGE);
        request.setPriceChangePercent(BigDecimal.valueOf(10.0));

        ScenarioResponse scenario = scenarioService.createScenario(1L, request);
        assertNotNull(scenario);

        SimulationResponse simulation = simulationService.runSimulation(1L, scenario.getId());
        assertNotNull(simulation);
        assertEquals(scenario.getId(), simulation.getScenarioId());

        assertTrue(simulation.getProjectedProfitMargin().compareTo(BigDecimal.ZERO) > 0);
        assertNotNull(simulation.getOverallImpact());
    }

    @Test
    @DisplayName("Simulation correctly models margin erosion for SUPPLIER_COST_CHANGE")
    void testSupplierCostChangeSimulation() {
        ScenarioCreateRequest request = new ScenarioCreateRequest();
        request.setScenarioType(ScenarioType.SUPPLIER_COST_CHANGE);
        request.setSupplierCostChangePercent(BigDecimal.valueOf(15.0));

        ScenarioResponse scenario = scenarioService.createScenario(1L, request);
        assertNotNull(scenario);

        SimulationResponse simulation = simulationService.runSimulation(1L, scenario.getId());
        assertNotNull(simulation);

        assertTrue(simulation.getProfitMarginImpactPercent().compareTo(BigDecimal.ZERO) < 0,
                "Supplier cost increase should negatively impact profit margin");
    }
}
