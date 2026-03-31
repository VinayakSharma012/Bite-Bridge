package com.bitebridge.service;

import com.bitebridge.dto.response.UserResponse;
import com.bitebridge.exception.ResourceNotFoundException;
import com.bitebridge.model.User;
import com.bitebridge.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = Logger.getLogger(UserService.class.getName());

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse getUserById(String id) {
        logger.info("Fetching user with id: " + id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToUserResponse(user);
    }

    public UserResponse getUserByEmail(String email) {
        logger.info("Fetching user with email: " + email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return mapToUserResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        logger.info("Fetching all users");
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    public Page<UserResponse> getAllUsersPaginated(int page, int size) {
        logger.info("Fetching users with pagination - page: " + page + ", size: " + size);
        Pageable pageable = PageRequest.of(page, size);
        return userRepository.findAll(pageable)
                .map(this::mapToUserResponse);
    }

    public UserResponse updateUser(String id, User userUpdates) {
        logger.info("Updating user with id: " + id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (userUpdates.getName() != null && !userUpdates.getName().isEmpty()) {
            user.setName(userUpdates.getName());
        }
        if (userUpdates.getPhone() != null && !userUpdates.getPhone().isEmpty()) {
            user.setPhone(userUpdates.getPhone());
        }
        if (userUpdates.getProfileImageUrl() != null && !userUpdates.getProfileImageUrl().isEmpty()) {
            user.setProfileImageUrl(userUpdates.getProfileImageUrl());
        }
        if (userUpdates.getFoodPreferences() != null) {
            user.setFoodPreferences(userUpdates.getFoodPreferences());
        }
        if (userUpdates.getDietaryPreferences() != null) {
            user.setDietaryPreferences(userUpdates.getDietaryPreferences());
        }
        if (userUpdates.getAddresses() != null) {
            user.setAddresses(userUpdates.getAddresses());
        }

        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        logger.info("User updated successfully with id: " + id);
        return mapToUserResponse(updatedUser);
    }

    public void deleteUser(String id) {
        logger.info("Deleting user with id: " + id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
        logger.info("User deleted successfully with id: " + id);
    }

    public UserResponse changePassword(String id, String oldPassword, String newPassword) {
        logger.info("Changing password for user with id: " + id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        logger.info("Password changed successfully for user: " + id);
        return mapToUserResponse(updatedUser);
    }

    public UserResponse verifyUser(String id) {
        logger.info("Verifying user with id: " + id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setVerified(true);
        user.setUpdatedAt(LocalDateTime.now());
        User verifiedUser = userRepository.save(user);
        logger.info("User verified successfully with id: " + id);
        return mapToUserResponse(verifiedUser);
    }

    public UserResponse toggleUserStatus(String id) {
        logger.info("Toggling status for user with id: " + id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setActive(!user.isActive());
        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        logger.info("User status toggled successfully with id: " + id);
        return mapToUserResponse(updatedUser);
    }

    public long getUserCount() {
        return userRepository.count();
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setProfileImageUrl(user.getProfileImageUrl());
        response.setVerified(user.isVerified());
        response.setActive(user.isActive());
        response.setFoodPreferences(user.getFoodPreferences());
        response.setDietaryPreferences(user.getDietaryPreferences());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        return response;
    }
}
