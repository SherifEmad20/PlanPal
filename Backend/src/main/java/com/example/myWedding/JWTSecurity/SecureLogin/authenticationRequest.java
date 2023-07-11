package com.example.myWedding.JWTSecurity.SecureLogin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class authenticationRequest {
    private String username;
    private String password;

}
