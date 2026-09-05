package com.twiniq.service;

import com.twiniq.dto.BusinessDNARequest;
import com.twiniq.dto.TwinEvolutionResponse;
import com.twiniq.entity.*;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TwinEvolutionService {

    private final TwinEvolutionRepository twinEvolutionRepository;
    private final ActualOutcomeRepository actualOutcomeRepository;
    private final BusinessRepository businessRepository;
    private final BusinessDNAService businessDNAService;
    private final TwinSnapshotService twinSnapshotService;

    public TwinEvolutionService(TwinEvolutionRepository twinEvolutionRepository,
                               ActualOutcomeRepository actualOutcomeRepository,
                               BusinessRepository businessRepository,
                               BusinessDNAService businessDNAService,
                               TwinSnapshotService twinSnapshotService) {
        this.twinEvolutionRepository = twinEvolutionRepository;
        this.actualOutcomeRepository = actualOutcomeRepository;
        this.businessRepository = businessRepository;
        this.businessDNAService = businessDNAService;
        this.twinSnapshotService = twinSnapshotService;
    }

    @Transactional
    public TwinEvolutionResponse evaluateAndEvolve(Long businessId, Long actualOutcomeId) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + businessId));

        ActualOutcome outcome = actualOutcomeRepository.findById(actualOutcomeId)
                .orElseThrow(() -> new ResourceNotFoundException("Actual outcome not found with id: " + actualOutcomeId));

        if (!outcome.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException("Actual outcome does not belong to business: " + businessId);
        }

        var existing = twinEvolutionRepository.findByActualOutcome_Id(actualOutcomeId);
        if (existing.isPresent()) {
            return TwinEvolutionResponse.fromEntity(existing.get());
        }

        Decision decision = outcome.getDecision();
        Simulation sim = decision.getSimulation();

        BigDecimal projRev = sim.getProjectedRevenue();
        BigDecimal actRev = outcome.getActualRevenue();
        BigDecimal revVariance = BigDecimal.ZERO;
        if (projRev != null && projRev.compareTo(BigDecimal.ZERO) > 0) {
            revVariance = actRev.subtract(projRev)
                    .divide(projRev, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal projMargin = sim.getProjectedProfitMargin();
        BigDecimal actMargin = outcome.getActualProfitMargin();
        BigDecimal marginVariance = actMargin.subtract(projMargin != null ? projMargin : BigDecimal.ZERO)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal projCac = sim.getProjectedCustomerAcquisitionCost();
        BigDecimal actCac = outcome.getActualCustomerAcquisitionCost();
        BigDecimal cacVariance = BigDecimal.ZERO;
        if (projCac != null && projCac.compareTo(BigDecimal.ZERO) > 0 && actCac != null) {
            cacVariance = actCac.subtract(projCac)
                    .divide(projCac, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        double revErr = Math.abs(revVariance.doubleValue());
        double marginErr = Math.abs(marginVariance.doubleValue());
        double overallAcc = Math.max(50.0, 100.0 - ((revErr * 0.6) + (marginErr * 2.0)));
        BigDecimal overallAccuracy = BigDecimal.valueOf(overallAcc).setScale(2, RoundingMode.HALF_UP);

        String insight = "Empirical validation loop complete. Actual revenue ($" + actRev + ") compared with projected ($"
                + projRev + ") shows a " + (revVariance.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "") + revVariance
                + "% variance. Model accuracy verified at " + overallAccuracy + "%. Parameter elasticity updated.";

        String calibration = "Live Business DNA updated with empirical outcome metrics (Revenue: $" + actRev
                + ", Profit Margin: " + actMargin + "%). New cognitive Twin Snapshot recorded.";

        // Evolve live Business DNA
        var currentDna = businessDNAService.getDNA(businessId);
        BusinessDNARequest dnaUpdate = new BusinessDNARequest();
        dnaUpdate.setRevenue(actRev);
        dnaUpdate.setProfitMargin(actMargin);
        dnaUpdate.setCustomerRetention(outcome.getActualCustomerRetention() != null ? outcome.getActualCustomerRetention() : currentDna.getCustomerRetention());
        dnaUpdate.setCustomerAcquisitionCost(outcome.getActualCustomerAcquisitionCost() != null ? outcome.getActualCustomerAcquisitionCost() : currentDna.getCustomerAcquisitionCost());
        dnaUpdate.setOperationalEfficiency(outcome.getActualOperationalEfficiency() != null ? outcome.getActualOperationalEfficiency() : currentDna.getOperationalEfficiency());
        dnaUpdate.setMarketGrowth(currentDna.getMarketGrowth());
        dnaUpdate.setDigitalMaturity(currentDna.getDigitalMaturity());
        dnaUpdate.setFinancialStability(currentDna.getFinancialStability());
        dnaUpdate.setInnovationCapability(currentDna.getInnovationCapability());
        dnaUpdate.setRiskLevel(outcome.getActualRiskLevel() != null ? outcome.getActualRiskLevel() : currentDna.getRiskLevel());
        dnaUpdate.setCompetitiveStrength(currentDna.getCompetitiveStrength());

        businessDNAService.updateDNA(businessId, dnaUpdate);

        // Take evolved twin snapshot
        twinSnapshotService.createSnapshot(businessId);

        TwinEvolution evo = new TwinEvolution();
        evo.setBusiness(business);
        evo.setDecision(decision);
        evo.setSimulation(sim);
        evo.setActualOutcome(outcome);
        evo.setRevenueVariancePercent(revVariance);
        evo.setProfitMarginVariancePoints(marginVariance);
        evo.setCacVariancePercent(cacVariance);
        evo.setOverallAccuracyPercent(overallAccuracy);
        evo.setEvolutionInsight(insight);
        evo.setCalibrationAction(calibration);
        evo.setAppliedAt(LocalDateTime.now());

        TwinEvolution saved = twinEvolutionRepository.save(evo);
        return TwinEvolutionResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<TwinEvolutionResponse> getEvolutions(Long businessId) {
        if (!businessRepository.existsById(businessId)) {
            throw new ResourceNotFoundException("Business not found with id: " + businessId);
        }
        return twinEvolutionRepository.findByBusiness_IdOrderByAppliedAtDesc(businessId)
                .stream()
                .map(TwinEvolutionResponse::fromEntity)
                .toList();
    }
}
