package com.example.myWedding.Venue;

import com.example.myWedding.Event.Event;
import com.example.myWedding.Images.Images;
import com.example.myWedding.Users.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Venue")
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long venueId;

    private String venueName;

    private String address;

    private String phone;

    private int capacity;

    private double venuePrice;

    private String vendorName;

    private Long vendorId;


    @Column(columnDefinition = "LONGTEXT")
    @Lob
    private String venueDescription;

    private float rating;

    private String venueType;

    private boolean reserved;

    @OneToMany
    private List<Reviews> reviews = new ArrayList<>();


    @Column(columnDefinition = "LONGTEXT")
    @OneToMany
    private List<Images> venueImagesList = new ArrayList<>();


    @OneToOne
    @JsonIgnore
    private User venueOwner;

    @OneToOne
    private Event event;

    @ManyToMany
    @JsonIgnore
    private List<User> users = new ArrayList<>();

    @OneToMany
    @JsonIgnore
    private List<User> guests = new ArrayList<>();
}
