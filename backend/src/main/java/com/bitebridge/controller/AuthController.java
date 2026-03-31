package com.bitebridge.controller;

import com.bitebridge.dto.request.LoginRequest;
import com.bitebridge.dto.request.RegisterRequest;
import com.bitebridge.dto.response.ApiResponse;
import com.bitebridge.dto.response.AuthResponse;
import com.bitebridge.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication endpoints for user login and registration")
public class AuthController {

    private static final Logger logger = Logger.getLogger(AuthController.class.getName());

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Create a new user account and return authentication tokens")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "User registered successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input or email already registered"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        logger.info("Register request received for email: " + registerRequest.getEmail());
        AuthResponse authResponse = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("User registered successfully", authResponse, 201));
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT tokens")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login successful",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid email or password"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        logger.info("Login request received for email: " + loginRequest.getEmail());
        AuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse, 200));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Generate a new access token using a valid refresh token")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Token refreshed successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid refresh token"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @RequestHeader("Authorization") String authHeader) {
        logger.info("Refresh token request received");
        String refreshToken = authHeader.replace("Bearer ", "");
        AuthResponse authResponse = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", authResponse, 200));
    }

    @GetMapping("/validate")
    @Operation(summary = "Validate JWT token", description = "Check if a JWT token is valid")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Token is valid"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Token is invalid or expired"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ApiResponse<String>> validateToken(
            @RequestHeader("Authorization") String authHeader) {
        logger.info("Token validation request received");
        String token = authHeader.replace("Bearer ", "");
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(ApiResponse.success(isValid ? "Token is valid" : "Token is invalid", "valid", 200));
    }
}
