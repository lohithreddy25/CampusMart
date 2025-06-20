package com.ecommerce.project.payload;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CODOrderRequestDTO {
    @NotNull(message = "Address ID is required for placing an order")
    private Long addressId;

    // Note: Payment method is automatically set to COD
    // No need for payment gateway fields since it's Cash on Delivery
}
