import { getSessionCache, formValid } from "../../shared/utils";
import OfferCard from "../../components/OfferCard/OfferCard";
import LogCard from "../../components/LogCard/LogCard";
import Avatar from "../../components/Avatar/Avatar";
import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import ScrollArea from "react-scrollbar";
import BlockUi from "react-block-ui";
import { profile } from "../../api";
import "react-block-ui/style.css";
import {
  validateAddress,
  validateEmail,
  getFailToast,
  validateName,
  validateUrl,
} from "../../shared/utils";
import "./Profile.scss";

const Profile = (props) => {
  const urlUserId = props.match.params.username;

  const [profileData, setProfileData] = useState({
    id: 0,
    username: "",
    avatar: null,
    firstName: null,
    lastName: null,
    email: null,
    address: null,
    zipCode: null,
    city: null,
    country: null,
    completedOffers: 0,
  });

  const {
    id,
    avatar,
    firstName,
    lastName,
    email,
    address,
    zipCode,
    city,
    country,
  } = profileData;

  const [errors, setErrors] = useState({
    avatar: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    zipCode: "",
    city: "",
    country: "",
  });

  const [profileOffers, setProfileOffers] = useState([]);
  const [profileLogs, setProfileLogs] = useState([]);
  const [totalOffers, setTotalOffers] = useState(0);
  const [totalLogs, setTotalLogs] = useState(0);

  const [stateUserOffers, setStateUserOffers] = useState(false);
  const [stateUserLogs, setStateUserLogs] = useState(false);
  const [stateProfile, setStateProfile] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const [update, setUpdate] = useState(false);

  const handleModalShow = () => {
    setModalShow(true);
  };

  const handleModalClose = () => {
    setModalShow(false);
  };

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    switch (name) {
      //validate url
      case "avatar":
        setErrors({
          ...errors,
          [name]:
            value.length < 3
              ? "Minimum 3 characaters required"
              : validateUrl(value) === false
              ? "Enter a valid url"
              : "",
        });
        break;
      case "firstName":
        setErrors({
          ...errors,
          [name]:
            value.length < 3
              ? "Minimum 3 characaters required"
              : validateName(value) === false
              ? "Enter a valid name"
              : "",
        });
        break;
      case "lastName":
        setErrors({
          ...errors,
          [name]:
            value.length < 3
              ? "Minimum 3 characaters required"
              : validateName(value) === false
              ? "Enter a valid name"
              : "",
        });
        break;
      case "email":
        setErrors({
          ...errors,
          [name]:
            validateEmail(value) === false && value.length < 3
              ? "Minimum 3 characaters required"
              : validateEmail(value) === false
              ? "Enter a valid email"
              : "",
        });
        break;
      case "address":
        setErrors({
          ...errors,
          [name]:
            validateAddress(value) === false && value.length < 5
              ? "Minimum 5 characaters required"
              : validateAddress(value) === false
              ? "Enter a valid address"
              : "",
        });
        break;
      case "zipCode":
        setErrors({
          ...errors,
          [name]: value.length < 0 ? "Enter a positive value" : "",
        });
        break;
      case "city":
        setErrors({
          ...errors,
          [name]:
            validateName(value) === false && value.length < 3
              ? "Minimum 3 characaters required"
              : validateName(value) === false
              ? "Enter a valid name"
              : "",
        });
        break;
      case "country":
        setErrors({
          ...errors,
          [name]:
            validateName(value) === false && value.length < 3
              ? "Minimum 3 characaters required"
              : validateName(value) === false
              ? "Enter a valid country name"
              : "",
        });
        break;
      default:
        break;
    }

    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const submitEditForm = async () => {
    if (
      formValid(errors, {
        avatar,
        firstName,
        lastName,
        email,
        address,
        zipCode,
        city,
        country,
      })
    ) {
      await profile
        .updateProfile(id, profileData)
        .then(() => {
          handleModalClose();
          setUpdate(!update);
        })
        .catch(() => console.log("Could not update."));
    } else {
      console.error("FORM INVALID - CHECK ALL FIELDS");
    }
  };

  /** pagination props */
  const ROWS_PER_PAGE = 10;
  const TOTAL_PAGES = Math.ceil(totalOffers / ROWS_PER_PAGE);
  const [currentOfferPage, setCurrentOfferPage] = useState(1);
  const OFFSET = ROWS_PER_PAGE * currentOfferPage - ROWS_PER_PAGE;

  const handleOfferPageChange = (direction) => {
    switch (direction) {
      case "next":
        if (currentOfferPage <= TOTAL_PAGES) {
          setCurrentOfferPage(currentOfferPage + 1);
        } else break;
        break;
      case "previous":
        if (currentOfferPage === 1) break;
        else {
          setCurrentOfferPage(currentOfferPage - 1);
        }
        break;
      default:
        break;
    }
  };

  const fetchProfileData = async () => {
    setStateProfile(true);
    await profile
      .getUserMember(urlUserId ? urlUserId : getSessionCache()._id)
      .then((response) => {
        setProfileData({
          ...profileData,
          id: response.data._id,
          username: response.data.username,
          avatar: response.data.avatar,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          address: response.data.address
            ? response.data.address
            : "No entered address",
          zipCode: response.data.zipCode
            ? response.data.zipCode
            : "No entered zip",
          city: response.data.city ? response.data.city : "No entered city",
          country: response.data.country
            ? response.data.country
            : "No entered country",
          completedOffers: response.data.completedOffers
            ? response.data.completedOffers
            : "No completed offers",
        });
        setStateProfile(false);
      })
      .catch((error) => {
        console.log(error);
        console.error(error);
        getFailToast(
          "Could not fetch user information, please contact the administrator."
        );
        setStateProfile(false);
      });
  };

  const fetchUserOffers = async () => {
    setStateUserOffers(true);
    await profile
      .getProfileOffers(
        urlUserId ? urlUserId : getSessionCache()._id,
        ROWS_PER_PAGE,
        OFFSET
      )
      .then((response) => {
        setStateUserOffers(false);
        setProfileOffers(response.data[0].records);
        setTotalOffers(
          response.data[0].total.length ? response.data[0].total[0].count : 0
        );
      })
      .catch(() => {
        getFailToast(
          "Could not fetch offers, please contact the administrator."
        );
        setStateUserOffers(false);
      });
  };

  /** infinite scroll */
  const LOGS_PER_PAGE = 30;
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [currentLogPage, setCurrentLogPage] = useState(1);
  const LOG_OFFSET = LOGS_PER_PAGE * currentLogPage - LOGS_PER_PAGE;

  const fetchUserLogs = async () => {
    setStateUserLogs(true);
    await profile
      .getProfileLogs(
        urlUserId ? profileData.username : getSessionCache().username,
        LOGS_PER_PAGE,
        0
      )
      .then((response) => {
        setStateUserLogs(false);
        setProfileLogs([...profileLogs, ...response.data[0].records]);
        setTotalLogs(
          response.data[0].total.length ? response.data[0].total[0].count : 0
        );
        setScrollEnabled(true);
      })
      .catch(() => {
        getFailToast(
          "Could not fetch offers, please contact the administrator."
        );
        setStateUserLogs(false);
        setScrollEnabled(false);
      });
  };

  const handleLazyLoad = async (e) => {
    if (profileLogs.length > 0) {
      const bottomLimit = e.realHeight - e.containerHeight <= e.topPosition;

      if (bottomLimit && scrollEnabled) {
        const extendedList = await profile.getProfileLogs(
          urlUserId ? profileData.username : getSessionCache().username,
          LOGS_PER_PAGE,
          LOG_OFFSET
        );

        if (
          extendedList.data[0].records.length > 0 &&
          profileLogs.length < totalLogs
        ) {
          setProfileLogs([...profileLogs, ...extendedList.data[0].records]);
          setCurrentLogPage(currentLogPage + 1);
        } else {
          setScrollEnabled(false);
        }
      }
    }
  };

  useEffect(() => {
    fetchUserOffers();
  }, [currentOfferPage]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    fetchUserLogs();
  }, [profileData.username]);

  const editProfileFormMarkup = (
    <div className="form-wrapper">
      <div className="form-group">
        <label className="input-label">Photo</label>
        <input
          className={
            errors.avatar.length > 0 ? "input-field input-error" : "input-field"
          }
          type="text"
          placeholder="Photo"
          name="avatar"
          onChange={handleChange}
          value={profileData.avatar}
        />
        {errors.avatar.length > 0 && (
          <span className="input-errorMessage">{errors.avatar}</span>
        )}
      </div>
      <div className="profile-form-row">
        <div style={{ marginRight: "5px" }} className="form-group">
          <label className="input-label">First Name</label>
          <input
            className={
              errors.firstName.length > 0
                ? "input-field input-error"
                : "input-field"
            }
            type="text"
            placeholder="First Name"
            name="firstName"
            onChange={handleChange}
            value={profileData.firstName}
          />
          {errors.firstName.length > 0 && (
            <span className="input-errorMessage">{errors.firstName}</span>
          )}
        </div>
        <div style={{ marginLeft: "5px" }} className="form-group">
          <label className="input-label">Last Name</label>
          <input
            className={
              errors.lastName.length > 0
                ? "input-field input-error"
                : "input-field"
            }
            type="text"
            placeholder="Last Name"
            name="lastName"
            onChange={handleChange}
            value={profileData.lastName}
          />
          {errors.lastName.length > 0 && (
            <span className="input-errorMessage">{errors.lastName}</span>
          )}
        </div>
      </div>
      <div className="form-group">
        <label className="input-label">Email</label>
        <input
          className={
            errors.email.length > 0 ? "input-field input-error" : "input-field"
          }
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={profileData.email}
        />
        {errors.email.length > 0 && (
          <span className="input-errorMessage">{errors.email}</span>
        )}
      </div>
      <div className="profile-form-row">
        <div style={{ marginRight: "5px" }} className="form-group">
          <label className="input-label">Address</label>
          <input
            className={
              errors.address.length > 0
                ? "input-field input-error"
                : "input-field"
            }
            type="text"
            placeholder="Address"
            name="address"
            onChange={handleChange}
            value={profileData.address}
          />
          {errors.address.length > 0 && (
            <span className="input-errorMessage">{errors.address}</span>
          )}
        </div>
        <div style={{ marginLeft: "5px" }} className="form-group">
          <label className="input-label">Postal Code</label>
          <input
            className={
              errors.zipCode.length > 0
                ? "input-field input-error"
                : "input-field"
            }
            type="text"
            placeholder="Postal Code"
            name="zipCode"
            onChange={handleChange}
            value={profileData.zipCode}
          />
          {errors.zipCode.length > 0 && (
            <span className="input-errorMessage">{errors.zipCode}</span>
          )}
        </div>
      </div>
      <div className="profile-form-row">
        <div style={{ marginRight: "5px" }} className="form-group">
          <label className="input-label">City</label>
          <input
            className={
              errors.city.length > 0 ? "input-field input-error" : "input-field"
            }
            type="text"
            placeholder="City"
            name="city"
            onChange={handleChange}
            value={profileData.city}
          />
          {errors.city.length > 0 && (
            <span className="input-errorMessage">{errors.city}</span>
          )}
        </div>
        <div style={{ marginLeft: "5px" }} className="form-group">
          <label className="input-label">Country</label>
          <input
            className={
              errors.country.length > 0
                ? "input-field input-error"
                : "input-field"
            }
            type="text"
            placeholder="Country"
            name="country"
            onChange={handleChange}
            value={profileData.country}
          />
          {errors.country.length > 0 && (
            <span className="input-errorMessage">{errors.country}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="row profile">
      <Modal size="lg" centered show={modalShow} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>{editProfileFormMarkup}</Modal.Body>
        <Modal.Footer>
          <Button size="md" variant="outline-danger" onClick={handleModalClose}>
            Close
          </Button>
          <Button size="md" variant="info" onClick={submitEditForm}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="col-md-3 col-lg-2 profile-cardContainer">
        <BlockUi tag="div" blocking={stateProfile}>
          <div className="profile-info profile-card">
            <p className="Card-Heading">Personal info</p>
            {profileData.id === getSessionCache()._id ? (
              <Button size="sm" variant="info" onClick={handleModalShow}>
                Edit profile
              </Button>
            ) : null}
            <div className="profile-image">
              <Avatar avatar={profileData.avatar} />
            </div>
            <div className="user-info">
              {/* <span className="info-title">Completed offers</span>
              <span>{profileData.completedOffers}</span> */}
              <span className="info-title">Name</span>
              <span>{profileData.firstName + " " + profileData.lastName}</span>
              <span className="info-title">Address</span>
              <span>{profileData.address}</span>
              <span className="info-title">Postal Code, City</span>
              <span>{profileData.zipCode + ", " + profileData.city}</span>
              <span className="info-title">Country</span>
              <span>{profileData.country}</span>
            </div>
          </div>
        </BlockUi>
      </div>
      <div className="col-md-6 col-lg-7 profile-cardContainer">
        <BlockUi tag="div" blocking={stateUserOffers}>
          <div
            className="profile-offers profile-card"
            style={{ overflow: "hidden" }}
            hidden={stateUserOffers}
          >
            <p className="Card-Heading">Your offers</p>
            <ScrollArea
              smoothScrolling={true}
              style={{ height: "100%", width: "100%" }}
            >
              {profileOffers && profileOffers.length > 0
                ? profileOffers.map((offer, index) => {
                    return (
                      <OfferCard
                        key={index}
                        id={offer._id}
                        userId={offer.userId}
                        username={offer.username}
                        name={offer.name}
                        price={offer.price}
                        created={offer.created}
                        startingLocation={offer.startingLocation}
                        endingLocation={offer.endingLocation}
                        status={offer.status}
                      />
                    );
                  })
                : "No available offers."}
            </ScrollArea>
            <div className="offers-pagination">
              <Button
                size="md"
                variant="info"
                disabled={currentOfferPage === 1}
                onClick={() => {
                  handleOfferPageChange("previous");
                }}
              >{`<`}</Button>
              <Button
                size="md"
                variant="info"
                disabled={currentOfferPage === TOTAL_PAGES || TOTAL_PAGES === 0}
                onClick={() => {
                  handleOfferPageChange("next");
                }}
              >{`>`}</Button>
            </div>
          </div>
        </BlockUi>
      </div>
      <div className="col-md-3 col-lg-3 profile-cardContainer">
        <BlockUi tag="div" blocking={stateUserLogs}>
          <div
            style={{ overflow: "hidden" }}
            className="profile-logs profile-card"
            hidden={stateUserLogs}
          >
            <p className="Card-Heading">Your activity</p>
            <ScrollArea
              style={{ width: "100%", height: "100%" }}
              smoothScrolling={true}
              onScroll={(e) => handleLazyLoad(e)}
            >
              {profileLogs && profileLogs.length > 0
                ? profileLogs.map((log, index) => {
                    return (
                      <LogCard
                        key={index}
                        message={log.message}
                        created={log.created}
                      />
                    );
                  })
                : "No logs available."}
            </ScrollArea>
          </div>
        </BlockUi>
      </div>
    </div>
  );
};

export default Profile;
