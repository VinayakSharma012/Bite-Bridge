package com.bitebridge.service;

import com.bitebridge.exception.ResourceNotFoundException;
import com.bitebridge.model.User;
import com.bitebridge.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = Logger.getLogger(CustomUserDetailsService.class.getName());

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws ResourceNotFoundException {
        logger.fine("Loading user by email: " + email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warning("User not found with email: " + email);
                    return new ResourceNotFoundException("User not found with email: " + email);
                });

        if (!user.isActive()) {
            logger.warning("User account is inactive: " + email);
            throw new IllegalArgumentException("User account is inactive");
        }

        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole())
        );

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(authorities)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!user.isActive())
                .build();
    }
}
