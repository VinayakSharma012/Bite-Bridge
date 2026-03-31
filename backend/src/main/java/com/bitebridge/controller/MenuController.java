package com.bitebridge.controller;

import com.bitebridge.dto.response.ApiResponse;
import com.bitebridge.model.MenuItem;
import com.bitebridge.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/menus")
@Tag(name = "Menus", description = "Menu management endpoints")
public class MenuController {

    private static final Logger logger = Logger.getLogger(MenuController.class.getName());
    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    @Operation(summary = "Get all menu items", description = "Retrieve all menu items")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Menu items retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<MenuItem>>> getAllMenuItems() {
        logger.info("Get all menu items request");
        List<MenuItem> menuItems = menuService.getAllMenuItems();
        return ResponseEntity.ok(ApiResponse.success("Menu items retrieved successfully", menuItems, 200));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get menu item by ID", description = "Retrieve menu item details by ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Menu item found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Menu item not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<MenuItem>> getMenuItemById(@PathVariable String id) {
        logger.info("Get menu item request for id: " + id);
        MenuItem menuItem = menuService.getMenuItemById(id);
        return ResponseEntity.ok(ApiResponse.success("Menu item retrieved successfully", menuItem, 200));
    }

    @GetMapping("/restaurant/{restaurantId}")
    @Operation(summary = "Get menu items by restaurant", description = "Retrieve all menu items for a restaurant")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Menu items retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<MenuItem>>> getMenuItemsByRestaurant(@PathVariable String restaurantId) {
        logger.info("Get menu items by restaurant request for restaurantId: " + restaurantId);
        List<MenuItem> menuItems = menuService.getMenuItemsByRestaurant(restaurantId);
        return ResponseEntity.ok(ApiResponse.success("Menu items retrieved successfully", menuItems, 200));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get menu items by category", description = "Retrieve menu items by category")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Menu items retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<MenuItem>>> getMenuItemsByCategory(@PathVariable String category) {
        logger.info("Get menu items by category request for category: " + category);
        List<MenuItem> menuItems = menuService.getMenuItemsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Menu items retrieved successfully", menuItems, 200));
    }

    @PostMapping
    @Operation(summary = "Create menu item", description = "Create a new menu item")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Menu item created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<MenuItem>> createMenuItem(@RequestBody MenuItem menuItem) {
        logger.info("Create menu item request");
        MenuItem createdMenuItem = menuService.createMenuItem(menuItem);
        return ResponseEntity.ok(ApiResponse.success("Menu item created successfully", createdMenuItem, 200));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update menu item", description = "Update menu item details")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Menu item updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Menu item not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<MenuItem>> updateMenuItem(
            @PathVariable String id,
            @RequestBody MenuItem itemUpdates) {
        logger.info("Update menu item request for id: " + id);
        MenuItem updatedMenuItem = menuService.updateMenuItem(id, itemUpdates);
        return ResponseEntity.ok(ApiResponse.success("Menu item updated successfully", updatedMenuItem, 200));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete menu item", description = "Delete a menu item")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Menu item deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Menu item not found")
    })
    public ResponseEntity<Void> deleteMenuItem(@PathVariable String id) {
        logger.info("Delete menu item request for id: " + id);
        menuService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/toggle-availability")
    @Operation(summary = "Toggle menu item availability", description = "Mark menu item as available or unavailable")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Menu item status toggled successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Menu item not found")
    })
    public ResponseEntity<ApiResponse<MenuItem>> toggleMenuItemStatus(@PathVariable String id) {
        logger.info("Toggle menu item status request for id: " + id);
        MenuItem updatedMenuItem = menuService.toggleMenuItemStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Menu item availability toggled successfully", updatedMenuItem, 200));
    }

    @GetMapping("/count")
    @Operation(summary = "Get total menu item count", description = "Retrieve total number of menu items")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Menu item count retrieved successfully")
    })
    public ResponseEntity<ApiResponse<Long>> getMenuItemCount() {
        logger.info("Get menu item count request");
        long count = menuService.getMenuItemCount();
        return ResponseEntity.ok(ApiResponse.success("Menu item count retrieved successfully", count, 200));
    }
}
