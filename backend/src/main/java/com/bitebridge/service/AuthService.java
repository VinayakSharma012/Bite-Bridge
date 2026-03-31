package com.bitebridge.service;

import com.bitebridge.dto.request.LoginRequest;
import com.bitebridge.dto.request.RegisterRequest;
import com.bitebridge.dto.response.AuthResponse;
import com.bitebridge.dto.response.UserResponse;
import com.bitebridge.model.User;
import com.bitebridge.repository.UserRepository;
import com.bitebridge.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.logging.Logger;

@Service
public class AuthService {

    private static final Logger logger = Logger.getLogger(AuthService.class.getName());

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                      JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        logger.info("Registering new user with email: " + registerRequest.getEmail());

        // Check if user already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            logger.warning("User already exists with email: " + registerRequest.getEmail());
            throw new IllegalArgumentException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole() != null ? registerRequest.getRole() : "CUSTOMER");
        user.setActive(true);
        user.setVerified(false);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        logger.info("User registered successfully with email: " + savedUser.getEmail());

        // Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());

        // Create UserResponse
        UserResponse userResponse = new UserResponse();
        userResponse.setId(savedUser.getId());
        userResponse.setName(savedUser.getName());
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setPhone(savedUser.getPhone());
        userResponse.setRole(savedUser.getRole());
        userResponse.setProfileImageUrl(savedUser.getProfileImageUrl());
        userResponse.setVerified(savedUser.isVerified());
        userResponse.setActive(savedUser.isActive());

        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setTokenType("Bearer");
        response.setExpiresIn(jwtTokenProvider.getExpirationTime());
        response.setUser(userResponse);
        return response;
    }

    public AuthResponse login(LoginRequest loginRequest) {
        logger.info("Authenticating user with email: " + loginRequest.getEmail());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = jwtTokenProvider.generateAccessToken(loginRequest.getEmail());
            String refreshToken = jwtTokenProvider.generateRefreshToken(loginRequest.getEmail());

            // Fetch user details
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Create UserResponse
            UserResponse userResponse = new UserResponse();
            userResponse.setId(user.getId());
            userResponse.setName(user.getName());
            userResponse.setEmail(user.getEmail());
            userResponse.setPhone(user.getPhone());
            userResponse.setRole(user.getRole());
            userResponse.setProfileImageUrl(user.getProfileImageUrl());
            userResponse.setVerified(user.isVerified());
            userResponse.setActive(user.isActive());

            logger.info("User authenticated successfully: " + loginRequest.getEmail());

            AuthResponse response = new AuthResponse();
            response.setAccessToken(accessToken);
            response.setRefreshToken(refreshToken);
            response.setTokenType("Bearer");
            response.setExpiresIn(jwtTokenProvider.getExpirationTime());
            response.setUser(userResponse);
            return response;

        } catch (Exception e) {
            logger.severe("Authentication failed for user: " + loginRequest.getEmail());
            throw new IllegalArgumentException("Invalid email or password");
        }
    }

    public AuthResponse refreshToken(String refreshToken) {
        logger.info("Refreshing token");

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);

        String newAccessToken = jwtTokenProvider.generateAccessToken(email);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(email);

        // Fetch user details
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Create UserResponse
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setName(user.getName());
        userResponse.setEmail(user.getEmail());
        userResponse.setPhone(user.getPhone());
        userResponse.setRole(user.getRole());
        userResponse.setProfileImageUrl(user.getProfileImageUrl());
        userResponse.setVerified(user.isVerified());
        userResponse.setActive(user.isActive());

        AuthResponse response = new AuthResponse();
        response.setAccessToken(newAccessToken);
        response.setRefreshToken(newRefreshToken);
        response.setTokenType("Bearer");
        response.setExpiresIn(jwtTokenProvider.getExpirationTime());
        response.setUser(userResponse);
        return response;
    }

    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }

    public String getEmailFromToken(String token) {
        return jwtTokenProvider.getEmailFromToken(token);
    }
}
