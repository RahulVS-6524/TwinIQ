package com.twiniq.repository;

import com.twiniq.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    List<Recommendation> findByBusiness_IdOrderByCreatedAtDesc(Long businessId);

    Optional<Recommendation> findBySimulation_Id(Long simulationId);
}
