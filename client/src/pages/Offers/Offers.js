import OfferCard from "../../components/OfferCard/OfferCard";
import LogCard from "../../components/LogCard/LogCard";
import { getSessionCache } from "../../shared/utils";
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import ScrollArea from "react-scrollbar";
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
  const [totalOffers, setTotalOffers] = useState(0);
  const [allOffers, setAllOffers] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
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

  const fetchAllOffers = async () => {
    setStateFetchOffers(true);

    await offer
      .search(ROWS_PER_PAGE, OFFSET)
      .then((response) => {
        setStateFetchOffers(false);
        setAllOffers(response.data[0].records);
        setTotalOffers(response.data[0].total[0].count);
      })
      .catch(() => {
        getFailToast("Can't fetch offers, please contact the administrator.");
        setStateFetchOffers(false);
      });
  };

  /** infinite scroll */
  const LOGS_PER_PAGE = 30;
  const TOTAL_LOG_PAGES = Math.ceil(totalLogs / LOGS_PER_PAGE);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [currentLogPage, setCurrentLogPage] = useState(1);
  const LOG_OFFSET = LOGS_PER_PAGE * currentLogPage - LOGS_PER_PAGE;

  const fetchAllLogs = async () => {
    setStateFetchLogs(true);
    await offer
      .searchLogs(LOGS_PER_PAGE, 0)
      .then((response) => {
        setStateFetchLogs(false);
        setAllLogs(response.data[0].records);
        setTotalLogs(response.data[0].total[0].count);
        setScrollEnabled(true);
      })
      .catch(() => {
        getFailToast("Can't fetch logs, please contact the administrator.");
        setStateFetchLogs(false);
        setScrollEnabled(false);
      });
  };

  const handleLazyLoad = async (e) => {
    if (allLogs.length > 0) {
      const bottomLimit = e.realHeight - e.containerHeight <= e.topPosition;

      if (bottomLimit && scrollEnabled) {
        const extendedList = await offer.searchLogs(LOGS_PER_PAGE, LOG_OFFSET);

        if (extendedList.data[0].records.length > 0) {
          setAllLogs([...allLogs, ...extendedList.data[0].records]);
          setCurrentLogPage(currentLogPage + 1);
        } else {
          setScrollEnabled(false);
        }
      }
    }
  };

  useEffect(() => {
    fetchAllOffers();
  }, [localUpdate, update, currentOfferPage]);

  useEffect(() => {
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
              Save
            </Button>
          </Modal.Footer>
        </BlockUi>
      </Modal>
      <div className="col-md-9 offers-cardContainer">
        <BlockUi tag="div" blocking={stateFetchOffers}>
          <div className="offers-card">
            <div className="offers-headingAndButton">
              <p className="Card-Heading">Offers</p>
              <Button size="md" variant="info" onClick={handleModalShow}>
                Add offer
              </Button>
            </div>
            <ScrollArea smoothScrolling={true} hidden={stateFetchOffers}>
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
      <div className="col-md-3 offers-cardContainer">
        <BlockUi tag="div" blocking={stateFetchLogs}>
          <div
            className="offers-card"
            style={{ overflow: "hidden" }}
            hidden={stateFetchLogs}
          >
            <p style={{ textAlign: "center" }} className="Card-Heading">
              User activity
            </p>
            <ScrollArea
              smoothScrolling={true}
              onScroll={(e) => handleLazyLoad(e)}
              style={{ height: "100%", width: "100%" }}
            >
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
            </ScrollArea>
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
