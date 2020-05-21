import OfferCard from "../../components/OfferCard/OfferCard";
import LogCard from "../../components/LogCard/LogCard";
import { getSessionCache } from "../../shared/utils";
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { connect } from "react-redux";
import BlockUi from "react-block-ui";
import { offer } from "../../api";
import "react-block-ui/style.css";
import {
  getSuccessToast,
  validateAddress,
  getFailToast,
  validateName,
  formValid,
} from "../../shared/utils";
import "./Offers.scss";

const Offers = ({ update }) => {
  const [allOffers, setAllOffers] = useState([]);
  const [allLogs, setAllLogs] = useState([]);

  const [offerData, setOfferData] = useState({
    userId: getSessionCache()._id,
    username: getSessionCache().username,
    name: null,
    price: null,
    created: 0,
    startingLocation: null,
    endingLocation: null,
    status: "open",
    isRemoved: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    startingLocation: "",
    endingLocation: "",
  });

  const { name, price, startingLocation, endingLocation } = offerData;

  const [localUpdate, setLocalUpdate] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  const [stateFetchOffers, setStateFetchOffers] = useState(false);
  const [stateFetchLogs, setStateFetchLogs] = useState(false);
  const [stateAddOffer, setStateAddOffer] = useState(false);

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
      case "name":
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
      case "price":
        setErrors({
          ...errors,
          [name]: value.length < 0 ? "Enter a positive value" : "",
        });
        break;
      case "startingLocation":
        setErrors({
          ...errors,
          [name]:
            value.length < 5
              ? "Minimum 5 characaters required"
              : validateAddress(value) === false
              ? "Enter a valid address"
              : "",
        });
        break;
      case "endingLocation":
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
      default:
        break;
    }

    setOfferData({
      ...offerData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    offerData.created = Date.now();

    if (formValid(errors, { name, price, startingLocation, endingLocation })) {
      setStateAddOffer(true);

      await offer
        .create(offerData)
        .then(() => {
          getSuccessToast("Offer successfuly added.");
          handleModalClose();
          setLocalUpdate(!localUpdate);
          setStateAddOffer(false);
        })
        .catch((error) => {
          getFailToast(
            "Offer failed to be added, please contact the administrator."
          );
          setStateAddOffer(false);
        });

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
    } else {
      console.error("FORM INVALID - CHECK ALL FIELDS");
    }
  };

  const fetchAllOffers = async () => {
    setStateFetchOffers(true);
    await offer
      .search(50, 0)
      .then((response) => {
        setStateFetchOffers(false);
        setAllOffers(response.data);
      })
      .catch(() => {
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
        getFailToast("Can't fetch logs, please contact the administrator.");
        setStateFetchLogs(false);
      });
  };

  useEffect(() => {
    fetchAllOffers();
    fetchAllLogs();
  }, [localUpdate, update]);

  const addOfferFormMarkup = (
    <div className="form-wrapper">
      <div className="form-group">
        <label className="input-label">Name</label>
        <input
          className={
            errors.name.length > 0 ? "input-field input-error" : "input-field"
          }
          type="text"
          placeholder="Name"
          name="name"
          onChange={handleChange}
          value={name}
        />
        {errors.name.length > 0 && (
          <span className="input-errorMessage">{errors.name}</span>
        )}
      </div>
      <div className="form-group">
        <label className="input-label">Price</label>
        <input
          className={
            errors.price < 0 ? "input-field input-error" : "input-field"
          }
          type="number"
          placeholder="Price"
          name="price"
          onChange={handleChange}
          value={price}
          min={0}
        />
        {errors.price.length > 0 && (
          <span className="input-errorMessage">{errors.price}</span>
        )}
      </div>
      <div className="form-group">
        <label className="input-label">Starting address</label>
        <input
          className={
            errors.startingLocation.length > 0
              ? "input-field input-error"
              : "input-field"
          }
          type="text"
          placeholder="Starting address"
          name="startingLocation"
          onChange={handleChange}
          value={startingLocation}
        />
        {errors.startingLocation.length > 0 && (
          <span className="input-errorMessage">{errors.startingLocation}</span>
        )}
      </div>
      <div className="form-group">
        <label className="input-label">Ending address</label>
        <input
          className={
            errors.endingLocation.length > 0
              ? "input-field input-error"
              : "input-field"
          }
          type="text"
          placeholder="Ending address"
          name="endingLocation"
          onChange={handleChange}
          value={endingLocation}
        />
        {errors.endingLocation.length > 0 && (
          <span className="input-errorMessage">{errors.endingLocation}</span>
        )}
      </div>
    </div>
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
            <Button
              size="md"
              variant="outline-danger"
              onClick={handleModalClose}
            >
              Close
            </Button>
            <Button size="md" variant="info" onClick={handleSubmit}>
              Apply
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
        <BlockUi tag="div" blocking={stateFetchLogs}>
          <div className="offers-card scroll" hidden={stateFetchLogs}>
            <p className="Card-Heading">User logs</p>
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
        </BlockUi>
      </div>
    </div>
  );
};

const mapStateToProps = ({ offers: { update } }) => ({
  update,
});

export default connect(mapStateToProps)(Offers);
