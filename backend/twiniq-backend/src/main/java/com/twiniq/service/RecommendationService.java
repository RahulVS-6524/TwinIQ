package com.twiniq.service;

import com.twiniq.dto.RecommendationResponse;
import com.twiniq.entity.Business;
import com.twiniq.entity.Recommendation;
import com.twiniq.entity.Scenario;
import com.twiniq.entity.Simulation;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.repository.BusinessRepository;
import com.twiniq.repository.RecommendationRepository;
import com.twiniq.repository.SimulationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final SimulationRepository simulationRepository;
    private final BusinessRepository businessRepository;

    public RecommendationService(RecommendationRepository recommendationRepository,
                                 SimulationRepository simulationRepository,
                                 BusinessRepository businessRepository) {
        this.recommendationRepository = recommendationRepository;
        this.simulationRepository = simulationRepository;
        this.businessRepository = businessRepository;
    }

    @Transactional
    public RecommendationResponse generateRecommendation(Long businessId, Long simulationId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + businessId));

        Simulation simulation = simulationRepository.findById(simulationId)
                .orElseThrow(() -> new ResourceNotFoundException("Simulation not found with id: " + simulationId));

        if (!simulation.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException("Simulation does not belong to business: " + businessId);
        }

        // Return existing recommendation if already generated
        var existing = recommendationRepository.findBySimulation_Id(simulationId);
        if (existing.isPresent()) {
            return RecommendationResponse.fromEntity(existing.get());
        }

        Scenario scenario = simulation.getScenario();
        String type = scenario.getScenarioType().name();

        String recType;
        String actionStatement;
        String rationale;
        BigDecimal expectedRoi;
        String riskAssessment;
        BigDecimal confidenceScore;

        BigDecimal revImpact = simulation.getRevenueImpactPercent() != null ? simulation.getRevenueImpactPercent() : BigDecimal.ZERO;
        BigDecimal marginImpact = simulation.getProfitMarginImpactPercent() != null ? simulation.getProfitMarginImpactPercent() : BigDecimal.ZERO;
        BigDecimal riskLevel = simulation.getProjectedRiskLevel() != null ? simulation.getProjectedRiskLevel() : BigDecimal.valueOf(30);

        if ("MARKETING_CHANGE".equals(type)) {
            BigDecimal spendChange = scenario.getMarketingSpendChangePercent() != null ? scenario.getMarketingSpendChangePercent() : BigDecimal.ZERO;
            if (revImpact.compareTo(BigDecimal.ZERO) > 0 && riskLevel.compareTo(BigDecimal.valueOf(45)) <= 0) {
                recType = "PROCEED";
                actionStatement = "Increase marketing investment by " + spendChange + "% because the projected revenue improvement (" + revImpact + "%) outweighs the acquisition overhead.";
                rationale = "Customer acquisition velocity accelerates while CAC stabilizes at $" + simulation.getProjectedCustomerAcquisitionCost() + ". Revenue increases to $" + simulation.getProjectedRevenue() + " while keeping organizational risk at manageable levels (" + riskLevel + "%).";
                expectedRoi = revImpact.multiply(BigDecimal.valueOf(1.8)).setScale(2, RoundingMode.HALF_UP);
                riskAssessment = "LOW";
                confidenceScore = BigDecimal.valueOf(88.50);
            } else if (riskLevel.compareTo(BigDecimal.valueOf(50)) > 0) {
                recType = "PROCEED_WITH_CAUTION";
                actionStatement = "Scale marketing spend by only " + spendChange.divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP) + "% to manage capital risk.";
                rationale = "Rapid scaling strains operational efficiency and elevates risk to " + riskLevel + "%. A phased rollout is recommended.";
                expectedRoi = revImpact.multiply(BigDecimal.valueOf(1.1)).setScale(2, RoundingMode.HALF_UP);
                riskAssessment = "MODERATE";
                confidenceScore = BigDecimal.valueOf(80.00);
            } else {
                recType = "OPTIMIZE";
                actionStatement = "Refine channel targeting before adjusting marketing spend by " + spendChange + "%.";
                rationale = "Projected margin compression (-" + marginImpact.abs() + "%) requires optimization of acquisition funnels.";
                expectedRoi = BigDecimal.valueOf(4.50);
                riskAssessment = "MODERATE";
                confidenceScore = BigDecimal.valueOf(75.00);
            }
        } else if ("PRICE_CHANGE".equals(type)) {
            BigDecimal priceChange = scenario.getPriceChangePercent() != null ? scenario.getPriceChangePercent() : BigDecimal.ZERO;
            if (marginImpact.compareTo(BigDecimal.ZERO) >= 0 && simulation.getProjectedCustomerRetention().compareTo(BigDecimal.valueOf(75)) >= 0) {
                recType = "PROCEED";
                actionStatement = "Adopt strategic price adjustment of " + priceChange + "% to capture margin expansion.";
                rationale = "Retention remains robust at " + simulation.getProjectedCustomerRetention() + "%, unlocking a projected profit margin of " + simulation.getProjectedProfitMargin() + "%.";
                expectedRoi = marginImpact.multiply(BigDecimal.valueOf(2.2)).setScale(2, RoundingMode.HALF_UP);
                riskAssessment = "LOW";
                confidenceScore = BigDecimal.valueOf(91.00);
            } else {
                recType = "DO_NOT_PROCEED";
                actionStatement = "Hold current pricing; customer retention drop threatens customer lifetime value.";
                rationale = "Customer price sensitivity dampens demand volume and risks brand churn.";
                expectedRoi = BigDecimal.valueOf(-2.00);
                riskAssessment = "HIGH";
                confidenceScore = BigDecimal.valueOf(84.00);
            }
        } else if ("SUPPLIER_COST_CHANGE".equals(type)) {
            recType = "OPTIMIZE";
            actionStatement = "Execute strategic supplier renegotiation and hedge procurement contracts to mitigate cost inflation.";
            rationale = "Supplier cost increases directly compress margins by " + marginImpact.abs() + " pts. Diversifying supply partners restores operating margins.";
            expectedRoi = BigDecimal.valueOf(6.20);
            riskAssessment = "HIGH";
            confidenceScore = BigDecimal.valueOf(86.00);
        } else {
            recType = "PROCEED_WITH_CAUTION";
            actionStatement = "Align operational supply buffers with shifting market demand dynamics.";
            rationale = "Market intake fluctuation demands agile operational response to maintain " + simulation.getProjectedOperationalEfficiency() + "% efficiency.";
            expectedRoi = revImpact.setScale(2, RoundingMode.HALF_UP);
            riskAssessment = "MODERATE";
            confidenceScore = BigDecimal.valueOf(82.00);
        }

        Recommendation rec = new Recommendation();
        rec.setBusiness(business);
        rec.setScenario(scenario);
        rec.setSimulation(simulation);
        rec.setRecommendationType(recType);
        rec.setActionStatement(actionStatement);
        rec.setRationale(rationale);
        rec.setExpectedRoiPercent(expectedRoi);
        rec.setRiskAssessment(riskAssessment);
        rec.setConfidenceScore(confidenceScore);
        rec.setStatus("ACTIVE");

        Recommendation saved = recommendationRepository.save(rec);
        return RecommendationResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<RecommendationResponse> getRecommendations(Long businessId) {
        if (!businessRepository.existsById(businessId)) {
            throw new ResourceNotFoundException("Business not found with id: " + businessId);
        }
        return recommendationRepository.findByBusiness_IdOrderByCreatedAtDesc(businessId)
                .stream()
                .map(RecommendationResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public RecommendationResponse getBySimulationId(Long businessId, Long simulationId) {
        return recommendationRepository.findBySimulation_Id(simulationId)
                .map(RecommendationResponse::fromEntity)
                .orElseGet(() -> generateRecommendation(businessId, simulationId));
    }
}
