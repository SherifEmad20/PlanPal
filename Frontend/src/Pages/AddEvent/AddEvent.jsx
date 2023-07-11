import React, { useState } from "react";
import jwtDecode from "jwt-decode";
import { api } from "../axios";
import { useHistory, useParams, useLocation } from "react-router-dom";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

import {
  MDBInput,
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTextArea,
} from "mdb-react-ui-kit";

const AddEvent = () => {
  const [eventType, setEventType] = useState("");
  const [eventDate, setDate] = useState("");
  const [eventStartTime, setStartTime] = useState("");
  const [eventEndTime, setEndTime] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [servings, setServings] = useState("");

  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const reservedDate = queryParams.get("eventDate");

  const reservedDate = localStorage.getItem("eventDate");

  console.log(reservedDate);

  const { venueId } = useParams();
  const history = useHistory();

  let ID;
  try {
    const token = localStorage.getItem("accessToken");
    const tokenData = jwtDecode(token);
    ID = tokenData.id;
  } catch (error) {
    console.log(error);
  }
  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
  };
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    if (selectedDate === reservedDate) {
      window.alert("Venue is reserved on this date");
      window.location.reload();
    } else {
      e.target.removeAttribute("disabled");
    }
  };
  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };
  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setEventDescription(e.target.value);
  };
  const handleServingsChange = (e) => {
    setServings(e.target.value);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post(`/venue/addEvent/${ID}/${venueId}`, {
        eventType: eventType,
        eventDate: eventDate,
        eventStartTime: eventStartTime,
        eventEndTime: eventEndTime,
        eventDescription: eventDescription,
        servings: servings,
      });

      if (res.data === "Event added successfully") {
        await api.put(`/venue/reserveVenue/${venueId}/${ID}`);
        window.alert("Venue reserved successfully");
        history.push("/ProfilePage");
      } else window.alert("Vendor cannot reserve venues");

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <MDBContainer
        className="my-5 gradient-form"
        style={{ marginTop: "5rem", marginBottom: "5rem" }}>
        <MDBRow>
          <MDBCol col="6" className="mb-5">
            <label>Event Date:</label>
            <MDBInput
              required
              value={eventDate}
              onChange={handleDateChange}
              type="date"
            />
          </MDBCol>

          {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <MDBCol col="6" className="mb-5">
            <label>Starts at:</label>
            <MDBInput required onChange={handleStartTimeChange} type="time" />
          </MDBCol>

          {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <MDBCol col="6" className="mb-5">
            <label>Ends at:</label>
            <MDBInput required onChange={handleEndTimeChange} type="time" />
          </MDBCol>
        </MDBRow>

        {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}

        <MDBRow>
          {/* <MDBCol col="6" className="mb-5">
          <label htmlFor="options" style={{ marginLeft: "1rem" }}>
              {" "}
              Choose Event type:
            </label>
            <br />
            <select
              className="Items"
              value={venueType}
              onChange={handleTypeChange}
              style={{ marginBottom: "50px", marginLeft: "1rem" }}>
              <option value="Choose venue type" defaultChecked>
                select Type:
              </option>
              <option value="Wedding">Weddings</option>
              <option value="Birthday">Birthdays</option>
              <option value="CorporateEvent">Corporate event</option>
              <option value="Sports">Sports</option>
              <option value="Parties">Parties</option>
            </select>
          </MDBCol> */}

          {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <MDBCol col="6" className="mb-5">
            <label>Event servings:</label>
            <MDBInput required onChange={handleServingsChange} />
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <label>Description:</label>
          <MDBTextArea required onChange={handleDescriptionChange} rows={4} />
        </MDBRow>
        <br />
        <MDBBtn
          type="submit"
          onClick={handleSubmit}
          style={{
            backgroundColor: "#FFCB74",
            color: "#111111",
            border: "none",
          }}>
          Add Event
        </MDBBtn>
      </MDBContainer>
    </>
  );
};

export default AddEvent;
