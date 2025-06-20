package com.ecommerce.project.service;

import jakarta.transaction.Transactional;
import org.springframework.security.access.AccessDeniedException;
import com.ecommerce.project.exceptions.APIException;
import com.ecommerce.project.exceptions.ResourceNotFoundException;
import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.User;
import com.ecommerce.project.payload.ProductDTO;
import com.ecommerce.project.payload.ProductResponse;
import com.ecommerce.project.repositories.CartRepository;
import com.ecommerce.project.repositories.CategoryRepository;
import com.ecommerce.project.repositories.ProductRepository;
import com.ecommerce.project.repositories.UserRepository;
import com.ecommerce.project.security.services.UserDetailsImpl;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private FileService fileService;

    @Value("${uploadImage}")
    private String path;

    @Value("${image.base.url}")
    private String imageBaseUrl;

    @Autowired
    private UserRepository userRepository;

    /**
     * Helper method to get the current authenticated user from SecurityContext
     */
    private UserDetailsImpl getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new AccessDeniedException("Authentication required");
        }
        return (UserDetailsImpl) authentication.getPrincipal();
    }

    /**
     * Helper method to get the current authenticated user's ID
     */
    private Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    /**
     * Helper method to check if current user is admin
     */
    private boolean isCurrentUserAdmin() {
        UserDetailsImpl currentUser = getCurrentUser();
        return currentUser.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
    }

    /**
     * Helper method to validate product access for user endpoints
     * Users can only access their own products, admins can access any product
     */
    private void validateProductAccess(Product product, String operation) {
        if (isCurrentUserAdmin()) {
            // Admin has full access to all products
            return;
        }

        // For regular users, check ownership
        Long currentUserId = getCurrentUserId();
        if (product.getUser() == null) {
            // Product has no seller, assign current user as the seller for user endpoints
            User seller = userRepository.findById(currentUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));
            product.setUser(seller);
        } else if (!product.getUser().getUserId().equals(currentUserId)) {
            throw new AccessDeniedException("You are not authorised to " + operation + " this product");
        }
    }

    public ProductDTO addProduct(Long categoryId,
                                 ProductDTO productDTO,
                                 Authentication auth) {

        try {
            // Validate inputs
            if (categoryId == null) {
                throw new APIException("Category ID cannot be null");
            }
            if (productDTO == null) {
                throw new APIException("Product data cannot be null");
            }
            if (auth == null || auth.getPrincipal() == null) {
                throw new APIException("Authentication required");
            }

            // Find category
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category","id",categoryId));

            // Get seller from authentication
            Long sellerId = ((UserDetailsImpl) auth.getPrincipal()).getId();
            User seller = userRepository.findById(sellerId)
                    .orElseThrow(() -> new ResourceNotFoundException("User","id",sellerId));

            // Map DTO to entity
            Product product = modelMapper.map(productDTO, Product.class);

            // Set required relationships
            product.setUser(seller);
            product.setCategory(category);
            product.setImage("default.png");

            // Calculate special price safely
            double specialPrice = productDTO.getPrice();
            if (productDTO.getDiscount() > 0) {
                specialPrice = productDTO.getPrice() - (productDTO.getDiscount() * 0.01 * productDTO.getPrice());
            }
            product.setSpecialPrice(specialPrice);

            // Save product
            Product savedProduct = productRepository.save(product);

            // Map back to DTO
            return modelMapper.map(savedProduct, ProductDTO.class);

        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error creating product: " + e.getMessage());
            e.printStackTrace();

            // Re-throw known exceptions
            if (e instanceof ResourceNotFoundException || e instanceof APIException) {
                throw e;
            }

            // Wrap unknown exceptions
            throw new APIException("Failed to create product: " + e.getMessage());
        }
    }

    @Override
    public ProductDTO addProductWithImage(Long categoryId, ProductDTO productDTO, MultipartFile image, Authentication auth) throws IOException {
        try {
            // Validate inputs
            if (categoryId == null) {
                throw new APIException("Category ID cannot be null");
            }
            if (productDTO == null) {
                throw new APIException("Product data cannot be null");
            }
            if (auth == null || auth.getPrincipal() == null) {
                throw new APIException("Authentication required");
            }

            // Find category
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category","id",categoryId));

            // Get seller from authentication
            Long sellerId = ((UserDetailsImpl) auth.getPrincipal()).getId();
            User seller = userRepository.findById(sellerId)
                    .orElseThrow(() -> new ResourceNotFoundException("User","id",sellerId));

            // Map DTO to entity
            Product product = modelMapper.map(productDTO, Product.class);

            // Set required relationships
            product.setUser(seller);
            product.setCategory(category);

            // Handle image upload
            String imageName = "default.png";
            if (image != null && !image.isEmpty()) {
                imageName = fileService.uploadImage(image);
            }
            product.setImage(imageName);

            // Calculate special price safely
            double specialPrice = productDTO.getPrice();
            if (productDTO.getDiscount() > 0) {
                specialPrice = productDTO.getPrice() - (productDTO.getDiscount() * 0.01 * productDTO.getPrice());
            }
            product.setSpecialPrice(specialPrice);

            // Save product
            Product savedProduct = productRepository.save(product);

            // Map back to DTO and set full image URL
            ProductDTO result = modelMapper.map(savedProduct, ProductDTO.class);
            result.setImage(constructImageUrl(savedProduct.getImage()));

            return result;

        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error creating product with image: " + e.getMessage());
            e.printStackTrace();

            // Re-throw known exceptions
            if (e instanceof ResourceNotFoundException || e instanceof APIException || e instanceof IOException) {
                throw e;
            }

            // Wrap unknown exceptions
            throw new APIException("Failed to create product with image: " + e.getMessage());
        }
    }

    @Override
    public ProductResponse getAllProducts(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String keyword, String category) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Specification<Product> spec = Specification.where(null);
        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("productName")), "%" + keyword.toLowerCase() + "%"));
        }

        if (category != null && !category.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(root.get("category").get("categoryName"), category));
        }

        Page<Product> pageProducts = productRepository.findAll(spec, pageDetails);

        List<Product> products = pageProducts.getContent();

        List<ProductDTO> productDTOS = products.stream()
                .map(product -> {
                    ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
                    productDTO.setImage(constructImageUrl(product.getImage()));
                    return productDTO;
                })
                .toList();

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setLastPage(pageProducts.isLast());
        return productResponse;
    }

    private String constructImageUrl(String imageName) {
        return imageBaseUrl.endsWith("/") ? imageBaseUrl + imageName : imageBaseUrl + "/" + imageName;
    }

    @Override
    public ProductResponse searchByCategory(Long categoryId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category", "categoryId", categoryId));

        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Product> pageProducts = productRepository.findByCategoryOrderByPriceAsc(category, pageDetails);

        List<Product> products = pageProducts.getContent();

        if(products.isEmpty()){
            throw new APIException(category.getCategoryName() + " category does not have any products");
        }

        List<ProductDTO> productDTOS = products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .toList();

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setLastPage(pageProducts.isLast());
        return productResponse;
    }

    @Override
    public ProductResponse searchProductByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Product> pageProducts = productRepository.findByProductNameLikeIgnoreCase('%' + keyword + '%', pageDetails);

        List<Product> products = pageProducts.getContent();
        List<ProductDTO> productDTOS = products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .toList();

        if(products.isEmpty()){
            throw new APIException("Products not found with keyword: " + keyword);
        }

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOS);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setLastPage(pageProducts.isLast());
        return productResponse;
    }

    // ProductServiceImpl.java
    @Override
    @Transactional
    public ProductDTO updateProduct(Long productId, ProductDTO dto) {

        Product entity = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product","id",productId));

        /* ownership check – handle products without sellers */
        // Validate access - users can only update their own products, admins can update any product
        validateProductAccess(entity, "update");

        /* ✨ copy only mutable fields; productId is skipped automatically */
        modelMapper.map(dto, entity);

        /* recompute specialPrice if price/discount changed */
        double special = dto.getPrice() -
           dto.getPrice() * dto.getDiscount() / 100.0;
       entity.setSpecialPrice(special);

        return modelMapper.map(productRepository.save(entity), ProductDTO.class);
    }




