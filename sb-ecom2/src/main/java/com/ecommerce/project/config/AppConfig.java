package com.ecommerce.project.config;

import com.ecommerce.project.model.Product;
import com.ecommerce.project.payload.ProductDTO;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration()
                .setSkipNullEnabled(true)
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        // Configure ProductDTO to Product mapping
        mapper.typeMap(ProductDTO.class, Product.class)
                .addMappings(cfg -> {
                    cfg.skip(Product::setProductId);
                    cfg.skip(Product::setUser);
                    cfg.skip(Product::setCategory);
                    cfg.skip(Product::setProducts); // Skip CartItem list
                });

        // Configure Product to ProductDTO mapping
        mapper.typeMap(Product.class, ProductDTO.class)
                .addMappings(cfg -> {
                    // Map all fields normally, no special handling needed
                });

        return mapper;
    }

}
