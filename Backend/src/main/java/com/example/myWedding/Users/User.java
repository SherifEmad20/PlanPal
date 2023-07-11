package com.example.myWedding.Users;


import com.example.myWedding.Invitation.Invitation;
import com.example.myWedding.Venue.Venue;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String firstName;

    private String lastName;

    private String password;

    private String phoneNumber;

    private String email;


    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profilePicture;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne
    private Invitation invitation;

    @OneToOne
    private Venue reservedVenue;

    @ManyToMany
    private List<Venue> favoriteVenues = new ArrayList<>();

    @OneToMany
    private List<Venue> vendorVenues = new ArrayList<>();


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
