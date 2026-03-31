package com.bitebridge.service;

import com.bitebridge.exception.ResourceNotFoundException;
import com.bitebridge.model.MenuItem;
import com.bitebridge.repository.MenuItemRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class MenuService {
    private static final Logger logger = Logger.getLogger(MenuService.class.getName());
    private final MenuItemRepository menuItemRepository;

    public MenuService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    public MenuItem getMenuItemById(String id) {
        logger.info("Fetching menu item with id: " + id);
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
    }

    public List<MenuItem> getAllMenuItems() {
        logger.info("Fetching all menu items");
        return menuItemRepository.findAll();
    }

    public List<MenuItem> getMenuItemsByRestaurant(String restaurantId) {
        logger.info("Fetching menu items for restaurant: " + restaurantId);
        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    public List<MenuItem> getMenuItemsByCategory(String category) {
        logger.info("Fetching menu items by category: " + category);
        return menuItemRepository.findAll().stream()
                .filter(item -> item.getCategory() != null && item.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    public MenuItem createMenuItem(MenuItem menuItem) {
        logger.info("Creating new menu item");
        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(String id, MenuItem itemUpdates) {
        logger.info("Updating menu item with id: " + id);
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        if (itemUpdates.getName() != null) {
            menuItem.setName(itemUpdates.getName());
        }
        if (itemUpdates.getDescription() != null) {
            menuItem.setDescription(itemUpdates.getDescription());
        }
        if (itemUpdates.getCategory() != null) {
            menuItem.setCategory(itemUpdates.getCategory());
        }
        if (itemUpdates.getImageUrl() != null) {
            menuItem.setImageUrl(itemUpdates.getImageUrl());
        }
        if (itemUpdates.getPrice() > 0) {
            menuItem.setPrice(itemUpdates.getPrice());
        }
        if (itemUpdates.getDiscountedPrice() > 0) {
            menuItem.setDiscountedPrice(itemUpdates.getDiscountedPrice());
        }
        menuItem.setVegetarian(itemUpdates.isVegetarian());
        menuItem.setVegan(itemUpdates.isVegan());
        menuItem.setAvailable(itemUpdates.isAvailable());
        if (itemUpdates.getCustomizations() != null) {
            menuItem.setCustomizations(itemUpdates.getCustomizations());
        }

        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(String id) {
        logger.info("Deleting menu item with id: " + id);
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Menu item not found with id: " + id);
        }
        menuItemRepository.deleteById(id);
    }

    public MenuItem toggleMenuItemStatus(String id) {
        logger.info("Toggling menu item status for id: " + id);
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        menuItem.setAvailable(!menuItem.isAvailable());
        return menuItemRepository.save(menuItem);
    }

    public long getMenuItemCount() {
        logger.info("Getting total menu item count");
        return menuItemRepository.count();
    }
}
