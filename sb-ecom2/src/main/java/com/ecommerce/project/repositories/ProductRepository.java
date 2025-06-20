package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Category;
import com.ecommerce.project.model.Product;
import com.ecommerce.project.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Page<Product> findByCategoryOrderByPriceAsc(Category category, Pageable pageDetails);

    Page<Product> findByProductNameLikeIgnoreCase(String keyword, Pageable pageDetails);

    // Find products by seller/user with pagination
    Page<Product> findByUserOrderByProductIdDesc(User user, Pageable pageable);

    // Find products by seller/user without pagination
    List<Product> findByUserOrderByProductIdDesc(User user);

    // Find products by user email
    @Query("SELECT p FROM Product p WHERE p.user.email = ?1 ORDER BY p.productId DESC")
    Page<Product> findByUserEmailOrderByProductIdDesc(String email, Pageable pageable);

    // Count products by user email
    @Query("SELECT COUNT(p) FROM Product p WHERE p.user.email = ?1")
    Long countByUserEmail(String email);

    // Find products by user ID with pagination
    @Query("SELECT p FROM Product p WHERE p.user.userId = ?1 ORDER BY p.productId DESC")
    Page<Product> findByUserIdOrderByProductIdDesc(Long userId, Pageable pageable);

    // Find products by user ID without pagination
    @Query("SELECT p FROM Product p WHERE p.user.userId = ?1 ORDER BY p.productId DESC")
    List<Product> findByUserIdOrderByProductIdDesc(Long userId);

    // Count products by user ID
    @Query("SELECT COUNT(p) FROM Product p WHERE p.user.userId = ?1")
    Long countByUserId(Long userId);
}
