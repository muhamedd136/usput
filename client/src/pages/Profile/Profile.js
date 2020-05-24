import OfferCard from "../../components/OfferCard/OfferCard";
import LogCard from "../../components/LogCard/LogCard";
import { getSessionCache } from "../../shared/utils";
import Avatar from "../../components/Avatar/Avatar";
import React, { useState, useEffect } from "react";
import { getFailToast } from "../../shared/utils";
import ScrollArea from "react-scrollbar";
import { Button } from "react-bootstrap";
import BlockUi from "react-block-ui";
import { profile } from "../../api";
import "react-block-ui/style.css";
import "./Profile.scss";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    id: 0,
    username: "",
    avatar: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    zipCode: 0,
    city: "",
    country: "",
    completedOffers: 0,
    rating: 0,
  });
  const [profileOffers, setProfileOffers] = useState([]);
  const [profileLogs, setProfileLogs] = useState([]);
  const [totalOffers, setTotalOffers] = useState(0);
  const [totalLogs, setTotalLogs] = useState(0);

  const [stateUserOffers, setStateUserOffers] = useState(false);
  const [stateUserLogs, setStateUserLogs] = useState(false);
  const [stateProfile, setStateProfile] = useState(false);

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
      .getUserMember(getSessionCache()._id)
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
            ? response.address
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
        getFailToast(
          "Could not fetch user information, please contact the administrator."
        );
        console.log(error);
        setStateProfile(false);
      });
  };

  const fetchUserOffers = async () => {
    setStateUserOffers(true);
    await profile
      .getProfileOffers(getSessionCache()._id, ROWS_PER_PAGE, OFFSET)
      .then((response) => {
        setStateUserOffers(false);
        setProfileOffers(response.data[0].records);
        setTotalOffers(response.data[0].total[0].count);
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
  const TOTAL_LOG_PAGES = Math.ceil(totalLogs / LOGS_PER_PAGE);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [currentLogPage, setCurrentLogPage] = useState(1);
  const LOG_OFFSET = LOGS_PER_PAGE * currentLogPage - LOGS_PER_PAGE;

  const fetchUserLogs = async () => {
    setStateUserLogs(true);
    await profile
      .getProfileLogs(getSessionCache().username, LOGS_PER_PAGE, 0)
      .then((response) => {
        setStateUserLogs(false);
        setProfileLogs([...profileLogs, ...response.data[0].records]);
        setTotalLogs(response.data[0].total[0].count);
        setScrollEnabled(true);
      })
      .catch((error) => {
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
          getSessionCache().username,
          LOGS_PER_PAGE,
          LOG_OFFSET
        );

        if (extendedList.data[0].records.length > 0) {
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
    fetchUserLogs();
  }, []);

  return (
    <div className="row profile">
      <div className="col-md-3 col-lg-2 profile-cardContainer">
        <BlockUi tag="div" blocking={stateProfile}>
          <div className="profile-info profile-card">
            <p className="Card-Heading">Personal info</p>
            <div className="profile-image">
              <Avatar avatar={profileData.avatar} />
            </div>
            <div className="user-info">
              <span className="info-title">Completed offers</span>
              <span>{profileData.completedOffers}</span>
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
                disabled={currentOfferPage === TOTAL_PAGES}
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
