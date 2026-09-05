package com.twiniq.repository;

import com.twiniq.entity.Scenario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScenarioRepository extends JpaRepository<Scenario, Long> {

    List<Scenario> findByBusiness_IdOrderByCreatedAtDesc(Long businessId);
}