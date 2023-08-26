import axios from "axios";
import React, { useState } from "react";
import Image from "../../Images/PlanPal.png";
import "./Register.css";
import { useHistory } from "react-router-dom";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import validator from "validator";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";

function Register() {
  const [userName, setUserName] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNum, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});

  const history = useHistory();

  // const handleUserNameChange = (e) => {
  //   setUserName(e.target.value);
  // };

  // const handleFnameChange = (e) => {
  //   setFname(e.target.value);
  // };

  // const handleLnameChange = (e) => {
  //   setLname(e.target.value);
  // };

  // const handlePasswordChange = (e) => {
  //   setPassword(e.target.value);
  // };

  // const handlePhoneNumberChange = (e) => {
  //   setPhoneNumber(e.target.value);
  // };

  // const handleEmailChange = (e) => {
  //   setEmail(e.target.value);
  // };

  const handlehRolechange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendBaseUrl =
        process.env.BACKEND_BASE_URL || "http://localhost:8080/api/v1";

      let { data } = await axios.post(backendBaseUrl + "/auth/register", {
        username: userName,
        password: password,
        email: email,
        firstName: fname,
        lastName: lname,
        role: role,
        phoneNumber: phoneNum,
      });
      if (data.message === "success") {
        localStorage.setItem("accessToken", data.token);
        history.push("/");
        window.location.reload();
      } else {
        window.alert("username or password is incorrect");
      }
    } catch (error) {
      console.log(error);
      window.alert("error occured");
    }
  };

  const validateEmail = (value) => {
    const errors = {};

    if (!validator.isEmail(value)) {
      errors.email = "Invalid email address";
    }

    return errors;
  };

  const validatePhoneNumber = (value) => {
    const errors = {};

    if (!validator.isMobilePhone(value)) {
      errors.phoneNumber = "Invalid phone number";
    }

    return errors;
  };

  const validatePassword = (value) => {
    const errors = {};

    if (!validator.isStrongPassword(value)) {
      errors.password = "Password is not strong enough";
    }

    return errors;
  };

  const validateUserName = (value) => {
    const errors = {};

    if (!validator.isAlphanumeric(value)) {
      errors.userName = "Invalid username";
    }

    return errors;
  };

  const validateFname = (value) => {
    const errors = {};

    if (!validator.isAlpha(value)) {
      errors.fname = "Invalid first name";
    }

    return errors;
  };

  const validateLname = (value) => {
    const errors = {};

    if (!validator.isAlpha(value)) {
      errors.lname = "Invalid last name";
    }

    return errors;
  };

  const handlePhoneNumberChange = (value) => {
    setPhoneNumber(value);
    const validationErrors = validatePhoneNumber(value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      phoneNumber: validationErrors.phoneNumber || "", // Clear the error message for phone number field
    }));
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    const validationErrors = validateEmail(value);

    setEmail(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: validationErrors.email || "", // Clear the error message if it exists
    }));
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    const validationErrors = validatePassword(value);

    setPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: validationErrors.password || "",
    }));
  };

  const handleUserNameChange = (event) => {
    const { value } = event.target;
    const validationErrors = validateUserName(value);

    setUserName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      userName: validationErrors.userName || "",
    }));
  };

  const handleFnameChange = (event) => {
    const { value } = event.target;
    const validationErrors = validateFname(value);

    setFname(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      fname: validationErrors.fname || "",
    }));
  };

  const handleLnameChange = (event) => {
    const { value } = event.target;
    const validationErrors = validateLname(value);

    setLname(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      lname: validationErrors.lname || "",
    }));
  };

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img src={Image} style={{ width: "185px" }} alt="logo" />
              <h4 className="mt-1 mb-5 pb-1">We are The PlanPal Team</h4>
            </div>

            <p>Register to join to us</p>

            {/* <label>First name:</label>0
            <MDBInput
              wrapperClass="mb-4"
              id="form2"
              type="text"
              onChange={handleFnameChange}
            />

            <label>Last name:</label>
            <MDBInput
              wrapperClass="mb-4"
              id="form1"
              type="text"
              onChange={handleLnameChange}
            />

            <label>Username:</label>
            <MDBInput
              wrapperClass="mb-4"
              id="form1"
              type="text"
              onChange={handleUserNameChange}
            />

            <label>Phone number:</label>
            <MDBInput
              wrapperClass="mb-4"
              id="form1"
              type="text"
              onChange={handlePhoneNumberChange}
            />

            <label>Email:</label>
            <MDBInput
              wrapperClass="mb-4"
              id="form1"
              type="email"
              onChange={handleEmailChange}
            />

            <label>Password:</label>
            <MDBInput
              wrapperClass="mb-4"
              id="form2"
              type="password"
              onChange={handlePasswordChange}
            /> */}

            <div>
              <label>Email:</label>
              <MDBInput
                wrapperClass="mb-4"
                id="form1"
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>

            <div>
              <label>Password:</label>
              <MDBInput
                wrapperClass="mb-4"
                id="form2"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
              {errors.password && (
                <div className="error">{errors.password}</div>
              )}
            </div>

            <div>
              <label>First name:</label>
              <MDBInput
                wrapperClass="mb-4"
                id="form2"
                type="text"
                value={fname}
                onChange={handleFnameChange}
              />
              {errors.fname && <div className="error">{errors.fname}</div>}
            </div>

            <div>
              <label>Last name:</label>
              <MDBInput
                wrapperClass="mb-4"
                id="form1"
                type="text"
                value={lname}
                onChange={handleLnameChange}
              />
              {errors.lname && <div className="error">{errors.lname}</div>}
            </div>

            <div>
              <label>Username:</label>
              <MDBInput
                wrapperClass="mb-4"
                id="form1"
                type="text"
                value={userName}
                onChange={handleUserNameChange}
              />
              {errors.userName && (
                <div className="error">{errors.userName}</div>
              )}
            </div>

            <div>
              <label>Phone number:</label>
              <PhoneInput
                country={"eg"}
                wrapperClass="mb-4"
                id="form1"
                type="text"
                value={phoneNum}
                onChange={handlePhoneNumberChange}
              />
              {errors.phoneNumber && (
                <div className="error">{errors.phoneNumber}</div>
              )}
            </div>

            <div>
              <label htmlFor="options"> Choose account </label>
              <br />
              <select
                id="options"
                value={role}
                onChange={handlehRolechange}
                style={{ marginBottom: "50px" }}
              >
                <option value="Choose user" defaultChecked>
                  {" "}
                  select user
                </option>
                <option value="ROLE_USER">User</option>
                <option value="ROLE_VENDOR">Vendor</option>
              </select>
            </div>

            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn
                className="mb-4 w-100 gradient-custom-2"
                onClick={handleSubmit}
              >
                Sign up
              </MDBBtn>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">
                Aleardy have an account? &nbsp;
                <a className="form-btn-a" href="/Login" type="submit">
                  Login
                </a>
              </p>
            </div>
          </div>
        </MDBCol>

        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">
                Creating Memorable Events That Last a Lifetime
              </h4>
              <p className="small mb-0">
                {" "}
                PlanPal is a free event planning tool that helps you quickly
                find event venues, caterers, entertainment, and more for your
                next event.
              </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Register;
