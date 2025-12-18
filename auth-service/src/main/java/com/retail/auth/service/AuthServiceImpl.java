package com.retail.auth.service;

import com.retail.auth.dto.request.LoginRequest;
import com.retail.auth.dto.request.RegisterRequest;
import com.retail.auth.dto.response.AuthResponse;
import com.retail.auth.entity.Role;
import com.retail.auth.entity.User;
import com.retail.auth.exception.AuthException;
import com.retail.auth.repository.RoleRepository;
import com.retail.auth.repository.UserRepository;
import com.retail.auth.util.AppContants;
import com.retail.auth.config.JwtUtil;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AuthException("User not found"));

        String token = jwtUtil.generateToken(user.getUsername());
        return new AuthResponse(token);
    }

    @Override
    public void register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AuthException(AppContants.USER_ALREADY_EXISTS);
        }

        Role role;
        Role userRole = roleRepository.findByName(AppContants.ROLE_USER)
                .orElseThrow(() -> new AuthException("ROLE_USER not found"));
        
        if ("admin".equalsIgnoreCase(request.getUsername())) {
            role = roleRepository.findByName(AppContants.ROLE_ADMIN)
                    .orElseThrow(() -> new AuthException("ROLE_ADMIN not found"));
        } else {
            role = roleRepository.findByName(AppContants.ROLE_USER)
                    .orElseThrow(() -> new AuthException("ROLE_USER not found"));
        }
        
        

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .roles(Set.of(userRole))
                .build();


        userRepository.save(user);
    }
}
