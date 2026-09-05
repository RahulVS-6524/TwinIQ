package com.twiniq.service;

import com.twiniq.dto.DecisionRequest;
import com.twiniq.dto.DecisionResponse;
import com.twiniq.entity.*;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DecisionService {

    private final DecisionRepository decisionRepository;
    private final BusinessRepository businessRepository;
    private final ScenarioRepository scenarioRepository;
    private final SimulationRepository simulationRepository;
    private final RecommendationRepository recommendationRepository;

    public DecisionService(DecisionRepository decisionRepository,
                           BusinessRepository businessRepository,
                           ScenarioRepository scenarioRepository,
                           SimulationRepository simulationRepository,
                           RecommendationRepository recommendationRepository) {
        this.decisionRepository = decisionRepository;
        this.businessRepository = businessRepository;
        this.scenarioRepository = scenarioRepository;
        this.simulationRepository = simulationRepository;
        this.recommendationRepository = recommendationRepository;
    }

    @Transactional
    public DecisionResponse recordDecision(Long businessId, DecisionRequest request) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new ResourceNotFoundException("Business not found with id: " + businessId));

        Scenario scenario = scenarioRepository.findById(request.getScenarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Scenario not found with id: " + request.getScenarioId()));

        Simulation simulation = simulationRepository.findById(request.getSimulationId())
                .orElseThrow(() -> new ResourceNotFoundException("Simulation not found with id: " + request.getSimulationId()));

        if (!scenario.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException("Scenario " + request.getScenarioId() + " does not belong to business " + businessId);
        }

        if (!simulation.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException("Simulation " + request.getSimulationId() + " does not belong to business " + businessId);
        }

        if (!simulation.getScenario().getId().equals(scenario.getId())) {
            throw new ResourceNotFoundException("Simulation " + request.getSimulationId() + " does not belong to scenario " + request.getScenarioId());
        }

        Recommendation recommendation = null;
        if (request.getRecommendationId() != null) {
            recommendation = recommendationRepository.findById(request.getRecommendationId()).orElse(null);
            if (recommendation != null && !recommendation.getBusiness().getId().equals(businessId)) {
                throw new ResourceNotFoundException("Recommendation " + request.getRecommendationId() + " does not belong to business " + businessId);
            }
        } else {
            recommendation = recommendationRepository.findBySimulation_Id(simulation.getId()).orElse(null);
        }

        Decision decision = new Decision();
        decision.setBusiness(business);
        decision.setScenario(scenario);
        decision.setSimulation(simulation);
        decision.setRecommendation(recommendation);
        decision.setDecisionStatus(request.getDecisionStatus().toUpperCase());
        decision.setDecisionMaker(request.getDecisionMaker() != null ? request.getDecisionMaker() : "Strategic Executive");
        decision.setNotes(request.getNotes());
        decision.setImplementedAt(LocalDateTime.now());

        if (recommendation != null) {
            recommendation.setStatus(request.getDecisionStatus().toUpperCase());
            recommendationRepository.save(recommendation);
        }

        Decision saved = decisionRepository.save(decision);
        return DecisionResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<DecisionResponse> getDecisions(Long businessId) {
        if (!businessRepository.existsById(businessId)) {
            throw new ResourceNotFoundException("Business not found with id: " + businessId);
        }
        return decisionRepository.findByBusiness_IdOrderByCreatedAtDesc(businessId)
                .stream()
                .map(DecisionResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public DecisionResponse getDecision(Long businessId, Long decisionId) {
        Decision decision = decisionRepository.findById(decisionId)
                .orElseThrow(() -> new ResourceNotFoundException("Decision not found with id: " + decisionId));
        if (!decision.getBusiness().getId().equals(businessId)) {
            throw new ResourceNotFoundException("Decision does not belong to business: " + businessId);
        }
        return DecisionResponse.fromEntity(decision);
    }
}
