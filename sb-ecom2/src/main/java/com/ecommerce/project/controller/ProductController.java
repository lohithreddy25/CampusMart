package com.ecommerce.project.controller;

import com.ecommerce.project.config.AppConstants;
import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.payload.ProductResponse;
import com.ecommerce.project.service.ProductService;
import com.ecommerce.project.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    ProductService productService;

    @Autowired
    private AuthUtil authUtil;

    @PostMapping("/user/categories/{categoryId}/product")
    public ResponseEntity<ProductDTO> addProduct(@Valid @RequestBody ProductDTO productDTO,
                                                 @PathVariable Long categoryId,
                                                 Authentication auth){
        try {
            // Log the incoming request for debugging
            System.out.println("Creating product for category: " + categoryId);
            System.out.println("Product data: " + productDTO.getProductName());
            System.out.println("User: " + (auth != null ? auth.getName() : "null"));

            ProductDTO savedProductDTO = productService.addProduct(categoryId, productDTO, auth);
            return new ResponseEntity<>(savedProductDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error in ProductController.addProduct: " + e.getMessage());
            e.printStackTrace();
            throw e; // Let the global exception handler deal with it
        }
    }

    @PostMapping(value = "/user/categories/{categoryId}/product/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductDTO> addProductWithImage(
            @RequestParam("productName") String productName,
            @RequestParam("description") String description,
            @RequestParam("quantity") Integer quantity,
            @RequestParam("price") Double price,
            @RequestParam(value = "discount", defaultValue = "0") Double discount,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @PathVariable Long categoryId,
            Authentication auth) throws IOException {
        try {
            // Log the incoming request for debugging
            System.out.println("Creating product with image for category: " + categoryId);
            System.out.println("Product data: " + productName);
            System.out.println("User: " + (auth != null ? auth.getName() : "null"));

            // Create ProductDTO from form parameters
            ProductDTO productDTO = new ProductDTO();
            productDTO.setProductName(productName);
            productDTO.setDescription(description);
            productDTO.setQuantity(quantity);
            productDTO.setPrice(price);
            productDTO.setDiscount(discount);

            ProductDTO savedProductDTO = productService.addProductWithImage(categoryId, productDTO, image, auth);
            return new ResponseEntity<>(savedProductDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error in ProductController.addProductWithImage: " + e.getMessage());
            e.printStackTrace();
            throw e; // Let the global exception handler deal with it
        }
    }

    @PostMapping("/admin/categories/{categoryId}/product")
    public ResponseEntity<ProductDTO> addProductAdmin(@Valid @RequestBody ProductDTO productDTO,
                                                      @PathVariable Long categoryId,
                                                      Authentication auth){
        try {
            // Log the incoming request for debugging
            System.out.println("Admin creating product for category: " + categoryId);
            System.out.println("Product data: " + productDTO.getProductName());
            System.out.println("Admin user: " + (auth != null ? auth.getName() : "null"));

            ProductDTO savedProductDTO = productService.addProduct(categoryId, productDTO, auth);
            return new ResponseEntity<>(savedProductDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error in ProductController.addProductAdmin: " + e.getMessage());
            e.printStackTrace();
            throw e; // Let the global exception handler deal with it
        }
    }

    // Test endpoint to verify authentication and basic functionality
    @GetMapping("/user/test")
    public ResponseEntity<String> testEndpoint(Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authentication");
        }
        return ResponseEntity.ok("Authenticated as: " + auth.getName());
    }

    @GetMapping("/public/products")
    public ResponseEntity<ProductResponse> getAllProducts(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder
    ){
        ProductResponse productResponse = productService.getAllProducts(pageNumber, pageSize, sortBy, sortOrder, keyword, category);
        return new ResponseEntity<>(productResponse,HttpStatus.OK);
    }

    @GetMapping("/public/categories/{categoryId}/products")
    public ResponseEntity<ProductResponse> getProductsByCategory(@PathVariable Long categoryId,
                                                                 @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
                                                                 @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
                                                                 @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
                                                                 @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){
        ProductResponse productResponse = productService.searchByCategory(categoryId, pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }

    @GetMapping("/public/products/keyword/{keyword}")
    public ResponseEntity<ProductResponse> getProductsByKeyword(@PathVariable String keyword,
                                                                @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
                                                                @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
                                                                @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
                                                                @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder){
        ProductResponse productResponse = productService.searchProductByKeyword(keyword, pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(productResponse, HttpStatus.FOUND);
    }

    @PutMapping("/user/products/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(@Valid @RequestBody ProductDTO productDTO,
                                                    @PathVariable Long productId){
        try {
            System.out.println("User updating product: " + productId);

            ProductDTO updatedProductDTO = productService.updateProduct(productId, productDTO);
            return new ResponseEntity<>(updatedProductDTO, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error in ProductController.updateProduct: " + e.getMessage());
            throw e;
        }
    }

    @PutMapping("/admin/products/{productId}")
    public ResponseEntity<ProductDTO> updateProductAdmin(@Valid @RequestBody ProductDTO productDTO,
                                                         @PathVariable Long productId){
        try {
            System.out.println("Admin updating product: " + productId);

            // Use the same service method - authorization is handled in service layer
            ProductDTO updatedProductDTO = productService.updateProduct(productId, productDTO);
            return new ResponseEntity<>(updatedProductDTO, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error in ProductController.updateProductAdmin: " + e.getMessage());
            throw e;
        }
    }

    // ProductController.java
    @DeleteMapping("/user/products/{productId}")
    public ResponseEntity<ProductDTO> deleteProduct(@PathVariable Long productId) {
        try {
            System.out.println("User deleting product: " + productId);

            ProductDTO dto = productService.deleteProduct(productId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            System.err.println("Error in ProductController.deleteProduct: " + e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/admin/products/{productId}")
    public ResponseEntity<ProductDTO> deleteProductAdmin(@PathVariable Long productId) {
        try {
            System.out.println("Admin deleting product: " + productId);

            // Use the same service method - authorization is handled in service layer
            ProductDTO dto = productService.deleteProduct(productId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            System.err.println("Error in ProductController.deleteProductAdmin: " + e.getMessage());
            throw e;
        }
    }

    @PutMapping("/user/products/{productId}/image")
    public ResponseEntity<ProductDTO> updateProductImage(@PathVariable Long productId,
                                                         @RequestParam("image") MultipartFile image) throws IOException {
        try {
            System.out.println("User updating product image: " + productId);

            ProductDTO updatedProduct = productService.updateProductImage(productId, image);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            System.err.println("Error in ProductController.updateProductImage: " + e.getMessage());
            throw e;
        }
    }

    @PutMapping("/admin/products/{productId}/image")
    public ResponseEntity<ProductDTO> updateProductImageAdmin(@PathVariable Long productId,
                                                              @RequestParam("image") MultipartFile image) throws IOException {
        try {
            System.out.println("Admin updating product image: " + productId);

            // Use the same service method - authorization is handled in service layer
            ProductDTO updatedProduct = productService.updateProductImage(productId, image);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            System.err.println("Error in ProductController.updateProductImageAdmin: " + e.getMessage());
            throw e;
        }
    }

    // Get user's products with pagination
    @GetMapping("/user/products")
    public ResponseEntity<ProductResponse> getUserProducts(
            @RequestParam(value = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(value = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

        String email = authUtil.loggedInEmail();
        ProductResponse productResponse = productService.getUserProducts(email, pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }

    // Get user's products without pagination
    @GetMapping("/user/products/all")
    public ResponseEntity<List<ProductDTO>> getUserProductsList() {
        String email = authUtil.loggedInEmail();
        List<ProductDTO> products = productService.getUserProductsList(email);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Get count of user's products
    @GetMapping("/user/products/count")
    public ResponseEntity<Long> getUserProductsCount() {
        String email = authUtil.loggedInEmail();
        Long count = productService.getUserProductsCount(email);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    // ===== NEW ENDPOINTS FOR USER ID BASED QUERIES =====

    // Get products by user ID with pagination
    @GetMapping("/products/user/{userId}")
    public ResponseEntity<ProductResponse> getProductsByUserId(
            @PathVariable Long userId,
            @RequestParam(value = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(value = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

        ProductResponse productResponse = productService.getProductsByUserId(userId, pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }

    // Get products by user ID without pagination
    @GetMapping("/products/user/{userId}/all")
    public ResponseEntity<List<ProductDTO>> getProductsListByUserId(@PathVariable Long userId) {
        List<ProductDTO> products = productService.getProductsListByUserId(userId);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    // Get count of products by user ID
    @GetMapping("/products/user/{userId}/count")
    public ResponseEntity<Long> getProductsCountByUserId(@PathVariable Long userId) {
        Long count = productService.getProductsCountByUserId(userId);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

}
