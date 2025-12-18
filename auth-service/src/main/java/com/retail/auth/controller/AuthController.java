package com.retail.auth.controller;

import com.retail.auth.dto.request.LoginRequest;
import com.retail.auth.dto.request.RegisterRequest;
import com.retail.auth.dto.response.ApiResponse;
import com.retail.auth.dto.response.AuthResponse;
import com.retail.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;   // ✅ FIXED

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
    }
}
