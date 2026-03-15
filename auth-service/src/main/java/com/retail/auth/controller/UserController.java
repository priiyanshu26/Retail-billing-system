//package com.retail.auth.controller;
//
//public class UserController {
//
//}
package com.retail.auth.controller;

import com.retail.auth.dto.response.ApiResponse;
import com.retail.auth.entity.User;
import com.retail.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    // GET ALL USERS
    @GetMapping
//    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse getAllUsers() {
        return new ApiResponse(true, authService.getAllUsers());
    }

    // GET USER BY ID
    @GetMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse getUserById(@PathVariable Long id) {
        return new ApiResponse(true, authService.getUserById(id));
    }

    // DELETE USER
    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse deleteUser(@PathVariable Long id) {
        authService.deleteUser(id);
        return new ApiResponse(true, "User deleted successfully");
    }
}