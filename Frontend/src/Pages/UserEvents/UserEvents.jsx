import { useState, useEffect } from "react";
import { api } from "../axios.js";
import jwtDecode from "jwt-decode";
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

const UserEvents = () => {
  const [user, setUser] = useState({});
  const [reservedVenue, setReservedVenue] = useState("");
  const [event, setEvent] = useState("");

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
      setUser(res.data);
      setReservedVenue(res.data.reservedVenue);
      setEvent(res.data.reservedVenue.event);
    });
  }, []);

  const deleteEvent = async () => {
    const res = await api.delete(
      `/venue/deleteEvent/${reservedVenue.venueId}/${event.id}`
    );

    if (res.data === "Event deleted successfully") {
      window.alert("Event deleted successfully");
      window.location.reload();
    } else window.alert("Something went wrong");
  };

  console.log(event);
  return (
    <>
      <h6>User Events:</h6>
      <MDBCard className="mb-4">
        <MDBCardBody>
          <MDBRow>
            {" "}
            <MDBTable>
              <MDBTableHead>
                <tr>
                  <th scope="col">Event Id</th>
                  <th scope="col">Venue</th>
                  <th scope="col">Event Type</th>
                  <th scope="col">Event date</th>
                  <th scope="col">Start time</th>
                  <th scope="col">End time</th>
                  <th scope="col">Servings</th>
                  <th scope="col">Action</th>
                </tr>
              </MDBTableHead>
              {event && (
                <MDBTableBody>
                  <tr>
                    <th scope="row">{event.id}</th>
                    <td>{reservedVenue.venueName}</td>
                    <td>{event.eventType}</td>
                    <td>{event.eventDate}</td>
                    <td>{event.eventStartTime}</td>
                    <td>{event.eventEndTime}</td>
                    <td>{event.servings}</td>
                    <td>
                      <MDBBtn
                        className="me-1"
                        color="primary"
                        onClick={() => deleteEvent()}>
                        Update event
                      </MDBBtn>
                      <MDBBtn
                        className="me-1"
                        color="danger"
                        onClick={() => deleteEvent()}>
                        Cancel event
                      </MDBBtn>
                    </td>
                  </tr>
                </MDBTableBody>
              )}
            </MDBTable>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </>
  );
};
export default UserEvents;
