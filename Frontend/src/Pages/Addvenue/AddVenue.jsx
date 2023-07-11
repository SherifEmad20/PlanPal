import React, { useState } from "react";
import jwtDecode from "jwt-decode";
import { api } from "../axios";
import { useHistory } from "react-router-dom";
import Dropzone from "react-dropzone";
import "./AddVenue.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import validator from "validator";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import {
  MDBInput,
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTextArea,
  MDBIcon,
} from "mdb-react-ui-kit";

export default function AddVenue() {
  const history = useHistory();

  const [venueName, setVenueName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [capacity, setCapacity] = useState("");
  const [venuePrice, setVenuePrice] = useState("");
  const [venueType, setVenueType] = useState("");
  const [venueDescription, setVenueDescription] = useState("");
  const [venueImages, setVenueImages] = useState("");
  const [uploadedFileNames, setUploadedFileNames] = useState([]);

  var ID;
  try {
    const token = localStorage.getItem("accessToken");
    const tokenData = jwtDecode(token);
    ID = tokenData.id;
  } catch (error) {
    console.log(error);
  }
  const handleVenueNameChange = (e) => {
    setVenueName(e.target.value);
  };
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const handlePhoneChange = (value) => {
    setPhone(value);
    const validationErrors = validatePhoneNumber(value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      phone: validationErrors.phone || "", // Clear the error message for phone number field
    }));
  };
  const handleCapacityChange = (e) => {
    const { value } = e.target;
    const validationErrors = validateCapacity(value);

    setCapacity(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      capacity: validationErrors.capacity || "", // Clear the error message for minimum price field
    }));

    // setCapacity(e.target.value);
  };

  const handlePriceChange = (e) => {
    const { value } = e.target;
    const validationErrors = validatePrice(value);

    setVenuePrice(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      venuePrice: validationErrors.venuePrice || "", // Clear the error message for minimum price field
    }));

    // setVenuePrice(e.target.value);
  };

  const validatePhoneNumber = (value) => {
    const errors = {};

    if (!validator.isMobilePhone(value)) {
      errors.phone = "Invalid phone number";
    }

    return errors;
  };

  const handleTypeChange = (e) => {
    setVenueType(e.target.value);
  };
  const handleDiscriptionChange = (e) => {
    setVenueDescription(e.target.value);
  };

  const handleDrop = (acceptedFiles) => {
    setVenueImages([...venueImages, ...acceptedFiles]);
    const fileNames = acceptedFiles.map((file) => file.name);
    setUploadedFileNames([...uploadedFileNames, ...fileNames]);
  };

  const handleRemove = (fileName) => {
    const updatedImages = venueImages.filter((file) => file.name !== fileName);
    setVenueImages(updatedImages);

    const updatedFileNames = uploadedFileNames.filter(
      (name) => name !== fileName
    );
    setUploadedFileNames(updatedFileNames);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!venueName) {
      window.alert("Please enter venue name");
      return;
    }

    if (!address) {
      window.alert("Please enter venue address");
      return;
    }

    if (!phone) {
      window.alert("Please enter venue phone number");
      return;
    }

    if (!capacity) {
      window.alert("Please enter venue capacity");
      return;
    }

    if (!venuePrice) {
      window.alert("Please enter venue price");
      return;
    }

    if (!venueType) {
      window.alert("Please choose venue type");
      return;
    }

    if (!venueDescription) {
      window.alert("Please enter venue description");
      return;
    }

    if (!venueImages) {
      window.alert("Please upload venue images");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("venueName", venueName);
      formData.append("address", address);
      formData.append("phone", phone);
      formData.append("capacity", capacity);
      formData.append("venuePrice", venuePrice);
      formData.append("venueType", venueType);
      formData.append("venueDescription", venueDescription);
      formData.append("vendorId", ID);

      venueImages.forEach((image) => {
        formData.append("venueImages", image);
      });

      await api.post(`/venue/addVenue`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      window.alert("Venue Added Successfully");
      history.push("ProfilePage");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  const [errors, setErrors] = useState({});

  const validateCapacity = (value) => {
    const errors = {};

    if (!validator.isNumeric(value) || parseFloat(value) < 0) {
      errors.capacity = "Please enter a valid positive number";
    }

    return errors;
  };

  const validatePrice = (value) => {
    const errors = {};

    if (!validator.isNumeric(value) || parseFloat(value) < 0) {
      errors.venuePrice = "Please enter a valid positive number";
    }

    return errors;
  };

  return (
    <>
      <MDBContainer
        className="my-5 gradient-form"
        style={{ marginTop: "5rem", marginBottom: "5rem" }}>
        <MDBRow>
          <MDBCol col="6" className="mb-5">
            <label>Venue Name:</label>
            <MDBInput required onChange={handleVenueNameChange} />
          </MDBCol>

          {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <MDBCol col="6" className="mb-5">
            <label>Address:</label>
            <MDBInput required onChange={handleAddressChange} />
          </MDBCol>

          {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <MDBCol col="6" className="mb-5">
            <label>Phone Number:</label>
            <PhoneInput
              country={"eg"}
              wrapperClass="mb-4"
              id="form1"
              type="text"
              value={phone}
              onChange={handlePhoneChange}
              required
            />
            {errors.phone && <div className="error">{errors.phone}</div>}
          </MDBCol>

          {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}

          <MDBCol col="6" className="mb-5">
            <label>Capacity:</label>
            <MDBInput required onChange={handleCapacityChange} type="number" />
            {errors.capacity && <div className="error">{errors.capacity}</div>}
          </MDBCol>
        </MDBRow>

        {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}

        <MDBRow>
          <MDBCol col="6" className="mb-5">
            <label>Price:</label>
            <MDBInput required onChange={handlePriceChange} type="number" />
            {errors.venuePrice && (
              <div className="error">{errors.venuePrice}</div>
            )}
          </MDBCol>

          {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}
          <MDBCol col="6" className="mb-5">
            <label htmlFor="options" style={{ marginLeft: "1rem" }}>
              Choose venue type:
            </label>
            <br />
            <select
              required
              className="Items"
              value={venueType}
              onChange={handleTypeChange}
              style={{
                marginBottom: "50px",
                marginLeft: "1rem",
                borderRadius: "5px",
              }}>
              <option value="Choose venue type" defaultChecked>
                select Type:
              </option>
              <option value="Wedding">Weddings</option>
              <option value="Birthday">Birthdays</option>
              <option value="CorporateEvent">Corporate event</option>
              <option value="Sports">Sports</option>
              <option value="WorkingSpace">Working space</option>
            </select>
          </MDBCol>
          {/* //////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {/* <MDBCol col="6" className="mb-5">
            <label>Type:</label>
            <MDBInput required onChange={handleTypeChange} />
          </MDBCol>*/}
        </MDBRow>

        <MDBRow>
          <label>Description:</label>
          <MDBTextArea required onChange={handleDiscriptionChange} rows={4} />
        </MDBRow>

        <br />

        <MDBRow>
          <Dropzone required onDrop={handleDrop} multiple>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="dropzone">
                {/* <input {...getInputProps()} /> */}
                {uploadedFileNames.length > 0 ? (
                  <ul>
                    {uploadedFileNames.map((fileName) => (
                      <li key={fileName}>
                        {fileName}
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
                      </li>
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
                            fillRule="evenodd"></path>
                        </g>
                      </svg>
                    </div>
                    <div className="text">
                      <span>Click to upload image</span>
                    </div>
                    <input {...getInputProps()} />
                  </label>
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
          Add Venue
        </MDBBtn>
      </MDBContainer>
    </>
  );
}
