package com.virtualpairprogrammers.roombooking.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import com.auth0.jwt.JWT;

@Configuration
@EnableWebSecurity
public class RestSecurityConfig extends WebSecurityConfigurerAdapter{
	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth.inMemoryAuthentication()
			.withUser("matt").password("{noop}secret").authorities("ROLE_ADMIN")
			.and()
			.withUser("jane").password("{noop}secret").authorities("ROLE_USER");
		// TODO: This password should be encoded
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// Basic Auth
		http
			.csrf().disable()
			.authorizeRequests()
			.antMatchers(HttpMethod.OPTIONS, "/api/basicAuth/**").permitAll() // OPTIONS doesn't need to be secured
			.antMatchers("/api/basicAuth/**").hasAnyRole("ADMIN","USER")
			.and().httpBasic();
		
		// JWT Auth
		http
			.csrf().disable()
			.authorizeRequests()
			.antMatchers(HttpMethod.OPTIONS, "/api/**").permitAll() 	// Permit any options on any pre-flight requests
			.antMatchers(HttpMethod.GET, "/api/bookings/**").permitAll()
			.antMatchers(HttpMethod.GET, "/api/**").hasAnyRole("ADMIN", "USER")
			.antMatchers("/api/**").hasRole("ADMIN")
			.and()
			.addFilter(new JWTAuthenticationAndAuthorizationFilter(authenticationManager()));
	}
	
	
}
