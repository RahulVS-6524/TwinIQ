package com.twiniq.service;

import com.twiniq.dto.DashboardSummaryResponse;
import com.twiniq.dto.DashboardSummaryResponse.KpiCard;
import com.twiniq.dto.DashboardSummaryResponse.PipelineStats;
import com.twiniq.entity.Business;
import com.twiniq.entity.BusinessDNA;
import com.twiniq.entity.TwinSnapshot;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {

    private final BusinessRepository businessRepository;
    private final BusinessDNARepository businessDNARepository;
    private final TwinSnapshotRepository twinSnapshotRepository;
    private final ScenarioRepository scenarioRepository;
    private final SimulationRepository simulationRepository;
    private final RecommendationRepository recommendationRepository;
    private final DecisionRepository decisionRepository;
    private final ActualOutcomeRepository actualOutcomeRepository;
    private final TwinEvolutionRepository twinEvolutionRepository;

    public DashboardService(BusinessRepository businessRepository,
                            BusinessDNARepository businessDNARepository,
                            TwinSnapshotRepository twinSnapshotRepository,
                            ScenarioRepository scenarioRepository,
                            SimulationRepository simulationRepository,
                            RecommendationRepository recommendationRepository,
                            DecisionRepository decisionRepository,
                            ActualOutcomeRepository actualOutcomeRepository,
                            TwinEvolutionRepository twinEvolutionRepository) {
        this.businessRepository = businessRepository;
        this.businessDNARepository = businessDNARepository;
        this.twinSnapshotRepository = twinSnapshotRepository;
        this.scenarioRepository = scenarioRepository;
        this.simulationRepository = simulationRepository;
        this.recommendationRepository = recommendationRepository;
        this.decisionRepository = decisionRepository;
        this.actualOutcomeRepository = actualOutcomeRepository;
        this.twinEvolutionRepository = twinEvolutionRepository;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getDashboardSummary(Long businessId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + businessId));

        DashboardSummaryResponse response = new DashboardSummaryResponse();
        response.setBusinessId(business.getId());
        response.setBusinessName(business.getBusinessName());
        response.setBusinessCode(business.getBusinessCode());
        response.setIndustry(business.getIndustry() != null ? business.getIndustry() : "General Enterprise");
        response.setLocation(business.getLocation() != null ? business.getLocation() : "Domestic");

        BusinessDNA dna = businessDNARepository.findByBusiness_Id(businessId).orElse(null);
        List<TwinSnapshot> snapshots = twinSnapshotRepository.findByBusiness_IdOrderBySnapshotTimeDesc(businessId);

        // Fallback default numbers if DNA is not yet initialized
        BigDecimal curRev = (dna != null && dna.getRevenue() != null) ? dna.getRevenue() : BigDecimal.valueOf(1000000);
        BigDecimal curMargin = (dna != null && dna.getProfitMargin() != null) ? dna.getProfitMargin() : BigDecimal.valueOf(15.0);
        BigDecimal curRetention = (dna != null && dna.getCustomerRetention() != null) ? dna.getCustomerRetention() : BigDecimal.valueOf(80.0);
        BigDecimal curCac = (dna != null && dna.getCustomerAcquisitionCost() != null) ? dna.getCustomerAcquisitionCost() : BigDecimal.valueOf(600.0);
        BigDecimal curEfficiency = (dna != null && dna.getOperationalEfficiency() != null) ? dna.getOperationalEfficiency() : BigDecimal.valueOf(75.0);
        BigDecimal curGrowth = (dna != null && dna.getMarketGrowth() != null) ? dna.getMarketGrowth() : BigDecimal.valueOf(12.0);
        BigDecimal curDigital = (dna != null && dna.getDigitalMaturity() != null) ? dna.getDigitalMaturity() : BigDecimal.valueOf(70.0);
        BigDecimal curStability = (dna != null && dna.getFinancialStability() != null) ? dna.getFinancialStability() : BigDecimal.valueOf(80.0);
        BigDecimal curInnovation = (dna != null && dna.getInnovationCapability() != null) ? dna.getInnovationCapability() : BigDecimal.valueOf(65.0);
        BigDecimal curRisk = (dna != null && dna.getRiskLevel() != null) ? dna.getRiskLevel() : BigDecimal.valueOf(25.0);
        BigDecimal curCompStrength = (dna != null && dna.getCompetitiveStrength() != null) ? dna.getCompetitiveStrength() : BigDecimal.valueOf(75.0);

        // Previous comparison baseline from snapshots
        TwinSnapshot prevSnap = null;
        if (!snapshots.isEmpty()) {
            if (snapshots.size() > 1 && snapshots.get(0).getRevenue() != null && curRev != null && snapshots.get(0).getRevenue().compareTo(curRev) == 0) {
                prevSnap = snapshots.get(1);
            } else {
                prevSnap = snapshots.get(0);
            }
        }

        BigDecimal prevRev = (prevSnap != null && prevSnap.getRevenue() != null) ? prevSnap.getRevenue() : curRev;
        BigDecimal prevMargin = (prevSnap != null && prevSnap.getProfitMargin() != null) ? prevSnap.getProfitMargin() : curMargin;
        BigDecimal prevRetention = (prevSnap != null && prevSnap.getCustomerRetention() != null) ? prevSnap.getCustomerRetention() : curRetention;
        BigDecimal prevCac = (prevSnap != null && prevSnap.getCustomerAcquisitionCost() != null) ? prevSnap.getCustomerAcquisitionCost() : curCac;
        BigDecimal prevRisk = (prevSnap != null && prevSnap.getRiskLevel() != null) ? prevSnap.getRiskLevel() : curRisk;

        // Derived financial metrics
        BigDecimal curExpenses = curRev.multiply(BigDecimal.ONE.subtract(curMargin.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)))
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal prevExpenses = prevRev.multiply(BigDecimal.ONE.subtract(prevMargin.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal curProfit = curRev.multiply(curMargin.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP))
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal prevProfit = prevRev.multiply(prevMargin.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal curCashFlow = curProfit.multiply(BigDecimal.valueOf(0.85)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal prevCashFlow = prevProfit.multiply(BigDecimal.valueOf(0.85)).setScale(2, RoundingMode.HALF_UP);

        // Build 8 Executive KPI Cards
        List<KpiCard> kpiCards = new ArrayList<>();
        kpiCards.add(buildKpi("REVENUE", "Total Revenue", curRev, prevRev, true, "INR"));
        kpiCards.add(buildKpi("EXPENSES", "Operating Expenses", curExpenses, prevExpenses, false, "INR"));
        kpiCards.add(buildKpi("PROFIT", "Net Operating Profit", curProfit, prevProfit, true, "INR"));
        kpiCards.add(buildKpi("MARGIN", "Net Profit Margin", curMargin, prevMargin, true, "PERCENT"));
        kpiCards.add(buildKpi("CASH_FLOW", "Operating Cash Flow", curCashFlow, prevCashFlow, true, "INR"));
        kpiCards.add(buildKpi("RETENTION", "Customer Retention", curRetention, prevRetention, true, "PERCENT"));
        kpiCards.add(buildKpi("CAC", "Customer Acquisition Cost", curCac, prevCac, false, "INR"));
        kpiCards.add(buildKpi("RISK", "Enterprise Risk Level", curRisk, prevRisk, false, "PERCENT"));
        response.setKpis(kpiCards);

        // Multi-dimensional Health Scoring
        // 1. Financial Health (0 - 100)
        double marginNorm = Math.min(100.0, Math.max(10.0, curMargin.doubleValue() * 3.5));
        double finScore = (curStability.doubleValue() * 0.60) + (marginNorm * 0.40);
        BigDecimal finHealth = BigDecimal.valueOf(finScore).setScale(1, RoundingMode.HALF_UP);
        response.setFinancialHealth(finHealth);

        // 2. Customer Health (0 - 100)
        double cacScore = Math.min(100.0, Math.max(20.0, 100.0 - (curCac.doubleValue() / 15.0)));
        double custScore = (curRetention.doubleValue() * 0.65) + (cacScore * 0.35);
        BigDecimal custHealth = BigDecimal.valueOf(custScore).setScale(1, RoundingMode.HALF_UP);
        response.setCustomerHealth(custHealth);

        // 3. Operational Health (0 - 100)
        double opScore = (curEfficiency.doubleValue() * 0.50) + (curDigital.doubleValue() * 0.25) + (curInnovation.doubleValue() * 0.25);
        BigDecimal opHealth = BigDecimal.valueOf(opScore).setScale(1, RoundingMode.HALF_UP);
        response.setOperationalHealth(opHealth);

        // 4. Market Health (0 - 100)
        double mktScore = (curGrowth.doubleValue() * 3.0 * 0.40) + (curCompStrength.doubleValue() * 0.60);
        mktScore = Math.min(100.0, Math.max(15.0, mktScore));
        BigDecimal mktHealth = BigDecimal.valueOf(mktScore).setScale(1, RoundingMode.HALF_UP);
        response.setMarketHealth(mktHealth);

        // 5. Risk Safety Buffer (0 - 100): Safety buffer = 100 - risk
        double riskBuf = Math.max(0.0, 100.0 - curRisk.doubleValue());
        BigDecimal riskSafety = BigDecimal.valueOf(riskBuf).setScale(1, RoundingMode.HALF_UP);
        response.setRiskSafetyBuffer(riskSafety);

        // Composite Overall Health Score (0 - 100)
        double compositeHealth = (finHealth.doubleValue() * 0.30)
                + (custHealth.doubleValue() * 0.20)
                + (opHealth.doubleValue() * 0.20)
                + (mktHealth.doubleValue() * 0.15)
                + (riskSafety.doubleValue() * 0.15);
        BigDecimal overallScore = BigDecimal.valueOf(compositeHealth).setScale(1, RoundingMode.HALF_UP);
        response.setOverallHealthScore(overallScore);

        if (compositeHealth >= 80.0) {
            response.setHealthGrade("EXCELLENT");
            response.setHealthSummary("Strong business fundamentals with high operational resilience, superior margins, and solid capital buffers.");
        } else if (compositeHealth >= 65.0) {
            response.setHealthGrade("HEALTHY");
            response.setHealthSummary("Stable operational and financial performance with sustainable cash flow and controllable market risk.");
        } else if (compositeHealth >= 50.0) {
            response.setHealthGrade("MODERATE");
            response.setHealthSummary("Average enterprise health. Margin compression or customer acquisition costs warrant what-if scenario testing.");
        } else {
            response.setHealthGrade("CRITICAL");
            response.setHealthSummary("Elevated enterprise risk detected. Immediate cost realignment and risk mitigation simulations recommended.");
        }

        // Pipeline Stats & Cognitive Maturity
        long snapCount = snapshots.size();
        long scenCount = scenarioRepository.findByBusiness_IdOrderByCreatedAtDesc(businessId).size();
        long simCount = simulationRepository.findByBusiness_IdOrderByCreatedAtDesc(businessId).size();
        long recCount = recommendationRepository.findByBusiness_IdOrderByCreatedAtDesc(businessId).size();
        long decCount = decisionRepository.findByBusiness_IdOrderByCreatedAtDesc(businessId).size();
        long outCount = actualOutcomeRepository.findByBusiness_IdOrderByCreatedAtDesc(businessId).size();
        long evoCount = twinEvolutionRepository.findByBusiness_IdOrderByAppliedAtDesc(businessId).size();

        double maturity = 10.0; // Base profile established
        if (dna != null) maturity += 15.0;
        if (snapCount > 0) maturity += 15.0;
        if (scenCount > 0) maturity += 15.0;
        if (simCount > 0) maturity += 15.0;
        if (recCount > 0) maturity += 10.0;
        if (decCount > 0) maturity += 10.0;
        if (evoCount > 0) maturity += 10.0;
        maturity = Math.min(100.0, maturity);

        response.setPipelineStats(new PipelineStats(snapCount, scenCount, simCount, recCount, decCount, outCount, evoCount, maturity));

        return response;
    }

    private KpiCard buildKpi(String key, String title, BigDecimal current, BigDecimal previous, boolean higherIsFavorable, String unit) {
        BigDecimal delta = BigDecimal.ZERO;
        String deltaFormatted = "0.0%";
        String trend = "STABLE";
        boolean favorable = true;

        if (previous != null && previous.compareTo(BigDecimal.ZERO) != 0 && current != null) {
            delta = current.subtract(previous)
                    .divide(previous.abs(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(1, RoundingMode.HALF_UP);

            if (delta.compareTo(BigDecimal.valueOf(0.1)) > 0) {
                trend = "UP";
                deltaFormatted = "+" + delta + "%";
                favorable = higherIsFavorable;
            } else if (delta.compareTo(BigDecimal.valueOf(-0.1)) < 0) {
                trend = "DOWN";
                deltaFormatted = delta + "%";
                favorable = !higherIsFavorable;
            } else {
                deltaFormatted = "0.0%";
                trend = "STABLE";
                favorable = true;
            }
        }

        return new KpiCard(key, title, current, previous, delta, deltaFormatted, trend, favorable, unit);
    }
}
