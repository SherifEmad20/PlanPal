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

export default function AdminDashboard() {
  const [user, setUser] = useState({});
  const [venues, setVenues] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");
  const [firstName, setFirstName] = useState("");
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true); // New state for loading
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);

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
      await api.get(`/user/getUser/${id}`).then((res) => {
        setUser(res.data);
        setFirstName(res.data.firstName);
        setLoading(false); // Set loading to false after data is fetched
      });
    };

    const getVenues = async () => {
      const backendBaseUrl =
        process.env.BACKEND_BASE_URL || "http://localhost:8080/api/v1";

      await axios.get(backendBaseUrl + "/venue/getAllVenues").then((res) => {
        setVenues(res.data);
      });
    };

    const getAll = async () => {
      await api.get(`/user/getAllUsers`).then((res) => {
        const { data } = res;
        const fetchedUsers = data.filter((user) => user.role === "ROLE_USER");
        const fetchedVendors = data.filter(
          (user) => user.role === "ROLE_VENDOR"
        );
        const fetchedGuests = data.filter((user) => user.role === "ROLE_GUEST");

        setUsers(fetchedUsers);
        setVendors(fetchedVendors);
        setGuests(fetchedGuests);
      });
    };
    fetchData();
    getAll();
    getVenues();
  }, [id, role]);

  console.log(users);
  console.log(vendors);
  console.log(guests);
  console.log(venues);

  function handleUpdateClick() {
    history.push(`/UpdateUser`);
    window.location.reload();
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
          fluid
        >
          {initials}
        </span>
      </div>
    );
  };
  const deleteMyAccount = async () => {
    const res = await api.delete(`user/deleteUser/${id}`);

    if (res.data === "User deleted successfully") {
      window.alert("User deleted successfully");
      window.location.reload();
    } else window.alert("Something went wrong");
  };

  const deleteUser = async (UID) => {
    const res = await api.delete(`user/deleteUser/${UID}`);

    if (res.data === "User deleted successfully") {
      window.alert("User deleted successfully");
      window.location.reload();
    } else window.alert("Something went wrong");
  };

  const deleteVenue = async (venueId, vendorId) => {
    const res = await api.delete(`/venue/deleteVenue/${venueId}/${vendorId}`);

    if (res.data === "Venue deleted successfully") {
      window.alert("Venue deleted successfully");
      window.location.reload();
    } else window.alert("Something went wrong");
  };

  return (
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
            }}
          >
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
                        }}
                      >
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
                        {(e) => setUser({ ...user, userName: e.target.value })}
                      </p>
                      <label>Role:</label>
                      <p className="text-muted mb-4">
                        {user.role}
                        {(e) => setUser({ ...user, role: e.target.value })}
                      </p>
                      {/* <MDBBtn
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
                            deleteMyAccount();
                          }
                        }}
                        style={{ marginLeft: "1rem" }}>
                        Delete My account
                      </MDBBtn> */}
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
                        <hr />
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
                            {(e) => setUser({ ...user, email: e.target.value })}
                          </MDBCardText>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
              {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              <MDBRow>
                <MDBCol>
                  <MDBCardTitle>Users:</MDBCardTitle>
                  <MDBCard className="mb-4">
                    <MDBCardBody
                      style={{
                        height: "25rem",
                        overflowX: "scroll",
                        overflowY: "scroll",
                      }}
                    >
                      <MDBTable responsive hover>
                        <MDBTableHead>
                          <tr>
                            <th scope="col">User Id</th>
                            <th scope="col">First name</th>
                            <th scope="col">Last name</th>
                            <th scope="col">Phone number</th>
                            <th scope="col">Email</th>
                            <th scope="col">Role</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                          {vendors &&
                            vendors.map((vendor, index) => (
                              <tr key={vendor.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{vendor.firstName}</td>
                                <td>{vendor.lastName}</td>
                                <td>{vendor.phoneNumber}</td>
                                <td>{vendor.email}</td>
                                <td>{vendor.role}</td>
                                <td>
                                  <MDBBtn
                                    className="me-1"
                                    color="danger"
                                    onClick={() => {
                                      const confirmed = window.confirm(
                                        "Are you sure you want to remove user?"
                                      );
                                      if (confirmed) {
                                        deleteUser(vendor.id);
                                      }
                                    }}
                                  >
                                    <MDBIcon fas icon="minus-circle" />
                                  </MDBBtn>
                                </td>
                              </tr>
                            ))}
                          {users &&
                            users.map((user, index) => (
                              <tr key={user.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                  <MDBBtn
                                    className="me-1"
                                    color="danger"
                                    onClick={() => {
                                      const confirmed = window.confirm(
                                        "Are you sure you want to remove user?"
                                      );
                                      if (confirmed) {
                                        deleteUser(user.id);
                                      }
                                    }}
                                  >
                                    <MDBIcon fas icon="minus-circle" />
                                  </MDBBtn>
                                </td>
                              </tr>
                            ))}
                          {guests &&
                            guests.map((guest, index) => (
                              <tr key={guest.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{guest.firstName}</td>
                                <td>{guest.lastName}</td>
                                <td>{guest.phoneNumber}</td>
                                <td>{guest.email}</td>
                                <td>{guest.role}</td>
                                <td>
                                  <MDBBtn
                                    className="me-1"
                                    color="danger"
                                    onClick={() => {
                                      const confirmed = window.confirm(
                                        "Are you sure you want to remove user?"
                                      );
                                      if (confirmed) {
                                        deleteUser(guest.id);
                                      }
                                    }}
                                  >
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
              {/* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
              <MDBRow>
                <MDBCol>
                  <MDBCardTitle>Venues:</MDBCardTitle>
                  <MDBCard className="mb-4">
                    <MDBCardBody
                      style={{
                        height: "25rem",
                        overflowX: "scroll",
                        overflowY: "scroll",
                      }}
                    >
                      <MDBTable responsive hover>
                        <MDBTableHead>
                          <tr>
                            <th scope="col">venue Id</th>
                            <th scope="col">Venue name</th>
                            <th scope="col">Venue Owner</th>
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
                          {venues &&
                            venues.map((venue, index) => (
                              <tr key={venue.venueId}>
                                <th scope="row">{index + 1}</th>
                                <td>{venue.venueName}</td>
                                <td>{venue.vendorName}</td>
                                <td>{venue.address}</td>
                                <td>{venue.phone}</td>
                                <td>{venue.capacity}</td>
                                <td>{venue.venuePrice}</td>
                                <td>{venue.rating}</td>
                                <td>{venue.venueType}</td>
                                <td>{venue.reserved ? "yes" : "no"}</td>
                                <td>
                                  <MDBBtn
                                    className="me-1"
                                    color="danger"
                                    onClick={() => {
                                      const confirmed = window.confirm(
                                        "Are you sure you want to delete venue?"
                                      );
                                      if (confirmed) {
                                        deleteVenue(
                                          venue.venueId,
                                          venue.vendorId
                                        );
                                      }
                                    }}
                                  >
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
    </>
  );
}
