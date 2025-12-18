package com.retail.auth.service;

import com.retail.auth.dto.request.LoginRequest;
import com.retail.auth.dto.request.RegisterRequest;
import com.retail.auth.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    void register(RegisterRequest request);
}
