package com.twiniq;

import com.twiniq.dto.DashboardSummaryResponse;
import com.twiniq.exception.ResourceNotFoundException;
import com.twiniq.service.DashboardService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class DashboardServiceTest {

    @Autowired
    private DashboardService dashboardService;

    @Test
    void testDashboardSummary_ValidBusiness() {
        DashboardSummaryResponse summary = dashboardService.getDashboardSummary(1L);

        assertNotNull(summary, "Dashboard summary should not be null");
        assertEquals(1L, summary.getBusinessId());
        assertNotNull(summary.getOverallHealthScore(), "Overall health score should be computed");
        assertTrue(summary.getOverallHealthScore().doubleValue() >= 0 && summary.getOverallHealthScore().doubleValue() <= 100);

        assertNotNull(summary.getFinancialHealth(), "Financial health score should be present");
        assertNotNull(summary.getCustomerHealth(), "Customer health score should be present");
        assertNotNull(summary.getOperationalHealth(), "Operational health score should be present");
        assertNotNull(summary.getMarketHealth(), "Market health score should be present");
        assertNotNull(summary.getRiskSafetyBuffer(), "Risk safety buffer score should be present");

        assertNotNull(summary.getKpis(), "KPI cards list should not be null");
        assertEquals(8, summary.getKpis().size(), "There should be 8 executive KPI cards");

        assertNotNull(summary.getPipelineStats(), "Pipeline stats should be present");
        assertTrue(summary.getPipelineStats().getCognitiveTwinMaturity() >= 0);
    }

    @Test
    void testDashboardSummary_InvalidBusinessThrowsNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> {
            dashboardService.getDashboardSummary(999999L);
        });
    }
}
