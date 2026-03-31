package com.bitebridge.controller;

import com.bitebridge.dto.response.ApiResponse;
import com.bitebridge.dto.response.UserResponse;
import com.bitebridge.model.User;
import com.bitebridge.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.logging.Logger;

@RestController
@RequestMapping("/users")
@Tag(name = "Users", description = "User management endpoints")
public class UserController {

    private static final Logger logger = Logger.getLogger(UserController.class.getName());

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieve user details by user ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User found",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        logger.info("Get user request for id: " + id);
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user, 200));
    }

    @GetMapping("/email/{email}")
    @Operation(summary = "Get user by email", description = "Retrieve user details by email address")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<ApiResponse<UserResponse>> getUserByEmail(@PathVariable String email) {
        logger.info("Get user request for email: " + email);
        UserResponse user = userService.getUserByEmail(email);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user, 200));
    }

    @GetMapping
    @Operation(summary = "Get all users", description = "Retrieve all users with optional pagination")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Users retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "false") boolean paginated,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        logger.info("Get all users request - paginated: " + paginated);

        if (paginated) {
            Page<UserResponse> users = userService.getAllUsersPaginated(page, size);
            return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users.getContent(), 200));
        } else {
            List<UserResponse> users = userService.getAllUsers();
            return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users, 200));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user", description = "Update user profile information")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(@PathVariable String id, @RequestBody User userUpdates) {
        logger.info("Update user request for id: " + id);
        UserResponse updatedUser = userService.updateUser(id, userUpdates);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updatedUser, 200));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user", description = "Delete a user account")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "User deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        logger.info("Delete user request for id: " + id);
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/change-password")
    @Operation(summary = "Change user password", description = "Change password for a user account")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Password changed successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid old password or user not found")
    })
    public ResponseEntity<ApiResponse<UserResponse>> changePassword(
            @PathVariable String id,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {
        logger.info("Change password request for user id: " + id);
        UserResponse updatedUser = userService.changePassword(id, oldPassword, newPassword);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", updatedUser, 200));
    }

    @PostMapping("/{id}/verify")
    @Operation(summary = "Verify user email", description = "Mark user as verified")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User verified successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<ApiResponse<UserResponse>> verifyUser(@PathVariable String id) {
        logger.info("Verify user request for id: " + id);
        UserResponse verifiedUser = userService.verifyUser(id);
        return ResponseEntity.ok(ApiResponse.success("User verified successfully", verifiedUser, 200));
    }

    @PostMapping("/{id}/toggle-status")
    @Operation(summary = "Toggle user status", description = "Enable or disable a user account")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User status toggled successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserStatus(@PathVariable String id) {
        logger.info("Toggle user status request for id: " + id);
        UserResponse updatedUser = userService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User status toggled successfully", updatedUser, 200));
    }

    @GetMapping("/count")
    @Operation(summary = "Get total user count", description = "Retrieve total number of registered users")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "User count retrieved successfully")
    })
    public ResponseEntity<ApiResponse<Long>> getUserCount() {
        logger.info("Get user count request");
        long count = userService.getUserCount();
        return ResponseEntity.ok(ApiResponse.success("User count retrieved successfully", count, 200));
    }
}
