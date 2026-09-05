package com.twiniq.service;

import com.twiniq.dto.ExplanationTraceResponse;
import com.twiniq.dto.SimulationResponse;
import com.twiniq.entity.*;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.repository.BusinessRepository;
import com.twiniq.repository.ScenarioRepository;
import com.twiniq.repository.SimulationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class SimulationService {

    private final SimulationRepository simulationRepository;
    private final ScenarioRepository scenarioRepository;
    private final BusinessRepository businessRepository;

    public SimulationService(SimulationRepository simulationRepository,
                             ScenarioRepository scenarioRepository,
                             BusinessRepository businessRepository) {
        this.simulationRepository = simulationRepository;
        this.scenarioRepository = scenarioRepository;
        this.businessRepository = businessRepository;
    }

    @Transactional
    public SimulationResponse runSimulation(Long businessId, Long scenarioId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + businessId));

        Scenario scenario = scenarioRepository.findById(scenarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Scenario not found with id: " + scenarioId));

        if (!scenario.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException("Scenario " + scenarioId + " does not belong to business " + businessId);
        }

        TwinSnapshot snapshot = scenario.getTwinSnapshot();
        if (snapshot == null) {
            throw new IllegalStateException("Scenario has no associated baseline snapshot.");
        }

        BigDecimal baseRevenue = snapshot.getRevenue() != null ? snapshot.getRevenue() : BigDecimal.valueOf(100000);
        BigDecimal baseMargin = snapshot.getProfitMargin() != null ? snapshot.getProfitMargin() : BigDecimal.valueOf(15);
        BigDecimal baseRetention = snapshot.getCustomerRetention() != null ? snapshot.getCustomerRetention() : BigDecimal.valueOf(80);
        BigDecimal baseCac = snapshot.getCustomerAcquisitionCost() != null ? snapshot.getCustomerAcquisitionCost() : BigDecimal.valueOf(500);
        BigDecimal baseEfficiency = snapshot.getOperationalEfficiency() != null ? snapshot.getOperationalEfficiency() : BigDecimal.valueOf(70);
        BigDecimal baseRisk = snapshot.getRiskLevel() != null ? snapshot.getRiskLevel() : BigDecimal.valueOf(30);

        BigDecimal projRevenue = baseRevenue;
        BigDecimal projMargin = baseMargin;
        BigDecimal projRetention = baseRetention;
        BigDecimal projCac = baseCac;
        BigDecimal projEfficiency = baseEfficiency;
        BigDecimal projRisk = baseRisk;

        List<String> traceSteps = new ArrayList<>();
        traceSteps.add("1. Baseline Loaded: Revenue = $" + baseRevenue + ", Margin = " + baseMargin + "%, Retention = " + baseRetention + "%, CAC = $" + baseCac + ", Efficiency = " + baseEfficiency + "%, Risk = " + baseRisk + "%.");

        String summary = "";

        switch (scenario.getScenarioType()) {
            case MARKETING_CHANGE -> {
                BigDecimal spendChange = scenario.getMarketingSpendChangePercent() != null ? scenario.getMarketingSpendChangePercent() : BigDecimal.ZERO;
                traceSteps.add("2. Trigger: Marketing spend change of " + spendChange + "%.");

                double changeFactor = spendChange.doubleValue() / 100.0;
                double revFactor = 1.0 + (changeFactor * 0.35);
                projRevenue = baseRevenue.multiply(BigDecimal.valueOf(revFactor)).setScale(2, RoundingMode.HALF_UP);

                double cacFactor = 1.0 - (changeFactor * 0.15);
                if (cacFactor < 0.5) cacFactor = 0.5;
                projCac = baseCac.multiply(BigDecimal.valueOf(cacFactor)).setScale(2, RoundingMode.HALF_UP);

                double retentionDelta = changeFactor * 2.0;
                projRetention = clamp(baseRetention.add(BigDecimal.valueOf(retentionDelta)), 0, 100);

                double marginDelta = changeFactor > 0 ? -0.8 * changeFactor : 0.5 * Math.abs(changeFactor);
                projMargin = clamp(baseMargin.add(BigDecimal.valueOf(marginDelta * 10)), 0, 100);

                double riskDelta = changeFactor > 0.5 ? 5.0 : -2.0;
                projRisk = clamp(baseRisk.add(BigDecimal.valueOf(riskDelta)), 0, 100);

                projEfficiency = clamp(baseEfficiency.add(BigDecimal.valueOf(-1.0 * changeFactor * 5)), 0, 100);

                traceSteps.add("3. Acquisition Dynamics: Increased marketing spend improves customer acquisition velocity and brand reach, shifting CAC to $" + projCac + ".");
                traceSteps.add("4. Revenue Growth: Enhanced acquisition pipeline expands customer base, projecting revenue to $" + projRevenue + " (" + formatPct(baseRevenue, projRevenue) + "%).");
                traceSteps.add("5. Margin & Retention: Customer retention shifts to " + projRetention + "%, while operational overhead adjusts profit margin to " + projMargin + "%.");
                traceSteps.add("6. Risk Assessment: Capital allocation risk evaluated at " + projRisk + "%.");

                summary = "Marketing investment adjustment of " + spendChange + "% is projected to generate $" + projRevenue + " revenue with " + projMargin + "% profit margin and CAC of $" + projCac + ".";
            }
            case PRICE_CHANGE -> {
                BigDecimal priceChange = scenario.getPriceChangePercent() != null ? scenario.getPriceChangePercent() : BigDecimal.ZERO;
                traceSteps.add("2. Trigger: Price change of " + priceChange + "%.");

                double pChange = priceChange.doubleValue() / 100.0;
                double demandShift = 1.0 - (pChange * 0.7);
                double netRevFactor = (1.0 + pChange) * demandShift;
                projRevenue = baseRevenue.multiply(BigDecimal.valueOf(netRevFactor)).setScale(2, RoundingMode.HALF_UP);

                double marginShift = pChange * 12.0;
                projMargin = clamp(baseMargin.add(BigDecimal.valueOf(marginShift)), 0, 100);

                double retShift = -1.0 * pChange * 8.0;
                projRetention = clamp(baseRetention.add(BigDecimal.valueOf(retShift)), 0, 100);

                double riskShift = pChange > 0 ? pChange * 15.0 : -pChange * 5.0;
                projRisk = clamp(baseRisk.add(BigDecimal.valueOf(riskShift)), 0, 100);

                traceSteps.add("3. Demand Elasticity: Price change of " + priceChange + "% causes an estimated demand volume response of " + BigDecimal.valueOf((demandShift - 1.0) * 100).setScale(1, RoundingMode.HALF_UP) + "%.");
                traceSteps.add("4. Financial Impact: Revenue shifts to $" + projRevenue + " while unit profit margin adjusts to " + projMargin + "%.");
                traceSteps.add("5. Retention & Churn: Customer price sensitivity adjusts retention rate to " + projRetention + "%.");
                traceSteps.add("6. Competitive Position: Pricing elasticity alters competitive risk index to " + projRisk + "%.");

                summary = "Price change of " + priceChange + "% leads to projected revenue of $" + projRevenue + " and profit margin of " + projMargin + "%.";
            }
            case SUPPLIER_COST_CHANGE -> {
                BigDecimal supplierChange = scenario.getSupplierCostChangePercent() != null ? scenario.getSupplierCostChangePercent() : BigDecimal.ZERO;
                traceSteps.add("2. Trigger: Supplier cost change of " + supplierChange + "%.");

                double sChange = supplierChange.doubleValue() / 100.0;
                double marginShift = -sChange * 18.0;
                projMargin = clamp(baseMargin.add(BigDecimal.valueOf(marginShift)), 0, 100);

                double riskShift = sChange * 20.0;
                projRisk = clamp(baseRisk.add(BigDecimal.valueOf(riskShift)), 0, 100);

                double effShift = -sChange * 10.0;
                projEfficiency = clamp(baseEfficiency.add(BigDecimal.valueOf(effShift)), 0, 100);

                traceSteps.add("3. Cost of Goods Sold (COGS): Cost variation directly impacts production unit economics, compressing margins by " + BigDecimal.valueOf(marginShift).setScale(2, RoundingMode.HALF_UP) + "%.");
                traceSteps.add("4. Margin Pressure: Profit margin projected to reach " + projMargin + "%.");
                traceSteps.add("5. Supply Chain Risk: Operational efficiency shifts to " + projEfficiency + "% and supply chain risk index moves to " + projRisk + "%.");

                summary = "Supplier cost change of " + supplierChange + "% adjusts projected profit margin to " + projMargin + "% and operational risk to " + projRisk + "%.";
            }
            case DEMAND_SHOCK -> {
                BigDecimal demandChange = scenario.getDemandChangePercent() != null ? scenario.getDemandChangePercent() : BigDecimal.ZERO;
                traceSteps.add("2. Trigger: Demand shock of " + demandChange + "%.");

                double dChange = demandChange.doubleValue() / 100.0;
                double revFactor = 1.0 + dChange;
                projRevenue = baseRevenue.multiply(BigDecimal.valueOf(revFactor)).setScale(2, RoundingMode.HALF_UP);

                double effShift = dChange > 0 ? -dChange * 8.0 : dChange * 12.0;
                projEfficiency = clamp(baseEfficiency.add(BigDecimal.valueOf(effShift)), 0, 100);

                double marginShift = dChange * 5.0;
                projMargin = clamp(baseMargin.add(BigDecimal.valueOf(marginShift)), 0, 100);

                double riskShift = Math.abs(dChange) * 15.0;
                projRisk = clamp(baseRisk.add(BigDecimal.valueOf(riskShift)), 0, 100);

                traceSteps.add("3. Market Volume Response: External demand fluctuation creates a " + demandChange + "% volume shift in market intake.");
                traceSteps.add("4. Operating Leverage: Revenue scales to $" + projRevenue + ", shifting profit margin to " + projMargin + "% due to fixed-cost absorption.");
                traceSteps.add("5. Operational Strain & Volatility: Operating capacity strain adjusts efficiency to " + projEfficiency + "% and risk to " + projRisk + "%.");

                summary = "Demand shock of " + demandChange + "% results in projected revenue of $" + projRevenue + " and profit margin of " + projMargin + "%.";
            }
        }

        BigDecimal revImpact = calculatePercentChange(baseRevenue, projRevenue);
        BigDecimal marginImpact = projMargin.subtract(baseMargin).setScale(2, RoundingMode.HALF_UP);
        BigDecimal riskImpact = projRisk.subtract(baseRisk).setScale(2, RoundingMode.HALF_UP);

        String overallImpact;
        if (projRevenue.compareTo(baseRevenue) > 0 && projMargin.compareTo(baseMargin) >= 0 && projRisk.compareTo(BigDecimal.valueOf(50)) <= 0) {
            overallImpact = "POSITIVE";
        } else if (projRisk.compareTo(BigDecimal.valueOf(55)) > 0) {
            overallImpact = "HIGH_RISK";
        } else if (projRevenue.compareTo(baseRevenue) < 0 || projMargin.compareTo(baseMargin) < 0) {
            overallImpact = "NEGATIVE";
        } else {
            overallImpact = "MODERATE";
        }

        traceSteps.add("7. Synthesis: Overall scenario impact evaluated as " + overallImpact + " (Revenue " + revImpact + "%, Margin delta " + marginImpact + " pts, Risk delta " + riskImpact + " pts).");

        Simulation sim = new Simulation();
        sim.setBusiness(business);
        sim.setScenario(scenario);
        sim.setTwinSnapshot(snapshot);
        sim.setProjectedRevenue(projRevenue);
        sim.setProjectedProfitMargin(projMargin);
        sim.setProjectedCustomerRetention(projRetention);
        sim.setProjectedCustomerAcquisitionCost(projCac);
        sim.setProjectedOperationalEfficiency(projEfficiency);
        sim.setProjectedRiskLevel(projRisk);
        sim.setRevenueImpactPercent(revImpact);
        sim.setProfitMarginImpactPercent(marginImpact);
        sim.setRiskImpactPercent(riskImpact);
        sim.setOverallImpact(overallImpact);
        sim.setSummary(summary);
        sim.setExplanationSteps(String.join("|||", traceSteps));

        Simulation saved = simulationRepository.save(sim);

        scenario.setStatus(ScenarioStatus.SIMULATED);
        scenarioRepository.save(scenario);

        return SimulationResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<SimulationResponse> getSimulations(Long businessId) {
        if (!businessRepository.existsById(businessId)) {
            throw new ResourceNotFoundException("Business not found with id: " + businessId);
        }
        return simulationRepository.findByBusiness_IdOrderByCreatedAtDesc(businessId)
                .stream()
                .map(SimulationResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public SimulationResponse getSimulation(Long businessId, Long simulationId) {
        Simulation sim = simulationRepository.findById(simulationId)
                .orElseThrow(() -> new ResourceNotFoundException("Simulation not found with id: " + simulationId));
        if (!sim.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException("Simulation does not belong to business: " + businessId);
        }
        return SimulationResponse.fromEntity(sim);
    }

    @Transactional(readOnly = true)
    public ExplanationTraceResponse getExplanationTrace(Long businessId, Long simulationId) {
        SimulationResponse sim = getSimulation(businessId, simulationId);
        return new ExplanationTraceResponse(
                sim.getId(),
                sim.getScenarioId(),
                sim.getScenarioType(),
                sim.getSummary(),
                sim.getExplanationSteps()
        );
    }

    private BigDecimal clamp(BigDecimal val, double min, double max) {
        if (val == null) return BigDecimal.valueOf(min);
        double d = val.doubleValue();
        if (d < min) d = min;
        if (d > max) d = max;
        return BigDecimal.valueOf(d).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculatePercentChange(BigDecimal base, BigDecimal projected) {
        if (base == null || base.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return projected.subtract(base)
                .divide(base, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
    }

    private String formatPct(BigDecimal base, BigDecimal projected) {
        BigDecimal pct = calculatePercentChange(base, projected);
        return (pct.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "") + pct;
    }
}
