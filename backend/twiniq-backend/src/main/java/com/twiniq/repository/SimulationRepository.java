package com.twiniq.repository;

import com.twiniq.entity.Simulation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SimulationRepository extends JpaRepository<Simulation, Long> {

    List<Simulation> findByBusiness_IdOrderByCreatedAtDesc(Long businessId);

    List<Simulation> findByScenario_IdOrderByCreatedAtDesc(Long scenarioId);
}
