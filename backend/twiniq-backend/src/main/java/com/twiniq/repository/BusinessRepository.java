package com.twiniq.repository;

import com.twiniq.entity.Business;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BusinessRepository extends JpaRepository<Business, Long> {

    Optional<Business> findByBusinessCode(String businessCode);

    boolean existsByBusinessCode(String businessCode);
}