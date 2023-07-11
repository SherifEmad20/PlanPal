package com.example.myWedding.Invitation;

import com.example.myWedding.Users.Role;
import com.example.myWedding.Users.User;
import com.example.myWedding.Users.UserRepository;
import com.example.myWedding.Venue.Venue;
import com.example.myWedding.Venue.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InvitationModel {
    private final InvitationRepository invitationRepository;
    private final UserRepository userRepository;

    private final VenueRepository venueRepository;

    private Long guestId;

    @Autowired
    public InvitationModel(InvitationRepository invitationRepository, UserRepository userRepository,
                           VenueRepository venueRepository) {
        this.invitationRepository = invitationRepository;
        this.userRepository = userRepository;
        this.venueRepository = venueRepository;
    }

    public String sendInvitation(Long userId, User guest) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return "User not found";
        }

        Venue venue = user.getReservedVenue();
        if (venue == null) {
            return "You have not reserved a venue yet";
        }

        Invitation invitation = new Invitation();
        invitation.setInvitationSender(user);
        invitation.setVenue(venue);
        invitation.setInvitationSender(user);

        guest.setRole(Role.ROLE_GUEST);
        guest.setInvitation(invitation);

        invitationRepository.save(invitation);

        userRepository.save(guest);

        guest.getInvitation().setStatus(Status.ACCEPTED);

        venue.getGuests().add(guest);
        venue.setCapacity(venue.getCapacity() - 1);

        venueRepository.save(venue);

        userRepository.save(guest);

        guestId = guest.getId();

        return "Invitation sent successfully";
    }

    public String acceptInvitation(Long guestId) {
        User guest = userRepository.findById(guestId).orElse(null);
        if (guest == null) return "Guest not found";

        if (!guest.getRole().equals(Role.ROLE_GUEST)) {
            return "You are not a guest";
        }
        guest.getInvitation().setStatus(Status.ACCEPTED);

        Venue venue = guest.getInvitation().getVenue();
        venue.getGuests().add(guest);
        venue.setCapacity(venue.getCapacity() - 1);

        venueRepository.save(venue);

        userRepository.save(guest);

        return "Guest accepted invitation";
    }

    public Long getGuestId(){
        return guestId;
    }
}
