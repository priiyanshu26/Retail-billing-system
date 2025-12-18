package com.retail.auth.util;

public final class AppContants {

    private AppContants() {
        
    }
    // SECURITY CONSTANTS
    public static final String AUTH_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";

   
    // ROLE CONSTANTS
    public static final String ROLE_USER = "ROLE_USER";
    public static final String ROLE_ADMIN = "ROLE_ADMIN";

  
    // JWT CONSTANTS
    public static final long JWT_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 1 day


    // API MESSAGES
    public static final String USER_REGISTERED = "User registered successfully";
    public static final String USER_ALREADY_EXISTS = "Username already exists";
    public static final String INVALID_CREDENTIALS = "Invalid username or password";
}
