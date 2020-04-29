package com.virtualpairprogrammers.roombooking.services;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.interfaces.RSAPrivateCrtKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Base64;
import java.util.Date;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;

@Service
public class JWTService {
	
	private RSAPrivateCrtKey privateKey;
	private RSAPublicKey publicKey;
	private final long expirationTime = 1800000; // 30 minutes
	
	@PostConstruct 	// run once, when the service is constructed for the first time
	private void initKeys() throws NoSuchAlgorithmException {
		KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
		generator.initialize(2048);
		KeyPair keyPair = generator.generateKeyPair();
		privateKey = (RSAPrivateCrtKey) keyPair.getPrivate();
		publicKey = (RSAPublicKey) keyPair.getPublic();
	}
	
	public String generateToken(String name, String role) { 	// If I use a real database I should use userID instead of name
		return JWT.create()
					.withClaim("user", name)  	// specify what is going to go in the payload
					.withClaim("role", role)	// specify what is going to go in the payload
					.withExpiresAt(new Date(System.currentTimeMillis() + expirationTime))
					.sign(Algorithm.RSA256(publicKey,privateKey));
	}
	
	public String validateToken(String token) throws JWTVerificationException {
		String encodedPayload = JWT.require(Algorithm.RSA256(publicKey,privateKey))
			.build() 		// genereate JTW Verifier
			.verify(token)
			.getPayload();  // Engcoded payload that we want to return;
		
		return new String(Base64.getDecoder().decode(encodedPayload));
	}
}
