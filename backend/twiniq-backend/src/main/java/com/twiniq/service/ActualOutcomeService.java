package com.twiniq.service;

import com.twiniq.dto.ActualOutcomeRequest;
import com.twiniq.dto.ActualOutcomeResponse;
import com.twiniq.entity.ActualOutcome;
import com.twiniq.entity.Business;
import com.twiniq.entity.Decision;
import com.twiniq.entity.Simulation;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.repository.ActualOutcomeRepository;
import com.twiniq.repository.BusinessRepository;
import com.twiniq.repository.DecisionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActualOutcomeService {

    private final ActualOutcomeRepository actualOutcomeRepository;
    private final BusinessRepository businessRepository;
    private final DecisionRepository decisionRepository;

    public ActualOutcomeService(ActualOutcomeRepository actualOutcomeRepository,
                                BusinessRepository businessRepository,
                                DecisionRepository decisionRepository) {
        this.actualOutcomeRepository = actualOutcomeRepository;
        this.businessRepository = businessRepository;
        this.decisionRepository = decisionRepository;
    }

    @Transactional
    public ActualOutcomeResponse recordActualOutcome(Long businessId, ActualOutcomeRequest request) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + businessId));

        Decision decision = decisionRepository.findById(request.getDecisionId())
                .orElseThrow(() -> new ResourceNotFoundException("Decision not found with id: " + request.getDecisionId()));

        if (!decision.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException("Decision does not belong to business: " + businessId);
        }

        Simulation sim = decision.getSimulation();

        ActualOutcome outcome = new ActualOutcome();
        outcome.setBusiness(business);
        outcome.setDecision(decision);
        outcome.setScenario(decision.getScenario());
        outcome.setActualRevenue(request.getActualRevenue());
        outcome.setActualProfitMargin(request.getActualProfitMargin());

        outcome.setActualCustomerRetention(request.getActualCustomerRetention() != null
                ? request.getActualCustomerRetention() : (sim != null ? sim.getProjectedCustomerRetention() : null));

        outcome.setActualCustomerAcquisitionCost(request.getActualCustomerAcquisitionCost() != null
                ? request.getActualCustomerAcquisitionCost() : (sim != null ? sim.getProjectedCustomerAcquisitionCost() : null));

        outcome.setActualOperationalEfficiency(request.getActualOperationalEfficiency() != null
                ? request.getActualOperationalEfficiency() : (sim != null ? sim.getProjectedOperationalEfficiency() : null));

        outcome.setActualRiskLevel(request.getActualRiskLevel() != null
                ? request.getActualRiskLevel() : (sim != null ? sim.getProjectedRiskLevel() : null));

        outcome.setRealizedAt(request.getRealizedAt() != null ? request.getRealizedAt() : LocalDateTime.now());
        outcome.setNotes(request.getNotes());

        ActualOutcome saved = actualOutcomeRepository.save(outcome);
        return ActualOutcomeResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<ActualOutcomeResponse> getActualOutcomes(Long businessId) {
        if (!businessRepository.existsById(businessId)) {
            throw new ResourceNotFoundException("Business not found with id: " + businessId);
        }
        return actualOutcomeRepository.findByBusiness_IdOrderByCreatedAtDesc(businessId)
                .stream()
                .map(ActualOutcomeResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public ActualOutcomeResponse getActualOutcome(Long businessId, Long outcomeId) {
        ActualOutcome outcome = actualOutcomeRepository.findById(outcomeId)
                .orElseThrow(() -> new ResourceNotFoundException("Actual outcome not found with id: " + outcomeId));
        if (!outcome.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException("Actual outcome does not belong to business: " + businessId);
        }
        return ActualOutcomeResponse.fromEntity(outcome);
    }
}
