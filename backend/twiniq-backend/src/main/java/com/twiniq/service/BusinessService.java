package com.twiniq.service;

import com.twiniq.dto.BusinessRequest;
import com.twiniq.entity.Business;
import com.twiniq.repository.BusinessRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BusinessService {

    private final BusinessRepository businessRepository;

    public BusinessService(BusinessRepository businessRepository) {
        this.businessRepository = businessRepository;
    }

    public Business createBusiness(BusinessRequest request) {

        if (businessRepository.existsByBusinessCode(request.getBusinessCode())) {
            throw new IllegalArgumentException(
                    "Business code already exists: " + request.getBusinessCode()
            );
        }

        Business business = new Business();

        business.setBusinessCode(request.getBusinessCode());
        business.setBusinessName(request.getBusinessName());
        business.setIndustry(request.getIndustry());
        business.setDescription(request.getDescription());
        business.setLocation(request.getLocation());
        business.setContactEmail(request.getContactEmail());
        business.setContactPhone(request.getContactPhone());

        return businessRepository.save(business);
    }

    public List<Business> getAllBusinesses() {
        return businessRepository.findAll();
    }

    public Optional<Business> getBusinessById(Long id) {
        return businessRepository.findById(id);
    }

    public Optional<Business> getBusinessByCode(String businessCode) {
        return businessRepository.findByBusinessCode(businessCode);
    }

    public void deleteBusiness(Long id) {

        if (!businessRepository.existsById(id)) {
            throw new IllegalArgumentException(
                    "Business not found with id: " + id
            );
        }

        businessRepository.deleteById(id);
    }
}