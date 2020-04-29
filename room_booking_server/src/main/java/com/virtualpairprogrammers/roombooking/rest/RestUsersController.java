package com.virtualpairprogrammers.roombooking.rest;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.virtualpairprogrammers.roombooking.data.UserRepository;
import com.virtualpairprogrammers.roombooking.model.AngularUser;
import com.virtualpairprogrammers.roombooking.model.entities.User;

@RestController
@RequestMapping("/api/users")
public class RestUsersController {
	@Autowired
	private UserRepository userRepository;
	
	@GetMapping
	public List<AngularUser> getAllUsers() throws InterruptedException {
		Thread.sleep(1000);
		return userRepository.findAll().stream().map(user -> new AngularUser(user)).collect(Collectors.toList());
	}
	
	@GetMapping("/{id}")
	public AngularUser getUser(@PathVariable("id") Long id) {
		return new AngularUser(userRepository.findById(id).get());
	}
	
	@PutMapping() 
	public AngularUser updateUser(@RequestBody AngularUser updatedUser) {
		User originalUser = userRepository.findById(updatedUser.getId()).get();
		originalUser.setName(updatedUser.getName());
		return new AngularUser(userRepository.save(originalUser));
	}
	
	@PostMapping()
	public AngularUser newUser(@RequestBody User user) {
		return new AngularUser(userRepository.save(user));
	}
	
	@DeleteMapping("/{id}")
	public void deleteUser(@PathVariable("id") Long id) {
		userRepository.deleteById(id);
	}
	
	@GetMapping("/reset-password/{id}")
	public void resetPassword(@PathVariable("id") Long id) {
		User user = userRepository.findById(id).get();
		user.setPassword("secret");
		userRepository.save(user);
	}
	
	@GetMapping("/current-user-role")
	public Map<String, String> getCurrentUsersRole() {
		Collection<GrantedAuthority> roles = (Collection<GrantedAuthority>)SecurityContextHolder.getContext().getAuthentication().getAuthorities();
		String role = "";
		if(roles.size() > 0) {
			GrantedAuthority ga = roles.iterator().next();
			role = ga.getAuthority().substring(5);
		}
		Map<String, String> results = new HashMap<>();
		results.put("role", role);
		return results;
	}
	
	@GetMapping("/logout")
	public String logout(HttpServletResponse response) {
		Cookie cookie = new Cookie("token", null); // we dont send back a token any more
		cookie.setPath("/api");
		cookie.setHttpOnly(true); 	// the browser will store the cookie, but Javascript can't reference them
//		cookie.setSecure(true); 	// It means that this cookie should only be sent over SSL (ONLY IN PRODUCTION)
		cookie.setMaxAge(0);  		// SET MAX AGE TO 0 
		response.addCookie(cookie);
		SecurityContextHolder.getContext().setAuthentication(null); 	// There is no longer any authenticated user
		return "";
	}

}
