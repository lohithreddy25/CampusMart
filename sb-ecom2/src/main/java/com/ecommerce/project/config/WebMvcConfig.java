package com.ecommerce.project.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static images from the images/ directory
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:images/")
                .setCachePeriod(3600); // Cache for 1 hour
    }
}
