import { useState, useEffect } from "react";
import { api } from "../axios.js";
import jwtDecode from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

import {
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
} from "mdb-react-ui-kit";

const GuestList = () => {
  const [guests, setGuests] = useState([]);
  const [reservedVenue, setReservedVenue] = useState({});

  let ID;

  try {
    const token = localStorage.getItem("accessToken");
    const tokenData = jwtDecode(token);
    ID = tokenData.id;
  } catch (error) {
    console.log(error);
  }
  useEffect(() => {
    api.get(`/user/getUser/${ID}`).then((res) => {
      setReservedVenue(res.data.reservedVenue);
      const venueId = res.data.reservedVenue.venueId; // Set the venue ID from the first request
      console.log(venueId);
      api.get(`/venue/getGuests/${venueId}`).then((venueRes) => {
        setGuests(venueRes.data);
      });
    });
  }, []);

  const removeFromGuestList = async (id) => {
    const res = await api.delete(
      `venue/removeFromGuestList/${reservedVenue.venueId}/${id}`
    );

    if (res.data === "Guest removed successfully") {
      window.alert("Guest removed successfully");
      window.location.reload();
    } else window.alert("Something went wrong");
  };

  return (
    <>
      <h6>Guest list:</h6>
      <MDBCard className="mb-4">
        <MDBCardBody>
          <MDBRow>
            <MDBTable>
              <MDBTableHead>
                <tr>
                  <th scope="col">Guest Id</th>
                  <th scope="col">First name</th>
                  <th scope="col">Last name</th>
                  <th scope="col">Phone number</th>
                  <th scope="col">Email</th>
                  <th scope="col">Action</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {guests &&
                  guests.map((guest, guestIndex) => (
                    <tr key={guestIndex}>
                      <th scope="row">{guestIndex + 1}</th>
                      <td>{guest.firstName}</td>
                      <td>{guest.lastName}</td>
                      <td>{guest.phoneNumber}</td>
                      <td>{guest.email}</td>
                      <td>
                        <MDBBtn
                          className="me-1"
                          color="danger"
                          onClick={() => removeFromGuestList(guest.id)}
                        >
                          Remove from list
                        </MDBBtn>
                      </td>
                    </tr>
                  ))}
              </MDBTableBody>
            </MDBTable>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </>
  );
};

export default GuestList;
