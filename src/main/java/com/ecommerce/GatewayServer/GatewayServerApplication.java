package com.ecommerce.GatewayServer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;


@SpringBootApplication
public class GatewayServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatewayServerApplication.class, args);
	}

	@Bean
	RouteLocator routeLocator(RouteLocatorBuilder builder){
		return builder.routes()
				.route("users", r -> r.path("/users/**")
						.filters(f -> f.stripPrefix(1))
						.uri("lb://user-service")
				)
				.route("categories", r -> r.path("/categories/**")
						.filters(f -> f.stripPrefix(1))
						.uri("lb://category-service")
				)
				.route("brands", r -> r.path("/brands/**")
						.filters(f -> f.stripPrefix(1))
						.uri("lb://brand-service")
				)
				.build();
	}


}
