package com.retail.auth.service;

import java.util.List;

import com.retail.auth.dto.request.LoginRequest;
import com.retail.auth.dto.request.RegisterRequest;
import com.retail.auth.dto.response.AuthResponse;
import com.retail.auth.dto.response.UserResponseDto;
import com.retail.auth.entity.User;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    void register(RegisterRequest request);
    
    
    List<UserResponseDto> getAllUsers();

    UserResponseDto getUserById(Long id);

    void deleteUser(Long id);
}
