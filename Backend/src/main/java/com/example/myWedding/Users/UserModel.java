package com.example.myWedding.Users;

import com.example.myWedding.Invitation.Invitation;
import com.example.myWedding.Invitation.InvitationRepository;
import com.example.myWedding.Venue.Venue;
import com.example.myWedding.Venue.VenueRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Objects;

@Service
public class UserModel {
    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final InvitationRepository invitationRepository;
    private final PasswordEncoder passwordEncoder;


    @Autowired
    public UserModel(UserRepository userRepository, VenueRepository venueRepository, PasswordEncoder passwordEncoder, InvitationRepository invitationRepository) {
        this.userRepository = userRepository;
        this.venueRepository = venueRepository;
        this.passwordEncoder = passwordEncoder;
        this.invitationRepository = invitationRepository;
    }

    ///////////////////////////////////////    CRUD    //////////////////////////////////////////////////////////
    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User getGuest(Long id) {
        User guest = userRepository.findById(id).orElse(null);
        if (guest == null) return null;

        if (guest.getRole().equals(Role.ROLE_GUEST)) {
            System.out.println("User is a guest " + guest.getFirstName());
            return guest;
        } else {
            System.out.println("User is not a guest");
            return null;
        }

    }


    public String updateUser(MultipartFile file, String username, String firstName,
                             String lastName, String password, String phoneNumber, String email, Long UID) throws IOException {
        User user1 = new User();
        if (UID == null) {
            for (int i = 0; i < userRepository.findAll().size(); i++) {
                if (userRepository.findAll().get(i).getUsername().equals(username)) {
                    user1 = userRepository.findAll().get(i);
                }
            }
        } else {
            user1 = userRepository.findById(UID).orElse(null);
            if (user1 == null) return "User not found";
        }
        user1.setEmail(email);
        user1.setUsername(user1.getUsername());
        user1.setFirstName(firstName);
        user1.setLastName(lastName);
        user1.setPassword(passwordEncoder.encode(password));

        user1.setPhoneNumber(phoneNumber);
        user1.setProfilePicture(Base64.getEncoder().encodeToString(file.getBytes()));
        userRepository.save(user1);

        //update user
        return "User updated successfully";
    }

    @Transactional
    public String deleteUser(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return "User not found";

        if (user.getRole().equals(Role.ROLE_USER)) {
            user.getReservedVenue().getUsers().remove(user);
            userRepository.deleteAll(user.getReservedVenue().getGuests());
            user.getReservedVenue().setReserved(false);
            user.getReservedVenue().setGuests(null);
            user.setReservedVenue(null);
            user.setInvitation(null);
            user.setFavoriteVenues(null);

            for (int i = 0; i < invitationRepository.findAll().size(); i++) {
                Invitation invitation = invitationRepository.findAll().get(i);
                invitation.setInvitationSender(null);
                invitation.setVenue(null);
            }
        } else if (user.getRole().equals(Role.ROLE_VENDOR)) {
            user.setVendorVenues(null);

            if (user.getVendorVenues() != null) {

                for (int i = 0; i < user.getVendorVenues().size(); i++) {
                    Venue venue = venueRepository.findAll().get(i);
                    venue.setVenueOwner(null);
                    userRepository.deleteAll(venue.getGuests());
                    venueRepository.delete(venue);
                }
            }

        }

        userRepository.delete(user);
        return "User deleted successfully";
    }

    ///////////////////////////////////////    CRUD    //////////////////////////////////////////////////////////

    public List<Venue> getVendorVenues(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return null;

        return user.getVendorVenues();
    }

    public String addToFavoriteVenues(Long UID, Long venueId) {
        User user = userRepository.findById(UID).orElse(null);
        if (user == null) return "User not found";

        Venue venue = venueRepository.findById(venueId).orElse(null);
        if (venue == null) return "Venue not found";

        if (!user.getFavoriteVenues().contains(venue)) {
            user.getFavoriteVenues().add(venue);
            venue.getUsers().add(user);
            userRepository.save(user);
            venueRepository.save(venue);
            return "Venue added to favorites";
        } else {
            return "Venue already added to favorites";
        }
    }

    @Transactional

    public String removeToFavoriteVenues(Long UID, Long venueId) {
        User user = userRepository.findById(UID).orElse(null);
        if (user == null) return "User not found";
        Venue venue = venueRepository.findById(venueId).orElse(null);
        if (venue == null) return "Venue not found";
        user.getFavoriteVenues().remove(venue);
        userRepository.save(user);
        return "Venue removed from favorites";
    }

    public List<Venue> getFavoriteVenues(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return null;
        return user.getFavoriteVenues();
    }


}
