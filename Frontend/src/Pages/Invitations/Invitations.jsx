import React, { useState } from "react";
import jwtDecode from "jwt-decode";
import { api } from "../axios";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import validator from "validator";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ImageBody from "../../Images/PlanPal.png";

import {
  MDBInput,
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBCard,
  MDBCardTitle,
  MDBCardBody,
  MDBCardHeader,
  MDBCardText,
  MDBCardFooter,
} from "mdb-react-ui-kit";

const Invitations = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [guestId, setGuestId] = useState(0);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeURL, setQRCodeURL] = useState("");
  const [errors, setErrors] = useState({});

  const history = useHistory();

  let ID;
  try {
    const token = localStorage.getItem("accessToken");
    const tokenData = jwtDecode(token);
    ID = tokenData.id;
  } catch (error) {
    console.log(error);
  }

  const handleFnameChange = (e) => {
    setFname(e.target.value);
  };

  const handleLnameChange = (e) => {
    setLname(e.target.value);
  };

  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
    const validationErrors = validatePhoneNumber(value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      phoneNumber: validationErrors.phoneNumber || "", // Clear the error message for phone number field
    }));
  };

  const validatePhoneNumber = (value) => {
    const errors = {};

    if (!validator.isMobilePhone(value)) {
      errors.phoneNumber = "Invalid phone number";
    }

    return errors;
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/user/sendInvitation/${ID}`, {
        firstName: fname,
        lastName: lname,
        email: email,
        phoneNumber: phoneNumber,
        role: "ROLE_GUEST",
      });
      if (res.data === "Invitation sent successfully") {
        const res = await api.get(`/user/getGuestId`);
        setGuestId(res.data);
        window.alert("Welcome " + fname + " " + lname + " to our website!");
        // history.push("/");
        // window.location.reload();
      } else {
        window.alert("Venue hasn't been reserved yet");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchQrCode = async () => {
    const response = await axios.get(
      `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:3000/GuestPage/${guestId}`,
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
    link.download = "GuestQR.png";
    link.click();
  };
  const closeModal = () => {
    setShowQRCode(false);
    const qrCodeContainer = document.getElementById("qrCodeContainer");
    qrCodeContainer.innerHTML = "";
  };

  return (
    <>
      <MDBCard
        className="my-5 gradient-form text-center"
        style={{ marginLeft: "27rem", width: "40rem" }}>
        <MDBCardHeader>Guest Details</MDBCardHeader>
        <img
          src={ImageBody}
          style={{ width: "14rem", marginLeft: "13.1rem", marginTop: "1rem" }}
          alt="logo"
        />
        <MDBCardBody>
          <MDBCardTitle style={{ fontSize: "2rem" }}>Inivitation</MDBCardTitle>
          <MDBCardText>
            You are welcome to join us in our amazing event
          </MDBCardText>
          <MDBInput
            required
            onChange={handleFnameChange}
            type="text"
            style={{ maxWidth: "500px" }}
            label="First name"
          />
          <br />
          <MDBInput
            required
            onChange={handleLnameChange}
            type="text"
            style={{ maxWidth: "500px" }}
            label="Last name"
          />
          <br />
          <MDBInput
            required
            onChange={handleEmailChange}
            type="email"
            style={{ maxWidth: "500px" }}
            label="Email"
          />
          <br />
          <label>Phone number:</label>
          <PhoneInput
            country={"eg"}
            wrapperClass="mb-4"
            id="form1"
            type="text"
            value={phoneNumber}
            onChange={handlePhoneChange}
            style={{ marginLeft: "10rem" }}
            label="Phone number"
          />
          {errors.phoneNumber && (
            <div className="error">{errors.phoneNumber}</div>
          )}
          <br />
          <br />
          <MDBBtn
            type="submit"
            onClick={handleSubmit}
            style={{
              backgroundColor: "#FFCB74",
              color: "#111111",
              border: "none",
            }}>
            Accept invitation
          </MDBBtn>
          {guestId !== 0 && (
            <MDBBtn
              type="submit"
              onClick={fetchQrCode}
              style={{
                marginLeft: "1rem",

                backgroundColor: "#FFCB74",
                color: "#111111",
                border: "none",
              }}>
              Get QR code
            </MDBBtn>
          )}
        </MDBCardBody>
        <MDBCardFooter className="text-muted" style={{}}>
          <p style={{ marginTop: "0.5rem" }}>PlanPal</p>
        </MDBCardFooter>

        <MDBModal
          show={showQRCode}
          getOpenState={(isOpen) => setShowQRCode(isOpen)}
          centered>
          <MDBCard
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              marginTop: "2rem",
            }}>
            <MDBCardTitle style={{ textAlign: "center", marginTop: "1rem" }}>
              QR Code
            </MDBCardTitle>
            <MDBCardBody>
              <MDBModalBody>
                <div id="qrCodeContainer"></div>
              </MDBModalBody>
              <MDBModalFooter>
                {qrCodeURL && (
                  <MDBBtn color="primary" onClick={handleDownloadQRCode}>
                    Download
                  </MDBBtn>
                )}
                <MDBBtn color="secondary" onClick={closeModal}>
                  Close
                </MDBBtn>
              </MDBModalFooter>
            </MDBCardBody>
          </MDBCard>
        </MDBModal>
      </MDBCard>

      {/* <MDBContainer
        className="my-5 gradient-form"
        style={{ marginTop: "5rem", marginBottom: "5rem" }}>
        <MDBCol>
          <MDBRow col="6" className="mb-5">
            <label>First name:</label>
            <MDBInput
              required
              onChange={handleFnameChange}
              type="text"
              style={{ maxWidth: "500px" }}
            />
          </MDBRow>

          <MDBRow col="6" className="mb-5">
            <label>Last name:</label>
            <MDBInput
              required
              onChange={handleLnameChange}
              type="text"
              style={{ maxWidth: "500px" }}
            />
          </MDBRow>

          <MDBRow col="6" className="mb-5">
            <label>Phone number:</label>
            <PhoneInput
              country={"eg"}
              wrapperClass="mb-4"
              id="form1"
              type="text"
              value={phoneNumber}
              onChange={handlePhoneChange}
            />
            {errors.phoneNumber && (
              <div className="error">{errors.phoneNumber}</div>
            )}
          </MDBRow>

          <MDBRow col="6" className="mb-5">
            <label>Email:</label>
            <MDBInput
              required
              onChange={handleEmailChange}
              type="email"
              style={{ maxWidth: "500px" }}
            />
          </MDBRow>
        </MDBCol>

        <br />
        <MDBBtn type="submit" onClick={handleSubmit}>
          Accept invitation
        </MDBBtn>
        {guestId !== 0 && (
          <MDBBtn
            type="submit"
            onClick={fetchQrCode}
            style={{ marginLeft: "1rem" }}>
            Get QR code
          </MDBBtn>
        )}

        <MDBModal
          show={showQRCode}
          getOpenState={(isOpen) => setShowQRCode(isOpen)}
          centered>
          <MDBCard
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              marginTop: "2rem",
            }}>
            <MDBCardTitle style={{ textAlign: "center", marginTop: "1rem" }}>
              QR Code
            </MDBCardTitle>
            <MDBCardBody>
              <MDBModalBody>
                <div id="qrCodeContainer"></div>
              </MDBModalBody>
              <MDBModalFooter>
                {qrCodeURL && (
                  <MDBBtn color="primary" onClick={handleDownloadQRCode}>
                    Download
                  </MDBBtn>
                )}
                <MDBBtn color="secondary" onClick={closeModal}>
                  Close
                </MDBBtn>
              </MDBModalFooter>
            </MDBCardBody>
          </MDBCard>
        </MDBModal>
      </MDBContainer> */}
    </>
  );
};

export default Invitations;
