package com.example.myWedding.Users;

import com.example.myWedding.Invitation.InvitationModel;
import com.example.myWedding.Venue.Venue;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping(path = "api/v1/user")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {
    private final UserModel userModel;
    private final InvitationModel invitationModel;

    @DeleteMapping(path = "/deleteUser/{UID}")
    public String deleteUserById(@PathVariable("UID") Long UID) {
        return userModel.deleteUser(UID);
    }

    @PutMapping(path = "/updateUser/{UID}")
    public String updateUser(@RequestParam("profilePicture") MultipartFile file, @RequestParam("username") String username, @RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName, @RequestParam("password") String password, @RequestParam("phoneNumber") String phoneNumber, @RequestParam("email") String email, @PathVariable("UID") Long UID) throws IOException {
        return userModel.updateUser(file, username, firstName, lastName, password, phoneNumber, email, UID);
    }

    @GetMapping(path = "/getUser/{UID}")
    public User getUser(@PathVariable("UID") Long UID) {
        return userModel.getUserById(UID);
    }

    @GetMapping(path = "/getGuest/{guestId}")
    public User getGuest(@PathVariable("guestId") Long guestId) {
        return userModel.getGuest(guestId);
    }

    @GetMapping(path = "/getAllUsers")
    public Iterable<User> getAllUsers() {
        return userModel.getAllUsers();
    }

    @GetMapping(path = "/getVendorVenues/{vendorId}")
    public Iterable<Venue> getVendorVenues(@PathVariable("vendorId") Long vendorId) {
        return userModel.getVendorVenues(vendorId);
    }

    @PutMapping(path = "/addFavoriteVenue/{UID}/{venueId}")
    public String addFavoriteVenue(@PathVariable("UID") Long UID, @PathVariable Long venueId) {
        return userModel.addToFavoriteVenues(UID, venueId);
    }

    @DeleteMapping(path = "/removeFromFavorites/{UID}/{venueId}")
    public String removeFromFavorites(@PathVariable("UID") Long UID, @PathVariable Long venueId) {
        return userModel.removeToFavoriteVenues(UID, venueId);
    }


    @GetMapping(path = "/getFavoriteVenues/{UID}")
    public Iterable<Venue> getFavoriteVenues(@PathVariable("UID") Long UID) {
        return userModel.getFavoriteVenues(UID);
    }

    @PutMapping(path = "/sendInvitation/{UID}")
    public String sendInvitation(@PathVariable("UID") Long UID, @RequestBody User guest) {
        return invitationModel.sendInvitation(UID, guest);
    }

    @GetMapping(path = "/getGuestId")
    public Long getGuestId() {
        return invitationModel.getGuestId();
    }

    @PutMapping(path = "/acceptInvite/{guestId}")
    public String acceptInvite(@PathVariable("guestId") Long guestId) {
        return invitationModel.acceptInvitation(guestId);
    }

}
