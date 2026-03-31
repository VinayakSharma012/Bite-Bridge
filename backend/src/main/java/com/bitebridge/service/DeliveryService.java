package com.bitebridge.service;

import com.bitebridge.exception.ResourceNotFoundException;
import com.bitebridge.model.DeliveryAgent;
import com.bitebridge.repository.DeliveryAgentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.logging.Logger;

@Service
public class DeliveryService {
    private static final Logger logger = Logger.getLogger(DeliveryService.class.getName());
    private final DeliveryAgentRepository deliveryAgentRepository;

    public DeliveryService(DeliveryAgentRepository deliveryAgentRepository) {
        this.deliveryAgentRepository = deliveryAgentRepository;
    }

    public DeliveryAgent getDeliveryAgentById(String id) {
        logger.info("Fetching delivery agent with id: " + id);
        return deliveryAgentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery agent not found with id: " + id));
    }

    public List<DeliveryAgent> getAllDeliveryAgents() {
        logger.info("Fetching all delivery agents");
        return deliveryAgentRepository.findAll();
    }

    public List<DeliveryAgent> getAvailableDeliveryAgents() {
        logger.info("Fetching available delivery agents");
        return deliveryAgentRepository.findAll();
    }

    public List<DeliveryAgent> getDeliveryAgentsByArea(String area) {
        logger.info("Fetching delivery agents for area: " + area);
        return deliveryAgentRepository.findAll();
    }

    public DeliveryAgent createDeliveryAgent(DeliveryAgent agent) {
        logger.info("Creating new delivery agent");
        return deliveryAgentRepository.save(agent);
    }

    public DeliveryAgent updateDeliveryAgent(String id, DeliveryAgent agentUpdates) {
        logger.info("Updating delivery agent with id: " + id);
        DeliveryAgent agent = deliveryAgentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery agent not found with id: " + id));
        return deliveryAgentRepository.save(agent);
    }

    public void deleteDeliveryAgent(String id) {
        logger.info("Deleting delivery agent with id: " + id);
        if (!deliveryAgentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Delivery agent not found with id: " + id);
        }
        deliveryAgentRepository.deleteById(id);
    }

    public DeliveryAgent toggleDeliveryAgentStatus(String id) {
        logger.info("Toggling delivery agent status for id: " + id);
        DeliveryAgent agent = deliveryAgentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery agent not found with id: " + id));
        return deliveryAgentRepository.save(agent);
    }

    public DeliveryAgent setDeliveryAgentAvailability(String id, boolean available) {
        logger.info("Setting delivery agent availability for id: " + id);
        DeliveryAgent agent = deliveryAgentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery agent not found with id: " + id));
        return deliveryAgentRepository.save(agent);
    }

    public long getDeliveryAgentCount() {
        logger.info("Getting total delivery agent count");
        return deliveryAgentRepository.count();
    }

    public long getAvailableDeliveryAgentCount() {
        logger.info("Getting available delivery agent count");
        return deliveryAgentRepository.count();
    }
}
