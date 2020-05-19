import OfferCard from "../../components/OfferCard/OfferCard";
import LogCard from "../../components/LogCard/LogCard";
import { Modal, Button, Form } from "react-bootstrap";
import { getSessionCache } from "../../shared/utils";
import React, { useState, useEffect } from "react";
import { offer } from "../../api";
import "./Offers.scss";

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

    setTimeout(async () => {
      await offer
        .create(offerData)
        .then(() => {
          console.log("Offer successfuly added.");
          handleModalClose();
          setLocalUpdate(!localUpdate);
        })
        .catch((error) => console.log("Error while adding offer", error));
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
    await offer
      .search(50, 0)
      .then((response) => setAllOffers(response.data))
      .catch((error) => console.log(error));
  };

  const fetchAllLogs = async () => {
    await offer
      .searchLogs(50, 0)
      .then((response) => setAllLogs(response.data))
      .catch(() => console.log("Can't fetch logs."));
  };

  useEffect(() => {
    fetchAllOffers();
    fetchAllLogs();
  }, [localUpdate]);

  const addOfferFormMarkup = (
    <Form>
      <Form.Group>
        <Form.Label>Offer name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          placeholder="Offer name"
          value={name}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="firstName">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          name="price"
          placeholder={0}
          value={price}
          onChange={handleChange}
        />
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
      </Modal>
      <div className="col-md-9 offers-cardContainer">
        <div className="offers-card">
          <div className="offers-headingAndButton">
            <p className="Card-Heading">Offers</p>
            <Button
              className="addOffer-Button"
              size="md"
              variant="info"
              onClick={handleModalShow}
            >
              Add offer
            </Button>
          </div>
          <div className="offers-card scroll">
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
      </div>
      <div className="col-md-3 offers-cardContainer">
        <div className="offers-card">
          <p className="Card-Heading">User logs</p>
          <div className="offers-card scroll">
            {allLogs && allLogs.length > 0
              ? allLogs.map((log, index) => {
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
    </div>
  );
};

export default Offers;
