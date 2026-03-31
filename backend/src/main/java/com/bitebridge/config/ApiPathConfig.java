package com.bitebridge.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.method.HandlerTypePredicate;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ApiPathConfig implements WebMvcConfigurer {

    @Override
    public void configurePathMatch(@NonNull PathMatchConfigurer configurer) {
        configurer.addPathPrefix("/api", HandlerTypePredicate.forBasePackage("com.bitebridge.controller"));
    }
}
