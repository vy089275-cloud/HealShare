package com.healshare.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Public
                        .requestMatchers(
                                "/api/pharmacists/login",
                                "/api/pharmacists/signup",
                                "/api/customers/login",
                                "/api/customers/signup",
                                "/uploads/**","/static","/images"

                        ).permitAll()

                        // Pharmacist protected routes
                        .requestMatchers(
                                "/api/pharmacists/me",
                                "/api/pharmacists/update",
                                "/api/pharmacists/delete"
                        ).authenticated()

                        // Customer protected routes
                        .requestMatchers(
                                "/api/customers/me",
                                "/api/customers/update",
                                "/api/customers/delete"
                        ).authenticated()

                        // Medicines
                        .requestMatchers("/medicines/**").authenticated()
                        .requestMatchers("/medicines").authenticated()

                        // Notifications
                        .requestMatchers("/notifications/**").authenticated()
                        .requestMatchers("/notifications").authenticated()

                        // Reservations
                        .requestMatchers("/reservations/**").authenticated()
                        .requestMatchers("/reservations").authenticated()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable());

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*")); // allow everything
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
