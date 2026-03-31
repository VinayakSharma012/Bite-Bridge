package com.bitebridge.controller;

import com.bitebridge.dto.response.ApiResponse;
import com.bitebridge.model.DeliveryAgent;
import com.bitebridge.service.DeliveryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/deliveries")
@Tag(name = "Deliveries", description = "Delivery management endpoints")
public class DeliveryController {

    private static final Logger logger = Logger.getLogger(DeliveryController.class.getName());
    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping
    @Operation(summary = "Get all delivery agents", description = "Retrieve all delivery agents")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Delivery agents retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<DeliveryAgent>>> getAllDeliveryAgents() {
        logger.info("Get all delivery agents request");
        List<DeliveryAgent> agents = deliveryService.getAllDeliveryAgents();
        return ResponseEntity.ok(ApiResponse.success("Delivery agents retrieved successfully", agents, 200));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get delivery agent by ID", description = "Retrieve delivery agent details by ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Delivery agent found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Delivery agent not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<DeliveryAgent>> getDeliveryAgentById(@PathVariable String id) {
        logger.info("Get delivery agent request for id: " + id);
        DeliveryAgent agent = deliveryService.getDeliveryAgentById(id);
        return ResponseEntity.ok(ApiResponse.success("Delivery agent retrieved successfully", agent, 200));
    }

    @GetMapping("/available")
    @Operation(summary = "Get available delivery agents", description = "Retrieve all available delivery agents")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Available delivery agents retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<DeliveryAgent>>> getAvailableDeliveryAgents() {
        logger.info("Get available delivery agents request");
        List<DeliveryAgent> agents = deliveryService.getAvailableDeliveryAgents();
        return ResponseEntity.ok(ApiResponse.success("Available delivery agents retrieved successfully", agents, 200));
    }

    @PostMapping
    @Operation(summary = "Create delivery agent", description = "Create a new delivery agent")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Delivery agent created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<DeliveryAgent>> createDeliveryAgent(@RequestBody DeliveryAgent agent) {
        logger.info("Create delivery agent request");
        DeliveryAgent createdAgent = deliveryService.createDeliveryAgent(agent);
        return ResponseEntity.ok(ApiResponse.success("Delivery agent created successfully", createdAgent, 200));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update delivery agent", description = "Update delivery agent details")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Delivery agent updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Delivery agent not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<DeliveryAgent>> updateDeliveryAgent(
            @PathVariable String id,
            @RequestBody DeliveryAgent agentUpdates) {
        logger.info("Update delivery agent request for id: " + id);
        DeliveryAgent updatedAgent = deliveryService.updateDeliveryAgent(id, agentUpdates);
        return ResponseEntity.ok(ApiResponse.success("Delivery agent updated successfully", updatedAgent, 200));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete delivery agent", description = "Delete a delivery agent")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Delivery agent deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Delivery agent not found")
    })
    public ResponseEntity<Void> deleteDeliveryAgent(@PathVariable String id) {
        logger.info("Delete delivery agent request for id: " + id);
        deliveryService.deleteDeliveryAgent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle delivery agent status", description = "Enable or disable a delivery agent")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Delivery agent status toggled successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Delivery agent not found")
    })
    public ResponseEntity<ApiResponse<DeliveryAgent>> toggleDeliveryAgentStatus(@PathVariable String id) {
        logger.info("Toggle delivery agent status request for id: " + id);
        DeliveryAgent updatedAgent = deliveryService.toggleDeliveryAgentStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Delivery agent status toggled successfully", updatedAgent, 200));
    }

    @PostMapping("/{id}/set-availability")
    @Operation(summary = "Set delivery agent availability", description = "Mark delivery agent as available or unavailable")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Delivery agent availability updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Delivery agent not found")
    })
    public ResponseEntity<ApiResponse<DeliveryAgent>> setDeliveryAgentAvailability(
            @PathVariable String id,
            @RequestParam boolean available) {
        logger.info("Set delivery agent availability request for id: " + id + " to: " + available);
        DeliveryAgent updatedAgent = deliveryService.setDeliveryAgentAvailability(id, available);
        return ResponseEntity.ok(ApiResponse.success("Delivery agent availability updated successfully", updatedAgent, 200));
    }

    @GetMapping("/count")
    @Operation(summary = "Get total delivery agent count", description = "Retrieve total number of delivery agents")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Delivery agent count retrieved successfully")
    })
    public ResponseEntity<ApiResponse<Long>> getDeliveryAgentCount() {
        logger.info("Get delivery agent count request");
        long count = deliveryService.getDeliveryAgentCount();
        return ResponseEntity.ok(ApiResponse.success("Delivery agent count retrieved successfully", count, 200));
    }

    @GetMapping("/available/count")
    @Operation(summary = "Get available delivery agent count", description = "Retrieve total number of available delivery agents")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Available delivery agent count retrieved successfully")
    })
    public ResponseEntity<ApiResponse<Long>> getAvailableDeliveryAgentCount() {
        logger.info("Get available delivery agent count request");
        long count = deliveryService.getAvailableDeliveryAgentCount();
        return ResponseEntity.ok(ApiResponse.success("Available delivery agent count retrieved successfully", count, 200));
    }
}