//    double special = dto.getPrice() -
//            dto.getPrice() * dto.getDiscount() / 100.0;
//        entity.setSpecialPrice(special);


    // ProductServiceImpl.java
    @Override
    @Transactional
    public ProductDTO deleteProduct(Long productId) {

        Product entity = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product", "id", productId));

        /* ── ownership / role check ───────────────────────────── */
        // Validate access - users can only delete their own products, admins can delete any product
        validateProductAccess(entity, "delete");
        /* ─────────────────────────────────────────────────────── */

        // Remove from every cart that still references the product
        cartRepository.findCartsByProductId(productId)
                .forEach(c -> cartService.deleteProductFromCart(c.getCartId(), productId));

        productRepository.delete(entity);                // hard-delete
        return modelMapper.map(entity, ProductDTO.class);
    }




    @Override
    @Transactional
    public ProductDTO updateProductImage(Long id, MultipartFile image) throws IOException {

        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        // Validate access - users can only update their own product images, admins can update any product image
        validateProductAccess(p, "update image for");

        try {
            String fileName = fileService.uploadImage(image);
            p.setImage(fileName);
            Product savedProduct = productRepository.save(p);
            return modelMapper.map(savedProduct, ProductDTO.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage(), e);
        }
    }

    @Override
    public ProductResponse getUserProducts(String email, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Product> pageProducts = productRepository.findByUserEmailOrderByProductIdDesc(email, pageDetails);

        List<Product> products = pageProducts.getContent();
        if (products.isEmpty()) {
            throw new APIException("No products found for user: " + email);
        }

        List<ProductDTO> productDTOs = products.stream()
                .map(product -> {
                    ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
                    productDTO.setImage(constructImageUrl(product.getImage()));
                    return productDTO;
                })
                .toList();

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOs);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setLastPage(pageProducts.isLast());

        return productResponse;
    }

    @Override
    public List<ProductDTO> getUserProductsList(String email) {
        // Find user by email
        User user = userRepository.findByUserName(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        List<Product> products = productRepository.findByUserOrderByProductIdDesc(user);

        if (products.isEmpty()) {
            throw new APIException("No products found for user: " + email);
        }

        return products.stream()
                .map(product -> {
                    ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
                    productDTO.setImage(constructImageUrl(product.getImage()));
                    return productDTO;
                })
                .toList();
    }

    @Override
    public Long getUserProductsCount(String email) {
        return productRepository.countByUserEmail(email);
    }

    @Override
    public ProductResponse getProductsByUserId(Long userId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Product> pageProducts = productRepository.findByUserIdOrderByProductIdDesc(userId, pageDetails);

        List<Product> products = pageProducts.getContent();
        if (products.isEmpty()) {
            throw new APIException("No products found for user ID: " + userId);
        }

        List<ProductDTO> productDTOs = products.stream()
                .map(product -> {
                    ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
                    productDTO.setImage(constructImageUrl(product.getImage()));
                    return productDTO;
                })
                .toList();

        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOs);
        productResponse.setPageNumber(pageProducts.getNumber());
        productResponse.setPageSize(pageProducts.getSize());
        productResponse.setTotalElements(pageProducts.getTotalElements());
        productResponse.setTotalPages(pageProducts.getTotalPages());
        productResponse.setLastPage(pageProducts.isLast());

        return productResponse;
    }

    @Override
    public List<ProductDTO> getProductsListByUserId(Long userId) {
        List<Product> products = productRepository.findByUserIdOrderByProductIdDesc(userId);

        if (products.isEmpty()) {
            throw new APIException("No products found for user ID: " + userId);
        }

        return products.stream()
                .map(product -> {
                    ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
                    productDTO.setImage(constructImageUrl(product.getImage()));
                    return productDTO;
                })
                .toList();
    }

    @Override
    public Long getProductsCountByUserId(Long userId) {
        return productRepository.countByUserId(userId);
    }

}
