// AuthService.java
package com.gamified.learning.service;

import com.gamified.learning.dto.AuthResponse;
import com.gamified.learning.dto.LoginRequest;
import com.gamified.learning.dto.RegisterRequest;
import com.gamified.learning.model.User;
import com.gamified.learning.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        
        User savedUser = userRepository.save(user);
        
        var jwtToken = jwtService.generateToken(savedUser);
        
        return new AuthResponse(jwtToken, savedUser.getUsername(), savedUser.getEmail(), 
                              savedUser.getRole(), savedUser.getTotalXP(), savedUser.getCurrentStreak());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        var jwtToken = jwtService.generateToken(user);
        
        return new AuthResponse(jwtToken, user.getUsername(), user.getEmail(), 
                              user.getRole(), user.getTotalXP(), user.getCurrentStreak());
    }
}