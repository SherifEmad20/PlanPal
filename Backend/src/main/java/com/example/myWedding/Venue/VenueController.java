package com.example.myWedding.Venue;

import com.example.myWedding.Event.Event;
import com.example.myWedding.Users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(path = "api/v1/venue")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class VenueController {

    private final VenueModel venueModel;

    @PostMapping(path = "addVenue")
    public String addVenue(@RequestParam("venueImages") List<MultipartFile> file, @RequestParam("venueName") String venueName, @RequestParam("venueType") String venueType, @RequestParam("venueDescription") String venueDescription, @RequestParam("address") String address, @RequestParam("phone") String phone, @RequestParam("capacity") int capacity, @RequestParam("venuePrice") double venuePrice, @RequestParam("vendorId") Long vendorId) throws IOException {
        return venueModel.addVenue(file, venueName, venueType, venueDescription, address, phone, capacity, venuePrice, vendorId);
    }

    @GetMapping(path = "getAllVenues")
    public Iterable<Venue> getAllVenues() {
        return venueModel.getAllVenues();
    }

    @GetMapping(path = "{id}")
    public Venue getVenueById(@PathVariable("id") Long id) {
        return venueModel.getVenueById(id);
    }

    @PostMapping(path = "updateVenue")
    public String updateVenue(@RequestParam("venueImages") List<MultipartFile> file, @RequestParam("venueName") String venueName, @RequestParam("venueType") String venueType, @RequestParam("venueDescription") String venueDescription, @RequestParam("address") String address, @RequestParam("phone") String phone, @RequestParam("capacity") int capacity, @RequestParam("venuePrice") double venuePrice, @RequestParam("venueId") Long venueId) throws IOException {
        return venueModel.updateVenue(file, venueName, venueType, venueDescription, address, phone, capacity, venuePrice, venueId);
    }

    @DeleteMapping(path = "deleteVenue/{venueId}/{vendorId}")
    public String deleteVenue(@PathVariable("venueId") Long venueId, @PathVariable("vendorId") Long vendorId) {
        return venueModel.deleteVenue(vendorId, venueId);
    }

    @GetMapping(path = "getGuests/{venueId}")
    public Iterable<User> getGuests(@PathVariable("venueId") Long venueId) {
        return venueModel.getGuests(venueId);
    }

    @PutMapping(path = "rateVenue/{venueId}/{rating}")
    public void rateVenue(@PathVariable("venueId") Long venueId, @PathVariable("rating") float rating) {
        venueModel.rateVenue(venueId, rating);
    }

    @PutMapping(path = "reserveVenue/{venueId}/{UID}")
    public String reserveVenue(@PathVariable("venueId") Long venueId, @PathVariable Long UID) {
        return venueModel.reserveVenue(UID, venueId);
    }

    @PutMapping(path = "cancelReservation/{venueId}/{UID}")
    public String CancelReservation(@PathVariable("venueId") Long venueId, @PathVariable Long UID) {
        return venueModel.CancelReservation(UID, venueId);
    }

    @GetMapping(path = "getReservedVenues")
    public Iterable<Venue> getReservedVenues() {
        return venueModel.getReservedVenues();
    }

    @GetMapping(path = "getVenueOf/{type}")
    public Iterable<Venue> getVenuesOfType(@PathVariable("type") String type) {
        return venueModel.getVenueOfType(type);
    }

    @GetMapping(path = "getRecommendations/{UID}")
    public Iterable<Venue> recommendations(@PathVariable("UID") Long UID) {
        return venueModel.recommendations(UID);
    }



    @GetMapping(path = "getVenuesWithinPriceRange/{min}/{max}")
    public Iterable<Venue> getVenuesWithinPriceRange(@PathVariable("min") double min, @PathVariable("max") double max) {
        return venueModel.getVenuesWithinPriceRange(min, max);
    }

    @PostMapping(path = "addEvent/{UID}/{venueId}")
    public String addEvent(@PathVariable("UID") Long UID, @PathVariable("venueId") Long venueId, @RequestBody Event event) {
        return venueModel.addEvent(UID, venueId, event);
    }

    @DeleteMapping(path = "deleteEvent/{venueId}/{eventId}")
    public String deleteEvent(@PathVariable("venueId") Long venueId, @PathVariable("eventId") Long eventId) {
        return venueModel.deleteEvent(venueId, eventId);
    }

    @PutMapping(path = "updateEvent/{eventId}")
    public String updateEvent(@PathVariable("eventId") Long eventId, @RequestBody Event event) {
        return venueModel.updateEvent(eventId, event);
    }

    @GetMapping(path = "getEvent/{venueId}")
    public Event getEvents(@PathVariable("venueId") Long venueId) {
        return venueModel.getEvent(venueId);
    }

    @DeleteMapping(path = "removeFromGuestList/{venueId}/{guestId}")
    public String removeFromGuestList(@PathVariable("venueId") Long venueId, @PathVariable Long guestId) {
        return venueModel.removeFromGuestList(guestId, venueId);
    }


    @PutMapping(path = "addReview/{venueId}/{UID}")
    public String addReview(@PathVariable("venueId") Long venueId, @RequestBody Reviews review, @PathVariable("UID") Long UID) {
        return venueModel.addReview(venueId, review, UID);
    }

    @GetMapping(path = "getReviews/{venueId}")
    public Iterable<Reviews> getReviews(@PathVariable("venueId") Long venueId) {
        return venueModel.getReviews(venueId);
    }
}
