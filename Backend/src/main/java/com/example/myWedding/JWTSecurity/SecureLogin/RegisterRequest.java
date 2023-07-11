package com.example.myWedding.JWTSecurity.SecureLogin;

import com.example.myWedding.Users.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    private String username;
    private String firstName;
    private String lastName;
    private String password;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String address;
    private String city;
    private String photo;

    @Enumerated(EnumType.STRING)
    private Role role;

}
