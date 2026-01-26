# Spring Boot CORS Configuration Guide

This guide shows how to configure CORS in your Spring Boot backend to allow requests from your React frontend.

## Option 1: Global CORS Configuration (Recommended)

Create a configuration class to enable CORS for all endpoints:

```java
package com.yourpackage.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow all origins
        config.setAllowCredentials(false); // Set to true if you need credentials
        config.addAllowedOriginPattern("*"); // Use addAllowedOriginPattern for Spring Boot 2.4+
        // OR use this for older versions:
        // config.addAllowedOrigin("*");
        
        // Allow all HTTP methods
        config.addAllowedMethod("*");
        
        // Allow all headers
        config.addAllowedHeader("*");
        
        // Expose headers if needed
        config.addExposedHeader("*");
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

## Option 2: Controller-Level CORS (For Specific Endpoints)

Add `@CrossOrigin` annotation to your controller or specific methods:

```java
package com.yourpackage.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pgr-analytics/v1")
@CrossOrigin(origins = "*") // Allow all origins
public class AnalyticsController {

    @GetMapping("/_summary")
    @CrossOrigin(origins = "*") // Can also be on method level
    public ResponseEntity<?> getSummary(@RequestParam String tenantId) {
        // Your implementation
        return ResponseEntity.ok().body(data);
    }
}
```

## Option 3: WebMvcConfigurer (Alternative Global Configuration)

```java
package com.yourpackage.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*") // Allow all origins
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false)
                .maxAge(3600);
    }
}
```

## Option 4: Security Configuration (If Using Spring Security)

If you're using Spring Security, configure CORS in your security configuration:

```java
package com.yourpackage.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().configurationSource(corsConfigurationSource())
            .and()
            .csrf().disable() // Disable CSRF for stateless APIs
            .authorizeHttpRequests()
            .anyRequest().permitAll(); // Adjust based on your security needs
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(false);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

## Important Notes:

1. **`addAllowedOriginPattern("*")` vs `addAllowedOrigin("*")`**:
   - Use `addAllowedOriginPattern("*")` for Spring Boot 2.4+ (recommended)
   - `addAllowedOrigin("*")` is deprecated but still works

2. **Credentials**:
   - If you set `setAllowCredentials(true)`, you CANNOT use `"*"` for origins
   - You must specify exact origins: `config.addAllowedOrigin("http://localhost:3000")`

3. **For Production**:
   - Don't use `"*"` for all origins in production
   - Specify exact allowed origins:
   ```java
   config.setAllowedOrigins(Arrays.asList(
       "http://localhost:3000",
       "https://your-production-domain.com"
   ));
   ```

4. **Your Specific Endpoint**:
   Since your endpoint is `/pgr-analytics/v1/_summary`, make sure CORS is configured for the `/pgr-analytics/**` path or `/**` for all paths.

## Quick Test:

After implementing CORS, test with:
```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:9260/pgr-analytics/v1/_summary?tenantId=ethiopia.citya
```

You should see CORS headers in the response:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, ...`
- `Access-Control-Allow-Headers: *`
