package com.ecommerce.project.service;

import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.payload.ProductResponse;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    ProductDTO addProduct(Long categoryId, ProductDTO product, Authentication auth);

    ProductDTO addProductWithImage(Long categoryId, ProductDTO product, MultipartFile image, Authentication auth) throws IOException;

    ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String keyword, String category);

    ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductResponse searchProductByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    ProductDTO updateProduct(Long productId,
                             ProductDTO productDTO);



    // ProductService.java
    ProductDTO deleteProduct(Long productId);

    ProductDTO updateProductImage(Long productId,
                                  MultipartFile image) throws IOException;

    // Get user's products with pagination (by email - for current user)
    ProductResponse getUserProducts(String email, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    // Get user's products without pagination (by email - for current user)
    List<ProductDTO> getUserProductsList(String email);

    // Get count of user's products (by email - for current user)
    Long getUserProductsCount(String email);

    // Get products by user ID with pagination (for admin or specific user access)
    ProductResponse getProductsByUserId(Long userId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    // Get products by user ID without pagination (for admin or specific user access)
    List<ProductDTO> getProductsListByUserId(Long userId);

    // Get count of products by user ID (for admin or specific user access)
    Long getProductsCountByUserId(Long userId);

}
