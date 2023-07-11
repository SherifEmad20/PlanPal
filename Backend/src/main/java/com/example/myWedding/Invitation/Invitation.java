package com.example.myWedding.Invitation;

import com.example.myWedding.Users.User;
import com.example.myWedding.Venue.Venue;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Invitation")
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Status status;

    @OneToOne
    private Venue venue;

    @OneToOne
    @JsonIgnore
    private User invitationSender;


}
