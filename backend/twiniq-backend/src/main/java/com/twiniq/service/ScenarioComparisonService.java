package com.twiniq.service;

import com.twiniq.dto.*;
import com.twiniq.entity.*;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ScenarioComparisonService {

    private final BusinessRepository businessRepository;
    private final ScenarioRepository scenarioRepository;
    private final SimulationService simulationService;
    private final SimulationRepository simulationRepository;
    private final RecommendationService recommendationService;

    public ScenarioComparisonService(BusinessRepository businessRepository,
                                     ScenarioRepository scenarioRepository,
                                     SimulationService simulationService,
                                     SimulationRepository simulationRepository,
                                     RecommendationService recommendationService) {
        this.businessRepository = businessRepository;
        this.scenarioRepository = scenarioRepository;
        this.simulationService = simulationService;
        this.simulationRepository = simulationRepository;
        this.recommendationService = recommendationService;
    }

    @Transactional
    public ScenarioComparisonResponse compareScenarios(Long businessId, List<Long> scenarioIds) {
        if (!businessRepository.existsById(businessId)) {
            throw new ResourceNotFoundException("Business not found with id: " + businessId);
        }

        if (scenarioIds == null || scenarioIds.isEmpty()) {
            throw new IllegalArgumentException("At least one scenarioId must be provided for comparison.");
        }

        List<ScenarioComparisonItem> items = new ArrayList<>();
        Long bestRevId = null;
        BigDecimal maxRev = BigDecimal.valueOf(-Double.MAX_VALUE);
        Long bestMarginId = null;
        BigDecimal maxMargin = BigDecimal.valueOf(-Double.MAX_VALUE);
        Long lowestRiskId = null;
        BigDecimal minRisk = BigDecimal.valueOf(Double.MAX_VALUE);

        for (Long scId : scenarioIds) {
            Scenario sc = scenarioRepository.findById(scId)
                    .orElseThrow(() -> new ResourceNotFoundException("Scenario not found with id: " + scId));

            if (!sc.getBusiness().getId().equals(businessId)) {
                throw new ResourceNotFoundException("Scenario " + scId + " does not belong to business " + businessId);
            }

            List<Simulation> sims = simulationRepository.findByScenario_IdOrderByCreatedAtDesc(scId);
            SimulationResponse sim;
            if (!sims.isEmpty()) {
                sim = SimulationResponse.fromEntity(sims.get(0));
            } else {
                sim = simulationService.runSimulation(businessId, scId);
            }

            RecommendationResponse rec = recommendationService.getBySimulationId(businessId, sim.getId());

            String paramDesc = switch (sc.getScenarioType()) {
                case MARKETING_CHANGE -> "Marketing Spend: " + (sc.getMarketingSpendChangePercent() != null ? sc.getMarketingSpendChangePercent() : "0") + "%";
                case PRICE_CHANGE -> "Pricing Adjustment: " + (sc.getPriceChangePercent() != null ? sc.getPriceChangePercent() : "0") + "%";
                case SUPPLIER_COST_CHANGE -> "Supplier Cost Shift: " + (sc.getSupplierCostChangePercent() != null ? sc.getSupplierCostChangePercent() : "0") + "%";
                case DEMAND_SHOCK -> "Market Demand Shock: " + (sc.getDemandChangePercent() != null ? sc.getDemandChangePercent() : "0") + "%";
            };

            ScenarioComparisonItem item = new ScenarioComparisonItem();
            item.setScenarioId(sc.getId());
            item.setScenarioType(sc.getScenarioType().name());
            item.setParameterDescription(paramDesc);
            item.setProjectedRevenue(sim.getProjectedRevenue());
            item.setRevenueImpactPercent(sim.getRevenueImpactPercent());
            item.setProjectedProfitMargin(sim.getProjectedProfitMargin());
            item.setProfitMarginImpactPercent(sim.getProfitMarginImpactPercent());
            item.setProjectedCustomerRetention(sim.getProjectedCustomerRetention());
            item.setProjectedCustomerAcquisitionCost(sim.getProjectedCustomerAcquisitionCost());
            item.setProjectedOperationalEfficiency(sim.getProjectedOperationalEfficiency());
            item.setProjectedRiskLevel(sim.getProjectedRiskLevel());
            item.setOverallImpact(sim.getOverallImpact());
            item.setRecommendedAction(rec.getActionStatement());
            items.add(item);

            if (sim.getProjectedRevenue() != null && sim.getProjectedRevenue().compareTo(maxRev) > 0) {
                maxRev = sim.getProjectedRevenue();
                bestRevId = sc.getId();
            }
            if (sim.getProjectedProfitMargin() != null && sim.getProjectedProfitMargin().compareTo(maxMargin) > 0) {
                maxMargin = sim.getProjectedProfitMargin();
                bestMarginId = sc.getId();
            }
            if (sim.getProjectedRiskLevel() != null && sim.getProjectedRiskLevel().compareTo(minRisk) < 0) {
                minRisk = sim.getProjectedRiskLevel();
                lowestRiskId = sc.getId();
            }
        }

        String synthesis = "Multi-scenario trade-off evaluation complete across " + items.size() + " options. "
                + (bestRevId != null ? "Scenario #" + bestRevId + " yields optimal top-line revenue ($" + maxRev + "). " : "")
                + (bestMarginId != null ? "Scenario #" + bestMarginId + " secures maximum profit margin (" + maxMargin + "%). " : "")
                + (lowestRiskId != null ? "Scenario #" + lowestRiskId + " provides the safest capital risk profile (" + minRisk + "%)." : "");

        ScenarioComparisonResponse response = new ScenarioComparisonResponse();
        response.setBusinessId(businessId);
        response.setComparedAt(LocalDateTime.now());
        response.setScenarios(items);
        response.setBestRevenueScenarioId(bestRevId);
        response.setBestMarginScenarioId(bestMarginId);
        response.setLowestRiskScenarioId(lowestRiskId);
        response.setComparativeSynthesis(synthesis);

        return response;
    }
}
