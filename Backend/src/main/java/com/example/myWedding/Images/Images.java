package com.example.myWedding.Images;

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
@Table(name = "Images")
public class Images {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageURL;

    private String imageName;

    @ManyToOne
    @JsonIgnore
    private Venue venue;
}
