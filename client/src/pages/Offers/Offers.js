import OfferCard from "../../components/OfferCard/OfferCard";
import LogCard from "../../components/LogCard/LogCard";
import { Modal, Button, Form } from "react-bootstrap";
import { getSessionCache } from "../../shared/utils";
import React, { useState, useEffect } from "react";
import { offer } from "../../api";
import "./Offers.scss";
import { getSuccessToast, getFailToast } from "../../shared/utils";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";

const Offers = () => {
	const [allOffers, setAllOffers] = useState([]);
	const [allLogs, setAllLogs] = useState([]);
	const [offerData, setOfferData] = useState({
		userId: getSessionCache()._id,
		username: getSessionCache().username,
		name: "",
		price: 0,
		created: 0,
		startingLocation: "",
		endingLocation: "",
		status: "open",
		isRemoved: false,
	});

	const { name, price, startingLocation, endingLocation } = offerData;

	const [modalShow, setModalShow] = useState(false);
	const [localUpdate, setLocalUpdate] = useState(false);

	const [stateAddOffer, setStateAddOffer] = useState(false);
	const [stateFetchOffers, setStateFetchOffers] = useState(false);
	const [stateFetchLogs, setStateFetchLogs] = useState(false);

	const handleModalShow = () => {
		setModalShow(true);
	};

	const handleModalClose = () => {
		setModalShow(false);
	};

	const handleChange = (event) => {
		setOfferData({
			...offerData,
			[event.target.name]: [event.target.value],
		});
	};

	const submitAddOfferForm = async () => {
		offerData.created = Date.now();
		setStateAddOffer(true);
		setTimeout(async () => {
			await offer
				.create(offerData)
				.then(() => {
					getSuccessToast("Offer successfuly added.");
					console.log("Offer successfuly added.");
					handleModalClose();
					setLocalUpdate(!localUpdate);
					setStateAddOffer(false);
				})
				.catch((error) => {
					getFailToast("Offer failed to be added, please contact the administrator.");
					console.log("Error while adding offer", error);
					setStateAddOffer(false);
				});
		}, 1000);

		setOfferData({
			userId: getSessionCache()._id,
			username: getSessionCache().username,
			name: "",
			price: 0,
			created: 0,
			startingLocation: "",
			endingLocation: "",
			status: "open",
			isRemoved: false,
		});
	};

	const fetchAllOffers = async () => {
		setStateFetchOffers(true);
		await offer
			.search(50, 0)
			.then((response) => {
				setStateFetchOffers(false);
				setAllOffers(response.data);
			})
			.catch((error) => {
				console.log(error);
				getFailToast("Can't fetch offers, please contact the administrator.");
				setStateFetchOffers(false);
			});
	};

	const fetchAllLogs = async () => {
		setStateFetchLogs(true);
		await offer
			.searchLogs(50, 0)
			.then((response) => {
				setStateFetchLogs(false);
				setAllLogs(response.data);
			})
			.catch(() => {
				console.log("Can't fetch logs.");
				getFailToast("Can't fetch logs, please contact the administrator.");
				setStateFetchLogs(false);
			});
	};

	useEffect(() => {
		fetchAllOffers();
		fetchAllLogs();
	}, [localUpdate]);

	const addOfferFormMarkup = (
		<Form>
			<Form.Group>
				<Form.Label>Offer name</Form.Label>
				<Form.Control type="text" name="name" placeholder="Offer name" value={name} onChange={handleChange} />
			</Form.Group>
			<Form.Group controlId="firstName">
				<Form.Label>Price</Form.Label>
				<Form.Control type="number" name="price" placeholder={0} value={price} onChange={handleChange} />
			</Form.Group>
			<Form.Group controlId="lastName">
				<Form.Label>Starting location</Form.Label>
				<Form.Control
					type="text"
					name="startingLocation"
					value={startingLocation}
					onChange={handleChange}
					placeholder="Address, Municipality, City"
				/>
			</Form.Group>
			<Form.Group controlId="email">
				<Form.Label>Ending location</Form.Label>
				<Form.Control
					type="text"
					name="endingLocation"
					value={endingLocation}
					onChange={handleChange}
					placeholder="Address, Municipality, City"
				/>
			</Form.Group>
		</Form>
	);

	return (
		<div className="row offers">
			<Modal centered show={modalShow} onHide={handleModalClose}>
				<BlockUi tag="div" blocking={stateAddOffer}>
					<Modal.Header closeButton>
						<Modal.Title>Add offer</Modal.Title>
					</Modal.Header>
					<Modal.Body>{addOfferFormMarkup}</Modal.Body>

					<Modal.Footer>
						<Button size="sm" variant="secondary" onClick={handleModalClose}>
							Close
						</Button>
						<Button size="sm" variant="info" onClick={submitAddOfferForm}>
							Submit
						</Button>
					</Modal.Footer>
				</BlockUi>
			</Modal>
			<div className="col-md-9 offers-cardContainer">
				<BlockUi tag="div" blocking={stateFetchOffers}>
					<div className="offers-card">
						<div className="offers-headingAndButton">
							<p className="Card-Heading">Offers</p>
							<Button variant="info" onClick={handleModalShow}>
								Add offer
							</Button>
						</div>
						<div className="offers-card scroll" hidden={stateFetchOffers}>
							{allOffers && allOffers.length > 0
								? allOffers.map((offer, index) => {
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
												isRemoved={offer.isRemoved}
											/>
										);
								  })
								: "No available offers."}
						</div>
					</div>
				</BlockUi>
			</div>
			<div className="col-md-3 offers-cardContainer">
				<div className="offers-card">
					<p className="Card-Heading">User logs</p>
					<BlockUi tag="div" blocking={stateFetchLogs}>
						<div className="offers-card scroll" hidden={stateFetchLogs}>
							{allLogs && allLogs.length > 0
								? allLogs.map((log, index) => {
										return <LogCard key={index} message={log.message} created={log.created} />;
								  })
								: "No logs available."}
						</div>
					</BlockUi>
				</div>
			</div>
		</div>
	);
};

export default Offers;
