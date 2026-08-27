package com.healshare.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve images from uploads folder dynamically based on the project directory
        String uploadPath=System.getProperty("user.dir")+"/uploads/";
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:"+uploadPath);
    }
}