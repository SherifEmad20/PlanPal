package com.example.myWedding.Venue;

import com.example.myWedding.Event.Event;
import com.example.myWedding.Event.EventRepository;
import com.example.myWedding.Images.Images;
import com.example.myWedding.Images.ImagesRepository;
import com.example.myWedding.Invitation.Invitation;
import com.example.myWedding.Invitation.InvitationRepository;
import com.example.myWedding.Users.Role;
import com.example.myWedding.Users.User;
import com.example.myWedding.Users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class VenueModel {
    private final VenueRepository venueRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    private final InvitationRepository invitationRepository;
    private final ImagesRepository imagesRepository;

    private final ReviewRepository reviewRepository;

    @Autowired
    public VenueModel(VenueRepository venueRepository, UserRepository userRepository, EventRepository eventRepository,
                      ImagesRepository imagesRepository, ReviewRepository reviewRepository, InvitationRepository invitationRepository) {
        this.venueRepository = venueRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.imagesRepository = imagesRepository;
        this.reviewRepository = reviewRepository;
        this.invitationRepository = invitationRepository;
    }

    ///////////////////////////////////////    CRUD    //////////////////////////////////////////////////////////

    public String addVenue(List<MultipartFile> file, String venueName, String venueType, String venueDescription, String address,
                           String phone, int capacity, double venuePrice, Long vendorID) throws IOException {
        User vendor = userRepository.findById(vendorID).orElse(null);
        if (vendor == null) {
            return "Vendor not found";
        }
        if (!vendor.getRole().equals(Role.ROLE_VENDOR)) {
            return "You are not a vendor";
        }

        Venue venue = new Venue();
        List<Images> images = new ArrayList<>();

        for (int i = 0; i < file.size(); i++) {
            Images image = new Images();
            String fileName = StringUtils.cleanPath(file.get(i).getOriginalFilename());
            if (fileName.contains("..")) {
                return "not a valid file";
            }
            image.setImageName(fileName);

            String imgURL = Base64.getEncoder().encodeToString(file.get(i).getBytes());
            image.setImageURL(imgURL);
            images.add(image);
        }

        imagesRepository.saveAll(images);

        venue.setVenueOwner(vendor);
        vendor.getVendorVenues().add(venue);
        venue.setVendorName(vendor.getFirstName() + " " + vendor.getLastName());
        venue.setVendorId(vendor.getId());


        venue.setVenueName(venueName);
        venue.setVenueType(venueType);
        venue.setVenueDescription(venueDescription);
        venue.setAddress(address);
        venue.setPhone(phone);
        venue.setCapacity(capacity);
        venue.setVenuePrice(venuePrice);
        venue.setRating(0);
        venue.setReserved(false);
        venue.setVenueImagesList(images);

        venueRepository.save(venue);
        userRepository.save(vendor);

        return "Venue added successfully";
    }


    public Iterable<Venue> getAllVenues() {
        try {
            for (int i = 0; i < venueRepository.findAll().size(); i++) {
                String mlAddress = System.getenv("ML_ADDRESS");
                String mlPort = System.getenv("ML_PORT");
                String BASE_URL = "http://" + mlAddress + ":" + mlPort;
                System.out.println(BASE_URL);
                HttpClient.newHttpClient().send(HttpRequest.newBuilder()
                        .uri(URI.create(BASE_URL + "/getReviews/" +
                                venueRepository.findAll().get(i).getVenueId()))
                        .header("Content-Type", "application/json")
                        .timeout(java.time.Duration.ofMinutes(1))
                        .GET()
                        .build(), HttpResponse.BodyHandlers.ofString());
            }
            return venueRepository.findAll();
        } catch (Exception e) {
            return venueRepository.findAll();
        }
    }

    public Venue getVenueById(Long venueId) {
        return venueRepository.findById(venueId).orElse(null);
    }

    public String updateVenue(List<MultipartFile> file, String venueName, String venueType, String venueDescription, String address,
                              String phone, int capacity, double venuePrice, Long venueId) throws IOException {

        Venue venue = venueRepository.findById(venueId).orElse(null);
        if (venue == null) {
            return "Venue not found";
        }
        List<Images> images = new ArrayList<>();

        for (int i = 0; i < file.size(); i++) {
            Images image = new Images();
            String fileName = StringUtils.cleanPath(file.get(i).getOriginalFilename());
            if (fileName.contains("..")) {
                return "not a valid file";
            }
            image.setImageName(fileName);

            String imgURL = Base64.getEncoder().encodeToString(file.get(i).getBytes());
            image.setImageURL(imgURL);
            images.add(image);
        }

        imagesRepository.saveAll(images);

        venue.setVenueName(venueName);
        venue.setVenueType(venueType);
        venue.setVenueDescription(venueDescription);
        venue.setAddress(address);
        venue.setPhone(phone);
        venue.setCapacity(capacity);
        venue.setVenuePrice(venuePrice);
        venue.setReserved(false);
        venue.setVenueImagesList(images);

        venueRepository.save(venue);

        return "Venue updated successfully";
    }

    @Transactional
    public String deleteVenue(Long vendorID, Long venueId) {
        User vendor = userRepository.findById(vendorID).orElse(null);
        if (vendor == null) {
            return "Vendor not found";
        }
        if (!vendor.getRole().equals(Role.ROLE_VENDOR)) {
            return "You are not a vendor";
        }
        Venue venue = venueRepository.findById(venueId).orElse(null);
        if (venue == null) {
            return "Venue not found";
        }

        for (int i = 0; i < userRepository.findAll().size(); i++) {
            User user = userRepository.findAll().get(i);
            user.getFavoriteVenues().remove(venue);
            user.getVendorVenues().remove(venue);
            user.setInvitation(null);
            user.setReservedVenue(null);
            userRepository.save(user);
        }

        List<User> guests = venue.getGuests();
        userRepository.deleteAll(guests);

        for (int i = 0; i < invitationRepository.findAll().size(); i++) {
            Invitation invitation = invitationRepository.findAll().get(i);
            if (invitation.getVenue().equals(venue)) {
                invitationRepository.delete(invitation);
            }
        }


        venueRepository.delete(venue);
        return "Venue deleted successfully";
    }
    ///////////////////////////////////////    CRUD    //////////////////////////////////////////////////////////

    public Iterable<User> getGuests(Long venueId) {
        Venue venue = venueRepository.findById(venueId).orElse(null);
        if (venue == null) {
            return null;
        }
        return venue.getGuests();
    }

    public void rateVenue(Long venueId, float rate) {
        Venue venue = venueRepository.findById(venueId).orElse(null);
        if (venue == null) return;
        venue.setRating(rate);
        venueRepository.save(venue);
    }

    public String reserveVenue(Long UID, Long venueId) {
        User user = userRepository.findById(UID).orElse(null);
        if (user == null) return "User not found";

        if (!user.getRole().equals(Role.ROLE_USER)) {
            return "You are not a user";
        }


        Venue venue = venueRepository.findById(venueId).orElse(null);
        if (venue == null) return "Venue not found";
        venue.setReserved(true);
        user.setReservedVenue(venue);
        venueRepository.save(venue);
        userRepository.save(user);
        return "Venue reserved successfully";
    }

    public String CancelReservation(Long UID, Long venueId) {
        User user = userRepository.findById(UID).orElse(null);
        if (user == null) return "User not found";

        Venue venue = venueRepository.findById(venueId).orElse(null);
        if (venue == null) return "Venue not found";
        venue.setReserved(false);
        user.setReservedVenue(null);
        venueRepository.save(venue);
        userRepository.save(user);
        return "Venue reservation canceled successfully";
    }

    public Iterable<Venue> getReservedVenues() {
        return venueRepository.findAllByReserved(true);
    }


    public String addEvent(Long UID, Long venueId, Event event) {
        User user = userRepository.findById(UID).orElse(null);
        if (user == null) {
            return "user not found";
        }
        if (!user.getRole().equals(Role.ROLE_USER)) {
            return "You are not a user";
        }

        Venue venue = venueRepository.findById(venueId).orElse(null);
        if (venue == null) {
            return "Venue not found";
        }
        eventRepository.save(event);
        venue.setEvent(event);
        venueRepository.save(venue);
        return "Event added successfully";
    }

    public Event getEvent(Long venueId) {
        Venue venue = venueRepository.findById(venueId).orElse(null);
        if (venue == null) return null;
        return venue.getEvent();
    }

    public String deleteEvent(Long venueId, Long eventId) {
        Venue venue = venueRepository.findById(venueId).orElse(null);
        if (venue == null) return "Venue not found";
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) return "Event not found";

        venue.setEvent(null);
        eventRepository.delete(event);
        return "Event deleted successfully";
    }

    public String updateEvent(Long eventId, Event event) {
        Event event1 = eventRepository.findById(eventId).orElse(null);
        if (event1 == null) return "Event not found";
        event1.setEventType(event.getEventType());
        event1.setEventDate(event.getEventDate());
        event1.setEventDescription(event.getEventDescription());
        event1.setEventStartTime(event.getEventStartTime());
        event1.setEventEndTime(event.getEventEndTime());
        event1.setServings(event.getServings());
        eventRepository.save(event1);
        return "Event updated successfully";
    }

    @Transactional
    public String removeFromGuestList(Long guestId, Long venueId) {
        Venue venue = venueRepository.findById(venueId).orElse(null);
        User guest = userRepository.findById(guestId).orElse(null);
        if (venue == null || guest == null) return "Venue or guest not found";
        venue.getGuests().remove(guest);
        venueRepository.save(venue);
        userRepository.save(guest);
        return "Guest removed successfully";
    }

    ////////////////////////////////////////////////////////////////////////////////////////

    public String addReview(Long venueId, Reviews review, Long UID) {
        User user = userRepository.findById(UID).orElse(null);
        if (user == null) {
            return "user not found";
        }
        Venue venue = venueRepository.findById(venueId).orElse(null);
        if (venue == null) {
            return "Venue not found";
        }
        review.setUsername(user.getUsername());
        reviewRepository.save(review);
        venue.getReviews().add(review);
        venueRepository.save(venue);
        return "Review added successfully";
    }

    public Iterable<Reviews> getReviews(Long venueId) {
        Venue venue = venueRepository.findById(venueId).orElse(null);
        if (venue == null) return null;
        return venue.getReviews();
    }

    public Iterable<Venue> getVenueOfType(String type) {
        List<Venue> venuesOfType = new ArrayList<>();
        for (int i = 0; i < venueRepository.findAll().size(); i++) {
            if (venueRepository.findAll().get(i).getVenueType().equalsIgnoreCase(type)) {
                venuesOfType.add(venueRepository.findAll().get(i));
            }
        }
        return venuesOfType;
    }

    public Iterable<Venue> recommendations(Long UID) {
        User user = userRepository.findById(UID).orElse(null);
        if (user == null) return null;
        List<Venue> venues = new ArrayList<>();

        if (user.getFavoriteVenues().isEmpty()) {
            venues.addAll(venueRepository.findAll());
        }
        for (int i = 0; i < venueRepository.findAll().size(); i++) {
            for (int j = 0; j < user.getFavoriteVenues().size(); j++) {
                if (venueRepository.findAll().get(i).getVenueType().equalsIgnoreCase(user.getFavoriteVenues().get(j).getVenueType())) {
                    venues.add(venueRepository.findAll().get(i));
                }
            }
        }
        return venues;
    }

    public Iterable<Venue> getVenuesWithinPriceRange(double minVal, double maxVal) {
        List<Venue> venuesWithinRange = new ArrayList<>();
        for (int i = 0; i < venueRepository.findAll().size(); i++) {
            if (venueRepository.findAll().get(i).getVenuePrice() >= minVal && venueRepository.findAll().get(i).getVenuePrice() <= maxVal) {
                venuesWithinRange.add(venueRepository.findAll().get(i));
            }
        }
        return venuesWithinRange;

    }

}
