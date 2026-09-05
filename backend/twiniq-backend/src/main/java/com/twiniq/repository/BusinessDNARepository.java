package com.twiniq.repository;

import com.twiniq.entity.BusinessDNA;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BusinessDNARepository extends JpaRepository<BusinessDNA, Long> {

    Optional<BusinessDNA> findByBusiness_Id(Long businessId);

    boolean existsByBusiness_Id(Long businessId);
}
