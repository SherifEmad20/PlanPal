import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./Login.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

import Image from "../../Images/PlanPal.png";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendBaseUrl =
        process.env.BACKEND_BASE_URL || "http://localhost:8080/api/v1";

      let { data } = await axios.post(backendBaseUrl + "/auth/login", {
        username: userName,
        password: password,
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

  return (
    <MDBContainer className="my-5 gradient-form">
      <MDBRow>
        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img src={Image} style={{ width: "185px" }} alt="logo" />
              <h4 className="mt-1 mb-5 pb-1">We are The PlanPal Team</h4>
            </div>

            <p>Please login to your account</p>

            <label>Username:</label>
            <MDBInput
              wrapperClass="mb-4"
              id="form1"
              type="text"
              onChange={handleUserNameChange}
            />
            <label>Password:</label>
            <MDBInput
              wrapperClass="mb-4"
              id="form2"
              type="password"
              onChange={handlePasswordChange}
            />

            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn
                className="mb-4 w-100 gradient-custom-2"
                onClick={handleSubmit}
              >
                Sign in
              </MDBBtn>
              <a className="text-muted" href="#!">
                Forgot password?
              </a>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Don't have an account? &nbsp;</p>
              <a className="form-btn-a" href="/Register" type="submit">
                Register
              </a>
              {/* <MDBBtn outline className='mx-2' color='dark'>
            </MDBBtn> */}
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

export default Login;
