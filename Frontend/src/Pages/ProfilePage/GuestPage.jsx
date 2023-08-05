import { useState, useEffect } from "react";
import { api } from "../axios.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
} from "mdb-react-ui-kit";

export default function GuestPage() {
  const [user, setUser] = useState({});
  const [firstName, setFirstName] = useState("");
  const [role, setRole] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const backendBaseUrl =
        process.env.BACKEND_BASE_URL || "http://localhost:8080/api/v1";

      await axios.get(backendBaseUrl + `/user/getGuest/${id}`).then((res) => {
        setUser(res.data);
        setFirstName(res.data.firstName);
        setRole(res.data.role);
      });
    };
    fetchData();
  }, []);

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

  return (
    <>
      <section style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5">
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4">
                <MDBCardBody className="text-center">
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <>
                      <div>{user && createUserIcon()}</div>
                    </>
                  </div>

                  <br />
                  <label>Username:</label>
                  <p className="text-muted mb-1">
                    {user.username}
                    {(e) => setUser({ ...user, userName: e.target.value })}
                  </p>
                  <label>Role:</label>
                  <p className="text-muted mb-4">{role}</p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="8">
              <p style={{ marginBottom: "10px", fontSize: "20px" }}>
                <b>Guest details:</b>
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
                        {(e) => setUser({ ...user, firstName: e.target.value })}
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
                        {(e) => setUser({ ...user, lastName: e.target.value })}
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
                        {(e) => setUser({ ...user, firstName: e.target.value })}
                        &nbsp;
                        {user.lastName}
                        {(e) => setUser({ ...user, lastName: e.target.value })}
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

                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Mobile</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        {user.phoneNumber}
                        {(e) =>
                          setUser({ ...user, phoneNumber: e.target.value })
                        }
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </>
  );
}
