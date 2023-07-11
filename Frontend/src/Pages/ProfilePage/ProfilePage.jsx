import { useState, useEffect } from "react";
import { api } from "../axios.js";
import jwtDecode from "jwt-decode";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBModal,
  MDBCardTitle,
  MDBSpinner,
  MDBIcon,
} from "mdb-react-ui-kit";

export default function ProfilePage() {
  const [user, setUser] = useState({});
  const [vendor, setVendor] = useState({});
  const [favoriteVenues, setFavoriteVenues] = useState([]);
  const [reservedVenue, setReservedVenue] = useState({});
  const [vendorVenues, setVendorVenues] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");
  const [firstName, setFirstName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalEvent, setShowModalEvent] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeURL, setQRCodeURL] = useState("");
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading
  const [loadingGuests, setLoadingGuests] = useState(true); // New state for loading
  const [users, setUsers] = useState([]);

  const history = useHistory();

  let role;
  let id;
  try {
    const token = localStorage.getItem("accessToken");
    const tokenData = jwtDecode(token);
    id = tokenData.id;
    role = tokenData.role;
  } catch (error) {
    console.log(error);
  }
  useEffect(() => {
    const fetchData = async () => {
      if (role === "ROLE_USER") {
        await api.get(`/user/getUser/${id}`).then((res) => {
          setUser(res.data);
          setFirstName(res.data.firstName);
          setFavoriteVenues(res.data.favoriteVenues);
          setReservedVenue(res.data.reservedVenue);
          setProfilePicture(res.data.profilePicture);
          setLoading(false); // Set loading to false after data is fetched
        });
      } else if (role === "ROLE_VENDOR") {
        await api.get(`/user/getUser/${id}`).then((vendorRes) => {
          setVendor(vendorRes.data);
          setVendorVenues(vendorRes.data.vendorVenues);
          setProfilePicture(vendorRes.data.profilePicture);
          setFirstName(vendorRes.data.firstName);
          setLoading(false); // Set loading to false after data is fetched
        });
      }
    };
    fetchData();
  }, [id, role]);

  const deleteEvent = async (eventId) => {
    const res = await api.delete(
      `/venue/deleteEvent/${reservedVenue.venueId}/${eventId}`
    );

    if (res.data === "Event deleted successfully") {
      window.alert("Event deleted successfully");
      window.location.reload();
    } else window.alert("Something went wrong");
  };

  const deleteVenue = async (venueId) => {
    const res = await api.delete(`/venue/deleteVenue/${venueId}/${id}`);

    if (res.data === "Venue deleted successfully") {
      window.alert("Venue deleted successfully");
      window.location.reload();
    } else window.alert("Something went wrong");
  };
  const removeFromFavorites = async (venueId) => {
    const res = await api.delete(`/user/removeFromFavorites/${id}/${venueId}`);

    if (res.data === "Venue removed from favorites") {
      window.alert("Venue removed from favorites");
      window.location.reload();
    } else window.alert("Something went wrong");
  };

  const cancelReservation = async (venueId) => {
    const res = await api.put(`/venue/cancelReservation/${venueId}/${id}`);

    if (res.data === "Venue reservation canceled successfully") {
      window.alert("Venue reservation canceled successfully");
      window.location.reload();
    } else window.alert("Something went wrong");
  };

  const fetchQrCode = async () => {
    const response = await axios.get(
      `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:3000/invitation/${id}`,
      { responseType: "arraybuffer" } // Specify responseType as 'arraybuffer'
    );

    const imageBlob = new Blob([response.data], { type: "image/png" });
    const imageURL = URL.createObjectURL(imageBlob);

    const qrCodeContainer = document.getElementById("qrCodeContainer");
    const imagePreviewElement = document.createElement("img");
    imagePreviewElement.src = imageURL;

    // Set CSS styles for centering the image
    imagePreviewElement.style.display = "block";
    imagePreviewElement.style.margin = "0 auto";
    imagePreviewElement.style.marginBottom = "150px";
    imagePreviewElement.style.marginTop = "150px";
    imagePreviewElement.style.width = "200px";

    qrCodeContainer.appendChild(imagePreviewElement);
    setQRCodeURL(imageURL);
    setShowQRCode(true);
  };

  const handleDownloadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeURL;
    link.download = "InvitationQR.png";
    link.click();
  };

  function handleAddEventClick(venueId) {
    history.push(`/AddEvent/${id}/${venueId}`);
    window.location.reload();
  }

  function handleUpdateClick() {
    history.push(`/UpdateUser`);
    window.location.reload();
  }
  function handleUpdateVenueClick(venueId) {
    history.push(`/UpdateVenue/${venueId}`);
    window.location.reload();
  }

  function handleUpdateEventClick(eventId) {
    history.push(`/UpdateEvent/${eventId}`);
    window.location.reload();
  }
  function handleSendInvitationClick() {
    setShowModal(true);
    fetchQrCode();
  }

  function handleModalClose() {
    setShowModal(false);
  }

  function handleEventClick() {
    setShowModalEvent(true);
    fetchQrCode();
  }

  function handleModalEventClose() {
    setShowModalEvent(false);
  }

  const createUserIcon = () => {
    const initials = firstName.charAt(0).toUpperCase();
    return (
      <div>
        <span
          style={{
            width: "150px",
            height: "150px",
            fontSize: "90px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#232323",
            color: "white",
            fontFamily: "IOS Glyph",
          }}
          fluid>
          {initials}
        </span>
      </div>
    );
  };

  const removeFromGuestList = async (id) => {
    const res = await api.delete(
      `venue/removeFromGuestList/${reservedVenue.venueId}/${id}`
    );

    if (res.data === "Guest removed successfully") {
      window.alert("Guest removed successfully");
      window.location.reload();
    } else window.alert("Something went wrong");
  };

  const deleteUser = async () => {
    const res = await api.delete(`user/deleteUser/${id}`);

    if (res.data === "User deleted successfully") {
      window.alert("User deleted successfully");
      history.push("/");
      localStorage.clear();
      window.location.reload();
    } else window.alert("Something went wrong");
  };

  const getGuestList = async (venueId) => {
    api.get(`/venue/getGuests/${venueId}`).then((venueRes) => {
      setGuests(venueRes.data);
      setLoadingGuests(false);
    });
  };

  return (
    <>
      {/* ////////////////////////////////////////// ROLE USER /////////////////////////////////////////////////////////////////////// */}
      {role === "ROLE_USER" && (
        <>
          <section style={{ backgroundColor: "#eee" }}>
            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px", // Adjust the height as needed
                  fontSize: "20px",
                  fontWeight: "bold",
                }}>
                <MDBSpinner role="status">
                  <span className="visually-hidden">Loading...</span>
                </MDBSpinner>
              </div>
            )}
            {!loading && (
              <>
                <MDBContainer className="py-5">
                  <MDBRow>
                    <MDBCol lg="4">
                      <MDBCard className="mb-4 .shadow-5">
                        <MDBCardBody className="text-center">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}>
                            {profilePicture ? (
                              // Display vendor profile image if available
                              <MDBCardImage
                                src={`data:image/jpeg;base64,${profilePicture}`}
                                alt="avatar"
                                className="rounded-circle"
                                style={{ width: "150px", height: "150px" }}
                                fluid
                              />
                            ) : (
                              <>
                                <div>{user && createUserIcon()}</div>
                              </>
                            )}
                          </div>

                          <br />
                          <label>Username:</label>
                          <p className="text-muted mb-1">
                            {user.username}
                            {(e) =>
                              setUser({ ...user, userName: e.target.value })
                            }
                          </p>
                          <label>Role:</label>
                          <p className="text-muted mb-4">
                            {user.role}
                            {(e) => setUser({ ...user, role: e.target.value })}
                          </p>
                          <MDBBtn
                            color="secondary"
                            className="btn btn-primary btn-m"
                            onClick={handleUpdateClick}>
                            Update user
                          </MDBBtn>
                          <MDBBtn
                            color="danger"
                            className="btn btn-primary btn-m"
                            onClick={() => {
                              const confirmed = window.confirm(
                                "Are you sure you want to delete your account?"
                              );
                              if (confirmed) {
                                deleteUser();
                              }
                            }}
                            style={{ marginLeft: "1rem" }}>
                            Delete My account
                          </MDBBtn>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                    <MDBCol lg="8">
                      <p style={{ marginBottom: "10px", fontSize: "20px" }}>
                        <b>User details:</b>
                      </p>
                      <MDBCard className="mb-4">
                        <MDBCardBody>
                          <MDBRow>
                            <MDBCol sm="3">
                              <MDBCardText>First name</MDBCardText>
                            </MDBCol>
                            <MDBCol sm="9">
                              <MDBCardText className="text-muted">
                                {user.firstName}
                                {(e) =>
                                  setUser({
                                    ...user,
                                    firstName: e.target.value,
                                  })
                                }
                              </MDBCardText>
                            </MDBCol>
                          </MDBRow>
                          <hr />

                          <MDBRow>
                            <MDBCol sm="3">
                              <MDBCardText>Last name</MDBCardText>
                            </MDBCol>
                            <MDBCol sm="9">
                              <MDBCardText className="text-muted">
                                {user.lastName}
                                {(e) =>
                                  setUser({ ...user, lastName: e.target.value })
                                }
                              </MDBCardText>
                            </MDBCol>
                          </MDBRow>
                          <hr />

                          <MDBRow>
                            <MDBCol sm="3">
                              <MDBCardText>Full name</MDBCardText>
                            </MDBCol>
                            <MDBCol sm="9">
                              <MDBCardText className="text-muted">
                                {user.firstName}
                                {(e) =>
                                  setUser({
                                    ...user,
                                    firstName: e.target.value,
                                  })
                                }
                                &nbsp;
                                {user.lastName}
                                {(e) =>
                                  setUser({ ...user, lastName: e.target.value })
                                }
                              </MDBCardText>
                            </MDBCol>
                          </MDBRow>
                          <hr />

                          <MDBRow>
                            <MDBCol sm="3">
                              <MDBCardText>Email</MDBCardText>
                            </MDBCol>
                            <MDBCol sm="9">
                              <MDBCardText className="text-muted">
                                {user.email}
                                {(e) =>
                                  setUser({ ...user, email: e.target.value })
                                }
                              </MDBCardText>
                            </MDBCol>
                          </MDBRow>
                          <hr />

                          <MDBRow>
                            <MDBCol sm="3">
                              <MDBCardText>Mobile</MDBCardText>
                            </MDBCol>
                            <MDBCol sm="9">
                              <MDBCardText className="text-muted">
                                {user.phoneNumber}
                                {(e) =>
                                  setUser({
                                    ...user,
                                    phoneNumber: e.target.value,
                                  })
                                }
                              </MDBCardText>
                            </MDBCol>
                          </MDBRow>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                  {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                  <MDBRow>
                    <MDBCol lg="8">
                      <h6>Favorite Venues:</h6>
                      <MDBCard className="mb-4">
                        <MDBCardBody>
                          <MDBRow>
                            <MDBTable responsive hover>
                              <MDBTableHead>
                                <tr>
                                  <th scope="col">venue Id</th>
                                  <th scope="col">Venue name</th>
                                  <th scope="col">Venue address</th>
                                  <th scope="col">Phone number</th>
                                  <th scope="col">Capacity</th>
                                  <th scope="col">Price</th>
                                  <th scope="col">Rating</th>
                                  <th scope="col">Type</th>
                                  <th scope="col">Owner</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </MDBTableHead>
                              <MDBTableBody>
                                {favoriteVenues &&
                                  favoriteVenues.map((favoriteVenue, index) => (
                                    <tr key={index}>
                                      <th scope="row">{index + 1}</th>
                                      <td>{favoriteVenue.venueName}</td>
                                      <td>{favoriteVenue.address}</td>
                                      <td>{favoriteVenue.phone}</td>
                                      <td>{favoriteVenue.capacity}</td>
                                      <td>{favoriteVenue.venuePrice}</td>
                                      <td>{favoriteVenue.rating}</td>
                                      <td>{favoriteVenue.venueType}</td>
                                      <td>{favoriteVenue.vendorName}</td>
                                      <td>
                                        <MDBBtn
                                          className="me-1"
                                          color="danger"
                                          onClick={() =>
                                            removeFromFavorites(
                                              favoriteVenue.venueId
                                            )
                                          }>
                                          <MDBIcon fas icon="minus-circle" />
                                        </MDBBtn>
                                      </td>
                                    </tr>
                                  ))}
                              </MDBTableBody>
                            </MDBTable>
                          </MDBRow>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                  {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                  <MDBRow>
                    <MDBCol>
                      <h6>Reserved Venue:</h6>
                      <MDBCard className="mb-4">
                        <MDBCardBody>
                          <MDBRow>
                            <MDBTable responsive hover>
                              <MDBTableHead>
                                <tr>
                                  <th scope="col">Venue name</th>
                                  <th scope="col">Venue address</th>
                                  <th scope="col">Phone number</th>
                                  <th scope="col">Capacity</th>
                                  <th scope="col">Price</th>
                                  <th scope="col">Rating</th>
                                  <th scope="col">Type</th>
                                  <th scope="col">Owner</th>
                                  <th scope="col">Action</th>
                                </tr>
                              </MDBTableHead>
                              <MDBTableBody>
                                {reservedVenue && (
                                  <tr>
                                    <td>{reservedVenue.venueName}</td>
                                    <td>{reservedVenue.address}</td>
                                    <td>{reservedVenue.phone}</td>
                                    <td>{reservedVenue.capacity}</td>
                                    <td>{reservedVenue.venuePrice}</td>
                                    <td>{reservedVenue.rating}</td>
                                    <td>{reservedVenue.venueType}</td>
                                    <td>{reservedVenue.vendorName}</td>
                                    <td>
                                      <MDBBtn
                                        style={{
                                          marginRight: "10px",
                                        }}
                                        onClick={handleSendInvitationClick}>
                                        Send invitation
                                      </MDBBtn>
                                      <MDBModal
                                        show={showModal}
                                        onHide={handleModalClose}>
                                        <MDBCard
                                          style={{
                                            maxWidth: "600px",
                                            margin: "0 auto",
                                            marginTop: "100px",
                                          }}>
                                          <MDBCardBody id="qrCodeContainer"></MDBCardBody>

                                          <MDBBtn
                                            color="primary"
                                            style={{
                                              position: "absolute",
                                              bottom: "10px",
                                              right: "10px",
                                              marginRight: "5rem",
                                            }}
                                            onClick={() => {
                                              handleDownloadQRCode();
                                            }}>
                                            Download
                                          </MDBBtn>

                                          <MDBBtn
                                            color="secondary"
                                            onClick={handleModalClose}
                                            style={{
                                              position: "absolute",
                                              bottom: "10px",
                                              right: "10px",
                                            }}>
                                            Close
                                          </MDBBtn>
                                        </MDBCard>
                                      </MDBModal>

                                      {/* ////////////////////////////////////USER EVENT//////////////////////////////////////////////// */}
                                      <MDBBtn
                                        className="me-1"
                                        color="secondary"
                                        style={{ marginRight: "15px" }}
                                        onClick={() => {
                                          // handleAddEventClick(reservedVenue.venueId)
                                          handleEventClick();
                                          getGuestList(reservedVenue.venueId);
                                        }}>
                                        More details
                                      </MDBBtn>

                                      <MDBModal
                                        show={showModalEvent}
                                        onHide={handleModalEventClose}>
                                        <MDBCard
                                          style={{
                                            maxWidth: "80rem",
                                            margin: "0 auto",
                                            marginTop: "100px",
                                          }}>
                                          <MDBCardBody>
                                            <h6>User Events:</h6>
                                            <MDBRow>
                                              <MDBTable>
                                                <MDBTableHead>
                                                  <tr>
                                                    <th scope="col">
                                                      Event Id
                                                    </th>
                                                    <th scope="col">Venue</th>
                                                    <th scope="col">
                                                      Event date
                                                    </th>
                                                    <th scope="col">
                                                      Start time
                                                    </th>
                                                    <th scope="col">
                                                      End time
                                                    </th>
                                                    <th scope="col">
                                                      Servings
                                                    </th>
                                                    <th scope="col">Action</th>
                                                  </tr>
                                                </MDBTableHead>
                                                {reservedVenue.event && (
                                                  <MDBTableBody>
                                                    <tr>
                                                      <th scope="row">{1}</th>
                                                      <td>
                                                        {
                                                          reservedVenue.venueName
                                                        }
                                                      </td>
                                                      <td>
                                                        {
                                                          reservedVenue.event
                                                            .eventDate
                                                        }
                                                      </td>
                                                      <td>
                                                        {
                                                          reservedVenue.event
                                                            .eventStartTime
                                                        }
                                                      </td>
                                                      <td>
                                                        {
                                                          reservedVenue.event
                                                            .eventEndTime
                                                        }
                                                      </td>
                                                      <td>
                                                        {
                                                          reservedVenue.event
                                                            .servings
                                                        }
                                                      </td>
                                                      <td>
                                                        <MDBBtn
                                                          className="me-1"
                                                          color="success"
                                                          onClick={() =>
                                                            handleUpdateEventClick(
                                                              reservedVenue
                                                                .event.id
                                                            )
                                                          }>
                                                          Update event
                                                        </MDBBtn>
                                                      </td>
                                                    </tr>
                                                  </MDBTableBody>
                                                )}
                                              </MDBTable>
                                            </MDBRow>
                                            <h6>User guest list:</h6>
                                            <MDBRow>
                                              <MDBTable>
                                                <MDBTableHead>
                                                  <tr>
                                                    <th scope="col">
                                                      Guest Id
                                                    </th>
                                                    <th scope="col">
                                                      First name
                                                    </th>
                                                    <th scope="col">
                                                      Last name
                                                    </th>
                                                    <th scope="col">
                                                      Phone number
                                                    </th>
                                                    <th scope="col">Email</th>
                                                    <th scope="col">Action</th>
                                                  </tr>
                                                </MDBTableHead>
                                                <MDBTableBody>
                                                  {loadingGuests && (
                                                    <div
                                                      style={{
                                                        display: "flex",
                                                        justifyContent:
                                                          "center",
                                                        alignItems: "center",
                                                        height: "200px", // Adjust the height as needed
                                                        fontSize: "20px",
                                                        fontWeight: "bold",
                                                      }}>
                                                      <MDBSpinner role="status">
                                                        <span className="visually-hidden">
                                                          Loading...
                                                        </span>
                                                      </MDBSpinner>
                                                    </div>
                                                  )}
                                                  {!loadingGuests && (
                                                    <>
                                                      {guests ? (
                                                        guests &&
                                                        guests.map(
                                                          (
                                                            guest,
                                                            guestIndex
                                                          ) => (
                                                            <tr
                                                              key={guestIndex}>
                                                              <th scope="row">
                                                                {guestIndex + 1}
                                                              </th>
                                                              <td>
                                                                {
                                                                  guest.firstName
                                                                }
                                                              </td>
                                                              <td>
                                                                {guest.lastName}
                                                              </td>
                                                              <td>
                                                                {
                                                                  guest.phoneNumber
                                                                }
                                                              </td>
                                                              <td>
                                                                {guest.email}
                                                              </td>
                                                              <td>
                                                                <MDBBtn
                                                                  className="me-1"
                                                                  color="danger"
                                                                  onClick={() =>
                                                                    removeFromGuestList(
                                                                      guest.id
                                                                    )
                                                                  }>
                                                                  <MDBIcon
                                                                    fas
                                                                    icon="minus-circle"
                                                                  />
                                                                </MDBBtn>
                                                              </td>
                                                            </tr>
                                                          )
                                                        )
                                                      ) : (
                                                        <tr>
                                                          <td colSpan="6">
                                                            No guests found
                                                          </td>
                                                        </tr>
                                                      )}
                                                    </>
                                                  )}
                                                </MDBTableBody>
                                              </MDBTable>
                                            </MDBRow>
                                          </MDBCardBody>
                                          <br />
                                          <MDBBtn
                                            color="secondary"
                                            onClick={handleModalEventClose}
                                            style={{
                                              position: "absolute",
                                              bottom: "10px",
                                              right: "10px",
                                            }}>
                                            Close
                                          </MDBBtn>
                                        </MDBCard>
                                      </MDBModal>

                                      <MDBBtn
                                        className="me-1"
                                        color="danger"
                                        onClick={() => {
                                          const confirmed = window.confirm(
                                            "Are you sure you want to cancel reservation?"
                                          );
                                          if (confirmed) {
                                            cancelReservation(
                                              reservedVenue.venueId
                                            );
                                          }
                                        }}>
                                        <MDBIcon fas icon="ban" />
                                      </MDBBtn>
                                    </td>
                                  </tr>
                                )}
                              </MDBTableBody>
                            </MDBTable>
                          </MDBRow>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                </MDBContainer>
              </>
            )}
          </section>
        </>
      )}
      {/* ////////////////////////////////////////// ROLE VENDOR /////////////////////////////////////////////////////////////////////// */}
      {role === "ROLE_VENDOR" && (
        <section style={{ backgroundColor: "#eee" }}>
          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px", // Adjust the height as needed
                fontSize: "20px",
                fontWeight: "bold",
              }}>
              <MDBSpinner role="status">
                <span className="visually-hidden">Loading...</span>
              </MDBSpinner>
            </div>
          )}
          {!loading && (
            <>
              <MDBContainer className="py-5">
                <MDBRow>
                  <MDBCol lg="4">
                    <MDBCard className="mb-4">
                      <MDBCardBody className="text-center">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}>
                          {vendor.profilePicture ? (
                            // Display vendor profile image if available
                            <MDBCardImage
                              src={`data:image/jpeg;base64,${vendor.profilePicture}`}
                              alt="avatar"
                              className="rounded-circle"
                              style={{ width: "20rem" }}
                              fluid
                            />
                          ) : (
                            <div>{vendor && createUserIcon()}</div>
                          )}
                        </div>
                        <br />
                        <label>Username:</label>
                        <MDBCardText className="text-muted mb-1">
                          {vendor.username}
                          {(e) =>
                            setVendor({ ...vendor, userName: e.target.value })
                          }
                        </MDBCardText>
                        <label>Role:</label>
                        <MDBCardText className="text-muted mb-4">
                          {vendor.role}
                          {(e) =>
                            setVendor({ ...vendor, role: e.target.value })
                          }
                        </MDBCardText>

                        <MDBBtn
                          color="secondary"
                          className="btn btn-primary btn-m"
                          onClick={handleUpdateClick}>
                          Update user
                        </MDBBtn>
                        <MDBBtn
                          color="danger"
                          className="btn btn-primary btn-m"
                          onClick={() => {
                            const confirmed = window.confirm(
                              "Are you sure you want to delete your account?"
                            );
                            if (confirmed) {
                              deleteUser();
                            }
                          }}
                          style={{ marginLeft: "1rem" }}>
                          Delete My account
                        </MDBBtn>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                  <MDBCol lg="8">
                    <MDBCardTitle>Vendor details:</MDBCardTitle>
                    <MDBCard className="mb-4">
                      <MDBCardBody>
                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>First name</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9">
                            <MDBCardText className="text-muted">
                              {vendor.firstName}
                              {(e) =>
                                setVendor({
                                  ...vendor,
                                  firstName: e.target.value,
                                })
                              }
                            </MDBCardText>
                          </MDBCol>
                        </MDBRow>
                        <hr />

                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Last name</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9">
                            <MDBCardText className="text-muted">
                              {vendor.lastName}
                              {(e) =>
                                setVendor({
                                  ...vendor,
                                  lastName: e.target.value,
                                })
                              }
                            </MDBCardText>
                          </MDBCol>
                        </MDBRow>
                        <hr />

                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Full name</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9">
                            <MDBCardText className="text-muted">
                              {vendor.firstName}
                              {(e) =>
                                setVendor({
                                  ...vendor,
                                  firstName: e.target.value,
                                })
                              }
                              &nbsp;
                              {vendor.lastName}
                              {(e) =>
                                setVendor({
                                  ...vendor,
                                  lastName: e.target.value,
                                })
                              }
                            </MDBCardText>
                          </MDBCol>
                        </MDBRow>
                        <hr />

                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Email</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9">
                            <MDBCardText className="text-muted">
                              {vendor.email}
                              {(e) =>
                                setVendor({ ...vendor, email: e.target.value })
                              }
                            </MDBCardText>
                          </MDBCol>
                        </MDBRow>
                        <hr />

                        <MDBRow>
                          <MDBCol sm="3">
                            <MDBCardText>Mobile</MDBCardText>
                          </MDBCol>
                          <MDBCol sm="9">
                            <MDBCardText className="text-muted">
                              {vendor.phoneNumber}
                              {(e) =>
                                setVendor({
                                  ...vendor,
                                  phoneNumber: e.target.value,
                                })
                              }
                            </MDBCardText>
                          </MDBCol>
                        </MDBRow>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBRow>
                {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                <MDBRow>
                  <MDBCol>
                    <MDBCardTitle>Vendor Venues:</MDBCardTitle>
                    <MDBCard className="mb-4">
                      <MDBCardBody>
                        <MDBTable responsive hover>
                          <MDBTableHead>
                            <tr>
                              <th scope="col">venue Id</th>
                              <th scope="col">Venue name</th>
                              <th scope="col">Venue address</th>
                              <th scope="col">Phone number</th>
                              <th scope="col">Capacity</th>
                              <th scope="col">Price</th>
                              <th scope="col">Rating</th>
                              <th scope="col">Type</th>
                              <th scope="col">Reserved</th>
                              <th scope="col">Actions</th>
                            </tr>
                          </MDBTableHead>
                          <MDBTableBody>
                            {vendorVenues &&
                              vendorVenues.map((vendorVenue, index) => (
                                <tr key={vendorVenue.venueId}>
                                  <th scope="row">{index + 1}</th>
                                  <td>{vendorVenue.venueName}</td>
                                  <td>{vendorVenue.address}</td>
                                  <td>{vendorVenue.phone}</td>
                                  <td>{vendorVenue.capacity}</td>
                                  <td>{vendorVenue.venuePrice}</td>
                                  <td>{vendorVenue.rating}</td>
                                  <td>{vendorVenue.venueType}</td>
                                  <td>{vendorVenue.reserved ? "yes" : "no"}</td>

                                  <td>
                                    <MDBBtn
                                      className="me-1"
                                      color="success"
                                      style={{ marginRight: "10px" }}
                                      onClick={() =>
                                        handleUpdateVenueClick(
                                          vendorVenue.venueId
                                        )
                                      }>
                                      Update
                                    </MDBBtn>
                                    <MDBBtn
                                      className="me-1"
                                      color="danger"
                                      onClick={() => {
                                        const confirmed = window.confirm(
                                          "Are you sure you want to delete venue?"
                                        );
                                        if (confirmed) {
                                          deleteVenue(vendorVenue.venueId);
                                        }
                                      }}>
                                      <MDBIcon fas icon="minus-circle" />
                                    </MDBBtn>
                                  </td>
                                </tr>
                              ))}
                          </MDBTableBody>
                        </MDBTable>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </>
          )}
        </section>
      )}
    </>
  );
}
// export default ProfilePage;
