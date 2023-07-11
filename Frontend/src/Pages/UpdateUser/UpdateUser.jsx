import React, { useState } from "react";
import jwtDecode from "jwt-decode";
import { api } from "../axios";
import { useHistory } from "react-router-dom";
import Dropzone from "react-dropzone";
import "./UpdateUser.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

import {
  MDBInput,
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";

const UpdateUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [uploadedFileNames, setUploadedFileNames] = useState([]);

  const history = useHistory();

  let ID;
  try {
    const token = localStorage.getItem("accessToken");
    const tokenData = jwtDecode(token);
    ID = tokenData.id;
  } catch (error) {
    console.log(error);
  }
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("username", username);
      formData.append("email", email);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("password", password);
      formData.append("phoneNumber", phoneNumber);

      profilePicture.forEach((image) => {
        formData.append("profilePicture", image);
      });

      await api.put(`user/updateUser/${ID}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      window.alert("User updated successfully");
      history.push("ProfilePage");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = (fileName) => {
    const updatedImages = profilePicture.filter(
      (file) => file.name !== fileName
    );
    setProfilePicture(updatedImages);

    const updatedFileNames = uploadedFileNames.filter(
      (name) => name !== fileName
    );
    setUploadedFileNames(updatedFileNames);
  };

  const handleDrop = (acceptedFiles) => {
    setProfilePicture([...profilePicture, ...acceptedFiles]);
    const fileNames = acceptedFiles.map((file) => file.name);
    setUploadedFileNames([...uploadedFileNames, ...fileNames]);
  };

  return (
    <>
      <MDBContainer
        className="my-5 gradient-form"
        style={{ marginTop: "5rem", marginBottom: "5rem" }}>
        <MDBRow>
          <MDBCol col="6" className="mb-5">
            <label>email:</label>
            <MDBInput required onChange={handleEmailChange} type="email" />
          </MDBCol>

          {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <MDBCol col="6" className="mb-5">
            <label>Password:</label>
            <MDBInput
              required
              onChange={handlePasswordChange}
              type="password"
            />
          </MDBCol>

          {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <MDBCol col="6" className="mb-5">
            <label>First name:</label>
            <MDBInput required onChange={handleFirstNameChange} type="text" />
          </MDBCol>
        </MDBRow>

        {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}

        <MDBRow>
          <MDBCol col="6" className="mb-5">
            <label>Last name:</label>
            <MDBInput required onChange={handleLastNameChange} type="text" />
          </MDBCol>

          {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <MDBCol col="6" className="mb-5">
            <label>Phone number:</label>
            <MDBInput
              required
              onChange={handlePhoneNumberChange}
              type="number"
            />
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <Dropzone onDrop={handleDrop} multiple>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="dropzone">
                {/* <input {...getInputProps()} /> */}
                {uploadedFileNames.length > 0 ? (
                  <ul>
                    {uploadedFileNames.map((fileName) => (
                      <>
                        <li key={fileName}>{fileName}</li>
                        <MDBBtn
                          color="danger"
                          className="remove-button"
                          style={{
                            marginLeft: "10px",
                            marginTop: "10px",
                            marginBottom: "10px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(fileName);
                          }}>
                          <MDBIcon fas icon="minus-circle" />
                        </MDBBtn>
                        <br />
                      </>
                    ))}
                    <MDBBtn
                      style={{
                        backgroundColor: "#FFCB74",
                        color: "#111111",
                        border: "none",
                      }}>
                      Upload
                    </MDBBtn>
                  </ul>
                ) : (
                  <>
                    <label className="custum-file-upload" htmlFor="file">
                      <div className="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill=""
                          viewBox="0 0 24 24">
                          <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
                          <g
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            id="SVGRepo_tracerCarrier"></g>
                          <g id="SVGRepo_iconCarrier">
                            <path
                              fill=""
                              d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                              clipRule="evenodd"
                              fillRule="evenodd"></path>{" "}
                          </g>
                        </svg>
                      </div>
                      <div className="text">
                        <span>Click to upload image</span>
                      </div>
                      <input {...getInputProps()} />
                    </label>
                  </>
                )}
              </div>
            )}
          </Dropzone>
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
          Update user
        </MDBBtn>
      </MDBContainer>
    </>
  );
};

export default UpdateUser;
