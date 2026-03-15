package com.retail.product_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequestDto {

    @NotBlank
    private String name;

    private String description;
}
