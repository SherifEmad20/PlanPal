import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";
import validator from "validator";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import ImageBody from "../../Images/PlanPal.png";
import Image from "../../Images/PlanPal-removebg-preview.png";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Navbar.css";

import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBModal,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBCardTitle,
  MDBRow,
  MDBCol,
  MDBCardText,
} from "mdb-react-ui-kit";

const Navbar = () => {
  const [showBasic, setShowBasic] = useState(false);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [showModalRegister, setShowModalRegister] = useState(false);
  const history = useHistory();

  let role;
  let token;
  let isLoggedIn = localStorage.getItem("isLoggedIn");
  try {
    token = localStorage.getItem("accessToken");
    const tokenData = jwtDecode(token);
    role = tokenData.role;
  } catch (error) {
    console.log(error);
  }

  const handleHomePageClick = () => {
    history.push("/HomePage");
    window.location.reload();
  };

  const handleRegisterClick = () => {
    history.push("/Register");
    window.location.reload();
  };

  const handleLoginClick = () => {
    history.push("/Login");
    window.location.reload();
  };
  const handleDashboardClick = () => {
    history.push("/dashboard");
    window.location.reload();
  };

  const handleProfileClick = () => {
    history.push("/ProfilePage");
    window.location.reload();
  };

  // const handleEventsClick = () => {
  //   history.push("/UserEvents");
  //   window.location.reload();
  // };

  // const handleGuestsClick = () => {
  //   history.push("/GuestList");
  //   window.location.reload();
  // };

  const addVenue = () => {
    history.push("/AddVenue");
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("eventDate");
    localStorage.setItem("isLoggedIn", false);
    setShowBasic(false); // Reset the showBasic state to collapse the navbar
    history.push("/HomePage");
    window.location.reload();
  };

  const handleShowModalLogin = () => {
    setShowModalLogin(true);
  };

  const handleCloseModalLogin = () => {
    setShowModalLogin(false);
  };

  const handleShowModalReg = () => {
    setShowModalRegister(true);
  };

  const handleCloseModalReg = () => {
    setShowModalRegister(false);
  };

  ////////////////////////////////////////REGISTER CONSTS///////////////////////////////////////////////////////
  const [userName, setUserName] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNum, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [regRole, setRole] = useState("");
  const [errors, setErrors] = useState({});
  ////////////////////////////////////////REGISTER CONSTS///////////////////////////////////////////////////////

  ////////////////////////////////////////REGISTER FUNCTIONS////////////////////////////////////////////////////
  const handlehRolechange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName) {
      window.alert("Please enter a user name");
      return;
    }

    if (!password) {
      window.alert("Please enter password");
      return;
    }
    if (!email) {
      window.alert("Please enter email");
      return;
    }
    if (!fname) {
      window.alert("Please enter a first name");
      return;
    }
    if (!lname) {
      window.alert("Please enter a last name");
      return;
    }
    if (!regRole) {
      window.alert("Please choose a role");
      return;
    }

    if (!phoneNum) {
      window.alert("Please enter phone number");
      return;
    }

    try {
      const backendBaseUrl =
        process.env.BACKEND_BASE_URL || "http://localhost:8080/api/v1";

      let { data } = await axios.post(backendBaseUrl + "/auth/register", {
        username: userName,
        password: password,
        email: email,
        firstName: fname,
        lastName: lname,
        role: regRole,
        phoneNumber: phoneNum,
      });
      if (data.message === "success") {
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("isLoggedIn", true);
        history.push("/");
        window.location.reload();
      } else {
        window.alert("username or password is incorrect");
      }
    } catch (error) {
      console.log(error);
      window.alert("an error occured");
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
      errors.password =
        "Password is not strong enough. Minimum of 8 characters and add special characters and letters;.";
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
  ////////////////////////////////////////REGISTER FUNCTIONS////////////////////////////////////////////////////

  ////////////////////////////////////////LOGIN CONSTS////////////////////////////////////////////////////
  const [loginUserName, setLoginUserName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  ////////////////////////////////////////LOGIN CONSTS////////////////////////////////////////////////////
  ////////////////////////////////////////LOGIN FUNCTIONS////////////////////////////////////////////////////
  const handleLoginUserNameChange = (e) => {
    setLoginUserName(e.target.value);
  };
  const handleLoginPasswordChange = (e) => {
    setLoginPassword(e.target.value);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginUserName) {
      window.alert("Please enter a user name");
      return;
    }

    if (!loginPassword) {
      window.alert("Please enter password");
      return;
    }

    try {
      const backendBaseUrl =
        process.env.BACKEND_BASE_URL || "http://localhost:8080/api/v1";

      let { data } = await axios.post(backendBaseUrl + "/auth/login", {
        username: loginUserName,
        password: loginPassword,
      });
      console.log(data.message);
      if (data.message === "success") {
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("isLoggedIn", true);
        history.push("/");
        window.location.reload();
      } else {
        window.alert("username or password is incorrect");
      }
    } catch (error) {
      console.log(error);
      window.alert("username or password is incorrect");
    }
  };
  ////////////////////////////////////////LOGIN FUNCTIONS////////////////////////////////////////////////////

  return (
    <>
      {isLoggedIn === "true" ? (
        //////////////////////////////////////////// LOGGED IN //////////////////////////////////////////////////////////////////////

        <MDBNavbar expand="lg" light bgColor="light" style={{ height: "4rem" }}>
          <MDBContainer fluid>
            <MDBNavbarBrand
              href="#"
              onClick={() => handleHomePageClick()}
              style={{ marginRight: "550px" }}
            >
              PlanPal
            </MDBNavbarBrand>

            <MDBNavbarToggler
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={() => setShowBasic(!showBasic)}
            >
              <MDBIcon icon="bars" fas />
            </MDBNavbarToggler>

            <MDBCollapse
              navbar
              show={showBasic}
              className="mr-auto justify-content-end"
              style={{
                zIndex: "999",
                position: "absolute",
                right: "0",
                zIndex: "999",
              }}
            >
              {/* ////////////////////////////////////////////// ROLE ADMIN ///////////////////////////////////////////////////////// */}
              {role === "ROLE_ADMIN" && (
                <>
                  <MDBNavbarNav className="justify-content-end">
                    <MDBNavbarItem>
                      <MDBBtn
                        light
                        color="light"
                        link
                        style={{ marginLeft: "1rem" }}
                        onClick={() => handleHomePageClick()}
                      >
                        <MDBIcon fas icon="home" />
                      </MDBBtn>
                    </MDBNavbarItem>
                    <MDBDropdown>
                      <MDBDropdownToggle
                        color="light"
                        style={{
                          borderRadius: "10px",
                          padding: "5px",
                          width: "80px",
                        }}
                        className="toggle-without-caret"
                      >
                        <MDBIcon
                          dark
                          color="dark"
                          fas
                          icon="user-cog"
                          style={{ width: "100%" }}
                        />
                      </MDBDropdownToggle>
                      <MDBDropdownMenu style={{ marginTop: "10px" }}>
                        <MDBDropdownItem link onClick={handleDashboardClick}>
                          <b>Dashboard</b>
                        </MDBDropdownItem>
                        <hr />
                        <MDBDropdownItem link>About us</MDBDropdownItem>
                        <MDBDropdownItem link onClick={() => logout()}>
                          Log out
                        </MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavbarNav>
                </>
              )}
              {/* ////////////////////////////////////////////// ROLE VENDOR ///////////////////////////////////////////////////////// */}
              {role === "ROLE_VENDOR" && (
                <>
                  <MDBNavbarNav className="justify-content-end">
                    <MDBNavbarItem>
                      <MDBBtn
                        light
                        color="light"
                        link
                        style={{ marginLeft: "1rem" }}
                        onClick={() => handleHomePageClick()}
                      >
                        <MDBIcon fas icon="home" />
                      </MDBBtn>
                    </MDBNavbarItem>
                    <MDBDropdown>
                      <MDBDropdownToggle
                        color="light"
                        style={{
                          borderRadius: "10px",
                          padding: "5px",
                          width: "80px",
                        }}
                        className="toggle-without-caret"
                      >
                        <MDBIcon
                          dark
                          color="dark"
                          fas
                          icon="user-tie"
                          style={{ width: "100%" }}
                        />
                      </MDBDropdownToggle>
                      <MDBDropdownMenu style={{ marginTop: "10px" }}>
                        <MDBDropdownItem link onClick={handleProfileClick}>
                          <b>Profile</b>
                        </MDBDropdownItem>
                        <MDBDropdownItem link onClick={addVenue}>
                          Add venue
                        </MDBDropdownItem>
                        <hr />
                        <MDBDropdownItem link>About us</MDBDropdownItem>
                        <MDBDropdownItem link onClick={() => logout()}>
                          Log out
                        </MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavbarNav>
                </>
              )}
              {/* ////////////////////////////////////////////// ROLE USER ///////////////////////////////////////////////////////// */}
              {role === "ROLE_USER" && (
                <>
                  <MDBNavbarNav className="justify-content-end">
                    <MDBNavbarItem>
                      <MDBBtn
                        light
                        color="light"
                        link
                        style={{ marginLeft: "1rem" }}
                        onClick={() => handleHomePageClick()}
                      >
                        <MDBIcon fas icon="home" />
                      </MDBBtn>
                    </MDBNavbarItem>
                    <MDBDropdown>
                      <MDBDropdownToggle
                        color="light"
                        style={{
                          borderRadius: "10px",
                          padding: "5px",
                          width: "80px",
                        }}
                        className="toggle-without-caret"
                      >
                        <MDBIcon
                          fas
                          icon="user-circle"
                          style={{ width: "100%" }}
                        />
                      </MDBDropdownToggle>
                      <MDBDropdownMenu style={{ marginTop: "10px" }}>
                        <MDBDropdownItem link onClick={handleProfileClick}>
                          <b>Profile</b>
                        </MDBDropdownItem>
                        {/* <MDBDropdownItem link onClick={handleGuestsClick}>
                          Guests list
                        </MDBDropdownItem>
                        <MDBDropdownItem link onClick={handleEventsClick}>
                          Events
                        </MDBDropdownItem> */}
                        <hr />
                        <MDBDropdownItem link>About us</MDBDropdownItem>
                        <MDBDropdownItem link onClick={() => logout()}>
                          Logout
                        </MDBDropdownItem>
                      </MDBDropdownMenu>
                    </MDBDropdown>
                  </MDBNavbarNav>
                </>
              )}
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
      ) : (
        //////////////////////////////////////////// NOT LOGGED IN //////////////////////////////////////////////////////////////////////

        <MDBNavbar expand="lg" light bgColor="light" style={{ height: "4rem" }}>
          <MDBContainer fluid>
            <MDBNavbarBrand
              href="#"
              onClick={() => handleHomePageClick()}
              style={{ marginRight: "550px" }}
            >
              PlanPal
            </MDBNavbarBrand>

            <MDBNavbarToggler
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={() => setShowBasic(!showBasic)}
            >
              <MDBIcon icon="bars" fas />
            </MDBNavbarToggler>

            <MDBCollapse
              navbar
              show={showBasic}
              className="mr-auto justify-content-end"
              style={{
                zIndex: "999",
                position: "absolute",
                right: "0",
                zIndex: "999",
              }}
            >
              <MDBNavbarNav className="justify-content-end">
                <MDBNavbarItem>
                  <MDBBtn
                    light
                    color="light"
                    link
                    style={{ marginLeft: "1rem" }}
                    onClick={() => handleHomePageClick()}
                  >
                    <MDBIcon fas icon="home" />
                  </MDBBtn>
                </MDBNavbarItem>

                <MDBDropdown>
                  <MDBDropdownToggle
                    color="light"
                    style={{
                      borderRadius: "10px",
                      padding: "5px",
                      width: "80px",
                    }}
                    className="toggle-without-caret"
                  >
                    <MDBIcon
                      fas
                      icon="align-justify"
                      style={{ width: "100%" }}
                    />
                  </MDBDropdownToggle>
                  <MDBDropdownMenu
                    style={{ marginTop: "10px", marginLeft: "20rem" }}
                  >
                    <MDBDropdownItem
                      link
                      onClick={handleShowModalReg}
                      style={{ marginLeft: "1rem" }}
                    >
                      <b>Sign up</b>
                    </MDBDropdownItem>
                    <MDBDropdownItem
                      link
                      onClick={handleShowModalLogin}
                      style={{ marginLeft: "1rem" }}
                    >
                      Login
                    </MDBDropdownItem>
                    <hr />
                    <MDBDropdownItem link style={{ marginLeft: "1rem" }}>
                      About us
                    </MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavbarNav>
            </MDBCollapse>
          </MDBContainer>
        </MDBNavbar>
      )}

      {/* /////////////////////////////////////LOGIN MODEL//////////////////////////////////////// */}
      <MDBModal show={showModalLogin} onHide={handleCloseModalLogin}>
        <MDBCard
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            marginTop: "100px",
            height: "680px",
          }}
        >
          <MDBCardBody style={{ marginRight: "3rem" }}>
            <MDBContainer className="my-5 gradient-form">
              <MDBRow>
                <MDBCol col="6" className="mb-5">
                  <div className="d-flex flex-column ms-5">
                    <div className="text-center">
                      <img
                        src={ImageBody}
                        style={{ width: "185px" }}
                        alt="logo"
                      />
                      <h4 className="mt-1 mb-5 pb-1">
                        We are The PlanPal Team
                      </h4>
                    </div>

                    <p>Please login to your account</p>

                    <label>Username:</label>
                    <MDBInput
                      wrapperClass="mb-4"
                      id="form1"
                      type="text"
                      onChange={handleLoginUserNameChange}
                    />
                    <label>Password:</label>
                    <MDBInput
                      wrapperClass="mb-4"
                      id="form2"
                      type="password"
                      onChange={handleLoginPasswordChange}
                    />

                    <div className="text-center pt-1 mb-5 pb-1">
                      <MDBBtn
                        className="mb-4 w-100"
                        onClick={handleLoginSubmit}
                        style={{
                          backgroundColor: "#FFCB74",
                          color: "#2F2F2F",
                          boxShadow: "none",
                          borderColor: "#111111",
                        }}
                      >
                        Login
                      </MDBBtn>
                      <a className="text-muted" href="#!">
                        Forgot password?
                      </a>
                    </div>

                    <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                      <p className="mb-0">Don't have an account? &nbsp;</p>
                      <a
                        link
                        className="form-btn-a"
                        href="#!"
                        onClick={() => {
                          handleShowModalReg();
                          handleCloseModalLogin();
                        }}
                      >
                        Register
                      </a>
                    </div>
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </MDBCardBody>
          <MDBBtn
            color="secondary"
            onClick={handleCloseModalLogin}
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",

              backgroundColor: "#2F2F2F",
              color: "#F6F6F6",
              boxShadow: "none",
            }}
          >
            Close
          </MDBBtn>
        </MDBCard>
      </MDBModal>
      {/* /////////////////////////////////////REGISTER MODEL//////////////////////////////////////// */}
      <MDBModal show={showModalRegister} onHide={handleCloseModalReg}>
        <MDBCard
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            marginTop: "100px",
            height: "1000px",
          }}
        >
          <MDBCardBody style={{ marginRight: "3rem" }}>
            <MDBContainer className="my-5 gradient-form">
              <MDBRow>
                <MDBCol col="6" className="mb-5">
                  <div className="d-flex flex-column ms-5">
                    <div className="text-center">
                      <img
                        src={ImageBody}
                        style={{ width: "185px" }}
                        alt="logo"
                      />
                      <h4 className="mt-1 mb-5 pb-1">
                        We are The PlanPal Team
                      </h4>
                    </div>

                    <p>Register to join to us</p>
                    <div>
                      <label>Email:</label>
                      <MDBInput
                        wrapperClass="mb-4"
                        id="form1"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                      />
                      {errors.email && (
                        <div className="error">{errors.email}</div>
                      )}
                    </div>

                    <div>
                      <label>Password:</label>
                      <MDBInput
                        wrapperClass="mb-4"
                        id="form2"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
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
                        required
                      />
                      {errors.fname && (
                        <div className="error">{errors.fname}</div>
                      )}
                    </div>

                    <div>
                      <label>Last name:</label>
                      <MDBInput
                        wrapperClass="mb-4"
                        id="form1"
                        type="text"
                        value={lname}
                        onChange={handleLnameChange}
                        required
                      />
                      {errors.lname && (
                        <div className="error">{errors.lname}</div>
                      )}
                    </div>

                    <div>
                      <label>Username:</label>
                      <MDBInput
                        wrapperClass="mb-4"
                        id="form1"
                        type="text"
                        value={userName}
                        onChange={handleUserNameChange}
                        required
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
                        placeholder="(+20) 123-456-7890"
                        onChange={handlePhoneNumberChange}
                        required
                      />
                      {/* {errors.phoneNumber && (
                        <div className="error">{errors.phoneNumber}</div>
                      )} */}
                    </div>

                    <div>
                      <label htmlFor="options"> Choose account </label>
                      <br />
                      <select
                        id="options"
                        value={regRole}
                        onChange={handlehRolechange}
                        style={{ marginBottom: "50px", width: "10rem" }}
                        required
                      >
                        <option value="Choose user" defaultChecked>
                          select user
                        </option>
                        <option value="ROLE_USER">User</option>
                        <option value="ROLE_VENDOR">Vendor</option>
                      </select>
                    </div>

                    <MDBBtn
                      className="mb-4 w-100 "
                      onClick={handleSubmit}
                      style={{
                        backgroundColor: "#FFCB74",
                        color: "#2F2F2F",
                        boxShadow: "none",
                        borderColor: "#111111",
                      }}
                    >
                      Sign up
                    </MDBBtn>

                    <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                      <p className="mb-0">
                        Aleardy have an account? &nbsp;
                        <a
                          className="form-btn-a"
                          href="#!"
                          onClick={() => {
                            handleShowModalLogin();
                            handleCloseModalReg();
                          }}
                        >
                          Login
                        </a>
                      </p>
                    </div>
                  </div>
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </MDBCardBody>
          <MDBBtn
            color="secondary"
            onClick={handleCloseModalReg}
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",

              backgroundColor: "#2F2F2F",
              color: "#F6F6F6",
              boxShadow: "none",
            }}
          >
            Close
          </MDBBtn>
        </MDBCard>
      </MDBModal>
    </>
  );
};
export default Navbar;
