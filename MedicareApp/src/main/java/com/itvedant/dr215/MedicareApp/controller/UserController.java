package com.itvedant.dr215.MedicareApp.controller;

import com.itvedant.dr215.MedicareApp.config.JwtAuthenticationFilter;
import com.itvedant.dr215.MedicareApp.dto.AuthResponse;
import com.itvedant.dr215.MedicareApp.dto.LoginRequest;
import com.itvedant.dr215.MedicareApp.entity.User;
import com.itvedant.dr215.MedicareApp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicare/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired // Injects the JWT Filter component bean to enable security token generation natively
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @PostMapping("/saveUser")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        // Enforces a standard default profile placeholder image string if incoming data leaves it blank
        if (user.getImage() == null || user.getImage().isBlank()) {
            user.setImage("default-avatar.png");
        }
        User saved = userService.addUser(user);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/getAllUsers") // Added clear resource link identifier path matching login requests
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@RequestBody User user, @PathVariable Long id) {
        User updatedUser = userService.updateUser(user, id);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<User>> getUserByRole(@PathVariable String role) {
        List<User> users = userService.getUserByRole(role);
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // SECURE USER LOGIN ENDPOINT (WITH JWT TOKEN)
    @PostMapping("/login") // Maps to: POST http://localhost:8087/medicare/user/login
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) {
        try {
            // Verify raw credentials directly against the relational MySQL database records
            User authenticatedUser = userService.loginUser(request.getEmail(), request.getPassword());

            // Generate the secure JWT token string from your filter bean configuration layers
            String generatedToken = jwtAuthenticationFilter.generateToken(authenticatedUser);

            AuthResponse response = new AuthResponse(
                    authenticatedUser.getId(),
                    authenticatedUser.getName(),
                    authenticatedUser.getEmail(),
                    authenticatedUser.getRole(),
                    generatedToken,
                    "Login Successful!"
            );

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            // Return an HTTP 401 Unauthorized status if password verification loops fail
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
}