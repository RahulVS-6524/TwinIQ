package com.twiniq.config;

import com.twiniq.entity.Business;
import com.twiniq.entity.BusinessUser;
import com.twiniq.entity.User;
import com.twiniq.repository.BusinessRepository;
import com.twiniq.repository.BusinessUserRepository;
import com.twiniq.repository.UserRepository;
import com.twiniq.service.AuditService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final BusinessUserRepository businessUserRepository;
    private final BusinessRepository businessRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public DataInitializer(
            UserRepository userRepository,
            BusinessUserRepository businessUserRepository,
            BusinessRepository businessRepository,
            PasswordEncoder passwordEncoder,
            AuditService auditService) {
        this.userRepository = userRepository;
        this.businessUserRepository = businessUserRepository;
        this.businessRepository = businessRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    @Override
    public void run(String... args) {
        initializeUsers();
    }

    private void initializeUsers() {
        // 1. Seed Admin user if missing
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin@twiniq.com",
                    "admin",
                    passwordEncoder.encode("Admin@TwinIQ2026!"),
                    "System Administrator",
                    "ROLE_ADMIN"
            );
            userRepository.save(admin);
            log.info("Initialized default Administrator: admin@twiniq.com / admin");
            auditService.logAction("system", "SYSTEM_INIT", "User", admin.getId(), "Default Admin created", "127.0.0.1");
        }

        // 2. Seed Lead Strategist (Rahul) if missing
        User rahulUser;
        if (!userRepository.existsByUsername("rahul")) {
            rahulUser = new User(
                    "rahul@twiniq.com",
                    "rahul",
                    passwordEncoder.encode("Rahul@TwinIQ2026!"),
                    "Rahul V S",
                    "ROLE_USER"
            );
            userRepository.save(rahulUser);
            log.info("Initialized default Strategist: rahul@twiniq.com / rahul");
            auditService.logAction("system", "SYSTEM_INIT", "User", rahulUser.getId(), "Default Strategist created", "127.0.0.1");
        } else {
            rahulUser = userRepository.findByUsername("rahul").orElse(null);
        }

        // 3. Ensure Rahul is assigned to Business #1 (or first business in DB)
        if (rahulUser != null) {
            List<Business> businesses = businessRepository.findAll();
            if (!businesses.isEmpty()) {
                Long primaryBusinessId = businesses.get(0).getId();
                if (!businessUserRepository.existsByUserIdAndBusinessId(rahulUser.getId(), primaryBusinessId)) {
                    businessUserRepository.save(new BusinessUser(rahulUser.getId(), primaryBusinessId));
                    log.info("Assigned Strategist '{}' to Business #{} ({})",
                            rahulUser.getUsername(), primaryBusinessId, businesses.get(0).getBusinessName());
                }
            }
        }
    }
}
