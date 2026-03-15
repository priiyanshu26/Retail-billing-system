//package com.retail.auth.dto.response;
//
//public class UserResponseDto {
//
//}

package com.retail.auth.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class UserResponseDto {

    private Long id;
    private String username;
    private boolean enabled;
    private Set<String> roles;
}