import React, { useEffect, useState } from "react";
import { api } from "../axios";
import jwtDecode from "jwt-decode";
import Image from "../../Images/bgImage1.jpg";
import Logo from "../../Images/PlanPal-removebg-preview.png";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";
import validator from "validator";
import { Card } from "react-bootstrap";

import "./HomePage.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";

import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBModal,
  MDBInput,
  MDBCardFooter,
  MDBIcon,
  MDBSpinner,
  MDBTypography,
} from "mdb-react-ui-kit";
import { error } from "jquery";

export default function HomePage() {
  const [venues, setVenues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalFilter, setShowModalFilter] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [review, setReview] = useState({});
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  let UID;
  let token;
  try {
    token = localStorage.getItem("accessToken");
    const tokenData = jwtDecode(token);
    UID = tokenData.id;
  } catch (error) {
    console.log(error);
  }

  function loginAlert() {
    window.alert("Please login or register first");
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const backendBaseUrl =
        process.env.BACKEND_BASE_URL || "http://localhost:8080/api/v1";

      await axios.get(backendBaseUrl + "/venue/getAllVenues").then((res) => {
        setVenues(res.data);
        setLoading(false); // Set loading to false after data is fetched

        const filteredVenues = res.data.filter((venue) =>
          venue.venueName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredVenues);
      });
    };
    fetchData();
  }, []);
  useEffect(() => {
    const filteredVenues = venues.filter((venue) =>
      venue.venueName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredVenues);
  }, [searchQuery, venues]);

  const handleShowModal = (venue) => {
    setSelectedVenue(venue);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModalFilter = () => {
    setShowModalFilter(true);
  };

  const handleCloseModalFilter = () => {
    setShowModalFilter(false);
  };

  // const handleReserveClick = async (venueId) => {
  //   const res = await api.put(`/venue/reserveVenue/${venueId}/${UID}`);

  //   if (res.data === "Venue reserved successfully") {
  //     window.alert("Venue reserved successfully");
  //   } else window.alert(error.message);
  // };

  // const handleReserveClick = async (venueId) => {
  //   history.push(
  //     `/addEvent/${venueId}/?eventDate=${selectedVenue.event.eventDate}`
  //   );
  //   window.location.reload();
  // };

  const handleReserveClick = async (venueId) => {
    history.push(`/addEvent/${venueId}`);
    window.location.reload();
  };

  const handleAddToFavoriteClick = async (venueId) => {
    const res = await api.put(`/user/addFavoriteVenue/${UID}/${venueId}`);

    if (res.data === "Venue added to favorites") {
      window.alert("Venue added to favorites");
    } else window.alert("something went wrong");
  };

  const handleAddReviewClick = async (venueId) => {
    const res = await api.put(`/venue/addReview/${venueId}/${UID}`, {
      review: review,
    });

    if (res.data === "Review added successfully") {
      window.alert("Review added successfully");
      window.location.reload();
    } else window.alert(error.message);
  };

  function getVenuesWithinPriceRange() {
    const backendBaseUrl =
      process.env.BACKEND_BASE_URL || "http://localhost:8080/api/v1";

    axios
      .get(
        backendBaseUrl +
          `/venue/getVenuesWithinPriceRange/${minPrice}/${maxPrice}`
      )
      .then((res) => {
        setVenues(res.data);
        setLoading(false); // Set loading to false after data is fetched
      });
  }

  const [errors, setErrors] = useState({});

  const validateMin = (value) => {
    const errors = {};

    if (!validator.isNumeric(value) || parseFloat(value) < 0) {
      errors.minPrice = "Please enter a valid positive number";
    }

    return errors;
  };

  const validateMax = (value) => {
    const errors = {};

    if (!validator.isNumeric(value) || parseFloat(value) < 0) {
      errors.maxPrice = "Please enter a valid positive number";
    }

    return errors;
  };

  function handleMinPriceChange(e) {
    const { value } = e.target;
    const validationErrors = validateMin(value);

    setMinPrice(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      minPrice: validationErrors.minPrice || "", // Clear the error message for minimum price field
    }));
  }

  function handleMaxPriceChange(e) {
    const { value } = e.target;
    const validationErrors = validateMax(value);

    setMaxPrice(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      maxPrice: validationErrors.maxPrice || "", // Clear the error message for maximum price field
    }));
  }

  function reloadPage() {
    window.location.reload();
  }

  const venueOfType = (type) => {
    const backendBaseUrl =
      process.env.BACKEND_BASE_URL || "http://localhost:8080/api/v1";

    axios.get(backendBaseUrl + `/venue/getVenueOf/${type}`).then((res) => {
      setVenues(res.data);
      setLoading(false); // Set loading to false after data is fetched
    });
  };

  const getRecommendations = () => {
    api.get(`venue/getRecommendations/${UID}`).then((res) => {
      setVenues(res.data);
      setLoading(false); // Set loading to false after data is fetched
    });
  };

  function formatDate(dateString) {
    const hasEventDate =
      selectedVenue && selectedVenue.event && selectedVenue.event.eventDate;
    if (hasEventDate) {
      localStorage.setItem("eventDate", selectedVenue.event.eventDate);
    } else {
      localStorage.removeItem("eventDate");
    }

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
  return (
    <>
      <div className="bg-image">
        <img
          src={Image}
          className="img-fluid shadow-4"
          alt="background image"
          style={{ height: "90.5vh", width: "100%" }}
        />
        <div className="mask" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="flex-column">
              <MDBTypography
                tag="h1"
                className="text-white mb-0"
                style={{
                  fontWeight: "bold",
                  fontFamily: "Bacasime Antique Neue",
                  textAlign: "center",
                }}
              >
                Welcome to PLANPAL
              </MDBTypography>

              <MDBTypography
                tag="h3"
                style={{
                  fontWeight: "bold",
                  fontFamily: "Josefin Sans",
                  textAlign: "center",
                  lineHeight: "1.5",
                }}
                className=" pb-3 mb-3  text-white mb-0"
              >
                Whether you're looking to book a party, post-work gathering,
                celebratory function, conference,
                <br /> business meeting, wedding, or private dining event, our
                dedicated PlanPal team can create a <br />
                package that will meet your every need.
              </MDBTypography>
            </div>
          </div>
        </div>
      </div>

      <MDBContainer breakpoint="md" className="icon-container">
        <a href="#!" onClick={() => reloadPage()} className="icon-wrapper">
          <MDBIcon fas icon="arrow-left" />
          <span>All</span>
        </a>

        <a
          href="#!"
          onClick={() => venueOfType("Wedding")}
          className="icon-wrapper"
        >
          <MDBIcon className="ico" fas icon="ring" />
          <span>Weddings</span>
        </a>
        <a
          href="#!"
          onClick={() => venueOfType("Birthday")}
          className="icon-wrapper"
        >
          <MDBIcon className="ico" fas icon="birthday-cake" />
          <span>Birthdays</span>
        </a>
        <a
          href="#!"
          onClick={() => venueOfType("CorporateEvent")}
          className="icon-wrapper"
        >
          <MDBIcon className="ico" far icon="calendar-check" />
          <span>Corporate Events</span>
        </a>
        <a
          href="#!"
          onClick={() => venueOfType("Sports")}
          className="icon-wrapper"
        >
          <MDBIcon className="ico" fas icon="futbol" />
          <span>Sports Events</span>
        </a>
        <a
          href="#!"
          onClick={() => venueOfType("WorkingSpace")}
          className="icon-wrapper"
        >
          <MDBIcon className="ico" fas icon="briefcase" />
          <span>Working space</span>
        </a>
        {localStorage.getItem("accessToken") ? (
          <a
            href="#!"
            onClick={() => getRecommendations()}
            className="icon-wrapper"
          >
            <MDBIcon className="ico" fas icon="thumbs-up" />
            <span>Recommendations</span>
          </a>
        ) : null}

        <a
          href="#!"
          onClick={() => handleShowModalFilter()}
          className="btn btn-secondary"
        >
          <span>Price range</span>
        </a>

        {/* <MDBBtn
          className="d-grid gap-2 d-md-block icon-wrapper"
          color="light"
          rippleColor="dark"
          onClick={() => handleShowModalFilter()}>
          Price range
        </MDBBtn> */}
      </MDBContainer>
      <hr />
      <form className="d-flex input-group w-auto">
        <input
          placeholder=" Search here..."
          id="form1"
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="form-control"
        />
        <MDBBtn
          className="search-button"
          onClick={() => {}}
          style={{ backgroundColor: "#F6F6F6", border: "none" }}
        >
          <MDBIcon fas icon="search" style={{ color: "black" }} />
        </MDBBtn>
      </form>
      <hr />
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
          {(venues.length > 0 || searchResults.length > 0) && (
            <div
              className="cards-div"
              style={{
                overflow: "hidden",
                overflowY: "scroll",
                scrollbarWidth: "none" /* Hide scrollbar for Firefox */,
              }}
            >
              <MDBContainer
                className="my-5 gradient-form card-container"
                style={{
                  marginTop: "5rem",
                  marginBottom: "5rem",
                }}
              >
                <MDBRow>
                  <>
                    {(searchQuery ? searchResults : venues).map((venue) => (
                      <MDBCol key={venue.venueId} col="6" className="mb-3">
                        <MDBCard
                          style={{
                            width: "25rem",
                            height: "30rem",
                            marginBottom: "6rem",
                          }}
                          className="MDBCard custom-card"
                        >
                          <Carousel showIndicators showControls fade>
                            {venue.venueImagesList.map((image, index) => (
                              <Carousel.Item>
                                <img
                                  key={image.imageId}
                                  className="w-100 d-block"
                                  itemId={index + 1}
                                  src={`data:image/jpeg;base64,${image.imageURL}`}
                                  alt={`Image ${index + 1}`}
                                  style={{
                                    height: "20rem",
                                    borderRadius: "10px",
                                    width: "30rem",
                                  }}
                                />
                              </Carousel.Item>
                            ))}
                          </Carousel>

                          <MDBCardBody>
                            <MDBCardTitle>{venue.venueName}</MDBCardTitle>

                            {/* //////////////////////////////////////////////////////////////////////////////////////////////// */}
                            <div className="rating-icons golden-star">
                              {Array.from(
                                { length: venue.rating },
                                (_, index) => (
                                  <MDBIcon
                                    icon="star"
                                    key={index}
                                    className="rating-icon"
                                  />
                                )
                              )}
                            </div>
                            {/* //////////////////////////////////////////////////////////////////////////////////////////////// */}

                            <MDBCardText
                              style={{ overflowY: "scroll", height: "4rem" }}
                            >
                              {venue.venueDescription}
                            </MDBCardText>
                            <MDBCardText>{venue.venuePrice} L.E</MDBCardText>

                            <MDBBtn
                              style={{
                                marginTop: "1rem",

                                backgroundColor: "#FFCB74",
                                color: "#111111",
                                borderColor: "#111111",
                              }}
                              onClick={() => {
                                handleShowModal(venue);
                              }}
                            >
                              More details
                            </MDBBtn>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    ))}
                  </>
                </MDBRow>
              </MDBContainer>
            </div>
          )}
          {selectedVenue && (
            <MDBModal show={showModal} onHide={handleCloseModal}>
              <MDBCard
                style={{
                  maxWidth: "600px",
                  margin: "0 auto",
                  marginTop: "100px",
                }}
              >
                <MDBCardBody
                  style={{
                    textAlign: "center", // Added textAlign style
                    fontFamily: "Inter, sans-serif", // Added fontFamily style
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <label style={{ marginRight: "10px" }}>
                      <b>Venue name:</b>
                    </label>
                    <MDBCardText>{selectedVenue.venueName}</MDBCardText>
                  </div>
                  <div style={{ display: "flex" }}>
                    <label style={{ marginRight: "10px" }}>
                      <b>Address:</b>
                    </label>
                    <MDBCardText>{selectedVenue.address}</MDBCardText>
                  </div>
                  <div style={{ display: "flex" }}>
                    <label style={{ marginRight: "10px" }}>
                      <b>Phone number:</b>
                    </label>
                    <MDBCardText>{selectedVenue.phone}</MDBCardText>
                  </div>
                  {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
                  <div>
                    <div style={{ display: "flex" }}>
                      <label style={{ marginRight: "10px" }}>
                        <b>Reserved: </b>
                      </label>
                      <MDBCardText>
                        {selectedVenue.reserved ? "Yes" : "No"}
                      </MDBCardText>
                    </div>
                    <div style={{ display: "flex" }}>
                      <label style={{ marginRight: "10px" }}>
                        <b>Reserved for:</b>
                      </label>
                      {selectedVenue.event && (
                        <MDBCardText>
                          {formatDate(selectedVenue.event.eventDate)}
                        </MDBCardText>
                      )}
                    </div>
                  </div>
                  {/* ////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                  <div style={{ display: "flex" }}>
                    <label style={{ marginRight: "10px" }}>
                      <b>Capacity:</b>
                    </label>
                    <MDBCardText>{selectedVenue.capacity}</MDBCardText>
                  </div>
                  <div style={{ display: "flex" }}>
                    <label style={{ marginRight: "10px" }}>
                      <b>Price: </b>
                    </label>
                    <MDBCardText>{selectedVenue.venuePrice}</MDBCardText>
                  </div>
                  {/* <div style={{ display: "flex", alignItems: "center" }}>
                <label style={{ marginRight: "10px" }}>Rating: </label>
                <MDBCardText>{selectedVenue.rating}</MDBCardText>
              </div> */}
                  <div style={{ display: "flex" }}>
                    <label style={{ marginRight: "10px" }}>
                      <b>Type: </b>
                    </label>
                    <MDBCardText>{selectedVenue.venueType}</MDBCardText>
                  </div>
                  <div style={{ display: "flex" }}>
                    <label style={{ marginRight: "10px" }}>
                      <b>Venue owner:</b>
                    </label>
                    <MDBCardText>{selectedVenue.vendorName}</MDBCardText>
                  </div>
                </MDBCardBody>
                <div style={{ display: "flex", marginBottom: "10px" }}>
                  <MDBBtn
                    color="secondary"
                    style={{
                      maxWidth: "10rem",
                      marginLeft: "1rem",
                      border: "none",
                    }}
                    onClick={() => {
                      if (!token) {
                        loginAlert();
                      } else {
                        handleReserveClick(selectedVenue.venueId);
                      }
                    }}
                  >
                    Reserve
                  </MDBBtn>
                  <MDBBtn
                    style={{
                      marginLeft: "10px",
                      backgroundColor: "#EB3C62",
                      border: "none",
                    }}
                    onClick={() => {
                      if (!token) {
                        loginAlert();
                      } else {
                        handleAddToFavoriteClick(selectedVenue.venueId);
                      }
                    }}
                  >
                    <MDBIcon fas icon="heart" />
                  </MDBBtn>
                </div>
                <MDBCardFooter className="text-muted">
                  <MDBCard style={{ height: "25rem" }}>
                    <MDBCardBody style={{ overflowY: "scroll" }}>
                      <MDBCardTitle>Reviews:</MDBCardTitle>
                      {selectedVenue.reviews &&
                        selectedVenue.reviews.map((review, index) => (
                          <div className="review" key={index}>
                            <div className="review-header">
                              <b>{review.username}</b>
                            </div>
                            <div className="review-content">
                              <span className="venue_review">
                                {review.review}
                              </span>
                            </div>
                          </div>
                        ))}
                    </MDBCardBody>
                    <MDBCardFooter className="text-muted">
                      <div className="review-input">
                        <MDBInput
                          id="typeText"
                          type="text"
                          label="Add a review"
                          onChange={handleReviewChange}
                        />
                        <MDBBtn
                          className="btn btn-primary ml-2"
                          onClick={() => {
                            if (!token) {
                              loginAlert();
                            } else {
                              handleAddReviewClick(selectedVenue.venueId);
                            }
                          }}
                          style={{
                            marginLeft: "1rem",
                            backgroundColor: "#F6F6F6",
                            color: "#2F2F2F",
                            border: "none",
                          }}
                        >
                          <MDBIcon fas icon="arrow-alt-circle-right" />
                        </MDBBtn>
                      </div>
                      <br />
                      <br />
                      <br />
                      <MDBBtn
                        color="secondary"
                        onClick={handleCloseModal}
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
                    </MDBCardFooter>
                  </MDBCard>
                </MDBCardFooter>
              </MDBCard>
            </MDBModal>
          )}

          <MDBModal show={showModalFilter} onHide={handleCloseModalFilter}>
            <MDBCard
              style={{
                maxWidth: "600px",
                margin: "0 auto",
                marginTop: "100px",
              }}
            >
              <MDBCardBody>
                <MDBInput
                  label="Minimum price"
                  id="typeNumber"
                  type="number"
                  style={{ marginTop: "1rem", marginBottom: "2rem" }}
                  required
                  onChange={handleMinPriceChange}
                />
                {errors.minPrice && (
                  <div className="error">{errors.minPrice}</div>
                )}
                <MDBInput
                  label="Maximum price"
                  id="typeNumber"
                  type="number"
                  style={{ marginBottom: "3.5rem" }}
                  required
                  onChange={handleMaxPriceChange}
                />
                {errors.maxPrice && (
                  <div className="error">{errors.maxPrice}</div>
                )}
                <MDBBtn
                  onClick={() => {
                    getVenuesWithinPriceRange();
                    handleCloseModalFilter();
                  }}
                  style={{
                    backgroundColor: "#FFCB74",
                    color: "#111111",
                    borderColor: "#111111",
                  }}
                >
                  submit
                </MDBBtn>
              </MDBCardBody>
              <MDBBtn
                color="secondary"
                onClick={handleCloseModalFilter}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                }}
              >
                Close
              </MDBBtn>
            </MDBCard>
          </MDBModal>
        </>
      )}
    </>
  );
}

// export default HomePage;
