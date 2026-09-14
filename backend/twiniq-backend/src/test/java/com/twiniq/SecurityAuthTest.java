package com.twiniq;

import com.twiniq.dto.LoginRequest;
import com.twiniq.dto.LoginResponse;
import com.twiniq.entity.Business;
import com.twiniq.entity.BusinessUser;
import com.twiniq.entity.User;
import com.twiniq.repository.BusinessRepository;
import com.twiniq.repository.BusinessUserRepository;
import com.twiniq.repository.UserRepository;
import com.twiniq.security.BusinessSecurityService;
import com.twiniq.security.UserPrincipal;
import com.twiniq.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class SecurityAuthTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private BusinessUserRepository businessUserRepository;

    @Autowired
    private BusinessSecurityService businessSecurityService;

    @Test
    @DisplayName("Admin user can authenticate successfully and receive valid JWT")
    void testAdminLoginSuccess() {
        LoginRequest request = new LoginRequest("admin", "Admin@TwinIQ2026!");
        LoginResponse response = userService.login(request, "127.0.0.1");

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("ROLE_ADMIN", response.getRole());
        assertEquals("admin", response.getUsername());
    }

    @Test
    @DisplayName("User login fails with invalid credentials")
    void testLoginInvalidCredentials() {
        LoginRequest request = new LoginRequest("admin", "WrongPassword123!");
        assertThrows(BadCredentialsException.class, () -> {
            userService.login(request, "127.0.0.1");
        });
    }

    @Test
    @DisplayName("Admin has global access to all business tenants")
    void testAdminBusinessAccess() {
        UserPrincipal adminPrincipal = new UserPrincipal(
                1L, "admin@twiniq.com", "admin", "pwd", "Admin", "ROLE_ADMIN", true,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        Authentication adminAuth = new UsernamePasswordAuthenticationToken(adminPrincipal, null, adminPrincipal.getAuthorities());

        assertTrue(businessSecurityService.canAccessBusiness(adminAuth, 1L));
        assertTrue(businessSecurityService.canAccessBusiness(adminAuth, 999L));
    }

    @Test
    @DisplayName("Regular User is strictly isolated to assigned business tenant")
    void testUserBusinessDataIsolation() {
        User user = userRepository.findByUsername("rahul").orElseThrow();
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication userAuth = new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities());

        // Rahul is assigned to Business #1
        assertTrue(businessSecurityService.canAccessBusiness(userAuth, 1L), "User should have access to assigned business 1");

        // Rahul should NOT have access to unassigned business 99999
        assertFalse(businessSecurityService.canAccessBusiness(userAuth, 99999L), "User must be denied access to unassigned business");
    }
}
