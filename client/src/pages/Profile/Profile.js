import OfferCard from "../../components/OfferCard/OfferCard";
import LogCard from "../../components/LogCard/LogCard";
import { getSessionCache } from "../../shared/utils";
import Avatar from "../../components/Avatar/Avatar";
import React, { useState, useEffect } from "react";
import { profile } from "../../api";
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

  const [update, setUpdate] = useState(false);

  const fetchProfileData = async () => {
    await profile
      .getUserMember(getSessionCache()._id)
      .then((response) =>
        setProfileData({
          ...profileData,
          id: response.data._id,
          username: response.data.username,
          avatar: response.data.avatar,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          address: response.data.address,
          zipCode: response.data.zipCode,
          city: response.data.city,
          country: response.data.country,
          completedOffers: response.data.completedOffers,
          rating: response.data.rating,
        })
      )
      .catch((error) => console.log(error));
  };

  const fetchUserOffers = async () => {
    await profile
      .getProfileOffers(getSessionCache()._id, 50, 0)
      .then((response) => setProfileOffers(response.data))
      .catch(() => console.log("Could not fetch offers."));
  };

  const fetchUserLogs = async () => {
    await profile
      .getProfileLogs(getSessionCache().username, 50, 0)
      .then((response) => setProfileLogs(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setTimeout(() => {
      fetchProfileData();
      fetchUserOffers();
      fetchUserLogs();
    }, 2000);
  }, [update]);

  return (
    <div className="row profile">
      <div className="col-md-3 col-lg-2 profile-cardContainer">
        <div className="profile-info profile-card">
          <div className="profile-image">
            <Avatar avatar={profileData.avatar} />
          </div>
          <div className="user-info">
            <span className="info-title">Completed offers</span>
            <span>{profileData.completedOffers}</span>
            <span className="info-title">Rating</span>
            <span>{profileData.rating}</span>
            <span className="info-title">Name</span>
            <span>{profileData.firstName + " " + profileData.lastName}</span>
            <span className="info-title">Address</span>
            <span>
              {profileData.address ? "No entered address" : profileData.address}
            </span>
            <span className="info-title">Postal Code, City</span>
            <span>{profileData.zipCode + ", " + profileData.city}</span>
            <span className="info-title">Country</span>
            <span>{profileData.country}</span>
          </div>
        </div>
      </div>
      <div className="col-md-6 col-lg-7 profile-cardContainer">
        <div className="profile-offers profile-card scroll">
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
        </div>
      </div>
      <div className="col-md-3 col-lg-3 profile-cardContainer">
        <div className="profile-logs profile-card scroll">
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
