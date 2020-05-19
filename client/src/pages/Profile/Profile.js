import { getSuccessToast, getFailToast } from "../../shared/utils";
import OfferCard from "../../components/OfferCard/OfferCard";
import LogCard from "../../components/LogCard/LogCard";
import { getSessionCache } from "../../shared/utils";
import Avatar from "../../components/Avatar/Avatar";
import React, { useState, useEffect } from "react";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
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

	const [stateProfile, setStateProfile] = useState(false);
	const [stateUserOffers, setStateUserOffers] = useState(false);
	const [stateUserLogs, setStateUserLogs] = useState(false);

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
					address: response.data.address ? response.address : "No entered address",
					zipCode: response.data.zipCode ? response.data.zipCode : "No entered zip",
					city: response.data.city ? response.data.city : "No entered city",
					country: response.data.country ? response.data.country : "No entered country",
					completedOffers: response.data.completedOffers ? response.data.completedOffers : "No completed offers",
				});
				setStateProfile(false);
			})
			.catch((error) => {
				getFailToast("Could not fetch user information, please contact the administrator.");
				console.log(error);
				setStateProfile(false);
			});
	};

	const fetchUserOffers = async () => {
		setStateUserOffers(true);
		await profile
			.getProfileOffers(getSessionCache()._id, 50, 0)
			.then((response) => {
				setStateUserOffers(false);
				setProfileOffers(response.data);
			})
			.catch(() => {
				getFailToast("Could not fetch offers, please contact the administrator.");
				console.log("Could not fetch offers.");
				setStateUserOffers(false);
			});
	};

	const fetchUserLogs = async () => {
		setStateUserLogs(true);
		await profile
			.getProfileLogs(getSessionCache().username, 50, 0)
			.then((response) => {
				setStateUserLogs(false);
				setProfileLogs(response.data);
			})
			.catch((error) => {
				getFailToast("Could not fetch offers, please contact the administrator.");
				console.log(error);
				setStateUserLogs(false);
			});
	};

	// useEffect(() => {
	// 	setTimeout(() => {
	// 		fetchProfileData();
	// 		fetchUserOffers();
	// 		fetchUserLogs();
	// 	}, 2000);
	// }, [update]);

	useEffect(() => {
		fetchProfileData();
		fetchUserOffers();
		fetchUserLogs();
	}, [update]);

	return (
		<div className="row profile">
			<div className="col-md-3 col-lg-2 profile-cardContainer">
				<BlockUi tag="div" blocking={stateProfile}>
					<div className="profile-info profile-card">
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
					<div className="profile-offers profile-card scroll" hidden={stateUserOffers}>
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
				</BlockUi>
			</div>
			<div className="col-md-3 col-lg-3 profile-cardContainer">
				<BlockUi tag="div" blocking={stateUserLogs}>
					<div className="profile-logs profile-card scroll" hidden={stateUserLogs}>
						{profileLogs && profileLogs.length > 0
							? profileLogs.map((log, index) => {
									return <LogCard key={index} message={log.message} created={log.created} />;
							  })
							: "No logs available."}
					</div>
				</BlockUi>
			</div>
		</div>
	);
};

export default Profile;
