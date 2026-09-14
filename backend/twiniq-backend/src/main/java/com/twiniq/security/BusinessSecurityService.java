package com.twiniq.security;

import com.twiniq.repository.BusinessRepository;
import com.twiniq.repository.BusinessUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service("businessSecurityService")
public class BusinessSecurityService {

    private static final Logger log = LoggerFactory.getLogger(BusinessSecurityService.class);

    private final BusinessUserRepository businessUserRepository;
    private final BusinessRepository businessRepository;

    public BusinessSecurityService(BusinessUserRepository businessUserRepository, BusinessRepository businessRepository) {
        this.businessUserRepository = businessUserRepository;
        this.businessRepository = businessRepository;
    }

    public boolean canAccessBusiness(Authentication authentication, Long businessId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        if (isAdmin(authentication)) {
            return true;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserPrincipal userPrincipal) {
            boolean hasAccess = businessUserRepository.existsByUserIdAndBusinessId(userPrincipal.getId(), businessId);
            if (!hasAccess) {
                log.warn("Access denied: User '{}' (ID {}) attempted to access unauthorized Business ID {}",
                        userPrincipal.getUsername(), userPrincipal.getId(), businessId);
            }
            return hasAccess;
        }

        return false;
    }

    public boolean isAdmin(Authentication authentication) {
        if (authentication == null) {
            return false;
        }
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if ("ROLE_ADMIN".equals(authority.getAuthority())) {
                return true;
            }
        }
        return false;
    }

    public List<Long> getAccessibleBusinessIds(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return Collections.emptyList();
        }

        if (isAdmin(authentication)) {
            return businessRepository.findAll().stream()
                    .map(b -> b.getId())
                    .collect(Collectors.toList());
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserPrincipal userPrincipal) {
            return businessUserRepository.findByUserId(userPrincipal.getId()).stream()
                    .map(bu -> bu.getBusinessId())
                    .collect(Collectors.toList());
        }

        return Collections.emptyList();
    }
}
