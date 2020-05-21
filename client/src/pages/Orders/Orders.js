import { getSuccessToast, getFailToast } from "../../shared/utils";
import OrderCard from "../../components/OrderCard/OrderCard";
import { ButtonGroup, Button } from "react-bootstrap";
import { getSessionCache } from "../../shared/utils";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import { order } from "../../api";
import "./Orders.scss";

const Orders = ({ update }) => {
  const [requestedOffers, setRequestedOffers] = useState([]);
  const [completedOffers, setCompletedOffers] = useState([]);
  const [appliedOffers, setAppliedOffers] = useState([]);

  const [displayRequested, setDisplayRequested] = useState("none");
  const [displayCompleted, setDisplayCompleted] = useState("none");
  const [displayApplied, setDisplayApplied] = useState("block");
  const [selected, setSelected] = useState(0);

  const [stateOrdersCard, setStateOrdersCard] = useState(false);

  const handleApplyTabOpen = () => {
    setDisplayRequested("none");
    setDisplayCompleted("none");
    setDisplayApplied("block");
    setSelected(0);
  };

  const handleRequestTabOpen = () => {
    setDisplayRequested("block");
    setDisplayCompleted("none");
    setDisplayApplied("none");
    setSelected(1);
  };

  const handleCompletedTabOpen = () => {
    setDisplayCompleted("block");
    setDisplayRequested("none");
    setDisplayApplied("none");
    setSelected(2);
  };

  const fetchAppliedOffers = async () => {
    setStateOrdersCard(true);
    await order
      .getAppliedOffers(getSessionCache()._id, 50, 0)
      .then((response) => {
        setStateOrdersCard(false);
        setAppliedOffers(response.data);
      })
      .catch(() => {
        setStateOrdersCard(false);
        getFailToast(
          "Can't fetch applied offers orders, please contact the administrator."
        );
        console.log("Can't fetch applied offers orders.");
      });
  };

  const fetchRequestedOffers = async () => {
    setStateOrdersCard(true);
    await order
      .getRequestedOffers(getSessionCache()._id, 50, 0)
      .then((response) => {
        setStateOrdersCard(false);
        setRequestedOffers(response.data);
      })
      .catch(() => {
        setStateOrdersCard(false);
        getFailToast(
          "Can't fetch requested offers orders, please contact the administrator."
        );
        console.log("Can't fetch requested offers orders.");
      });
  };

  const fetchCompletedOffers = async () => {
    setStateOrdersCard(true);
    await order
      .getCompletedOffers(getSessionCache()._id, 50, 0)
      .then((response) => {
        setStateOrdersCard(false);
        setCompletedOffers(response.data);
      })
      .catch(() => {
        setStateOrdersCard(false);
        getFailToast(
          "Could not get completed offers, please contact the administrator."
        );
        console.log("Could not get completed offers, try again.");
      });
  };

  useEffect(() => {
    fetchAppliedOffers();
    fetchRequestedOffers();
    fetchCompletedOffers();
  }, [update]);

  return (
    <div className="Orders">
      <div className="col-sm-10 Orders-cardContainer">
        <BlockUi tag="div" blocking={stateOrdersCard}>
          <div className="Orders-Card">
            <div className="Orders-CardButtons">
              <ButtonGroup vertical={window.innerWidth <= 575 ? true : false}>
                <Button
                  variant={selected !== 0 ? "outline-info" : "info"}
                  onClick={handleApplyTabOpen}
                >
                  Applied
                </Button>
                <Button
                  variant={selected !== 1 ? "outline-info" : "info"}
                  onClick={handleRequestTabOpen}
                >
                  Requested
                </Button>
                <Button
                  variant={selected !== 2 ? "outline-info" : "info"}
                  onClick={handleCompletedTabOpen}
                >
                  Completed
                </Button>
              </ButtonGroup>
            </div>
            <div
              className="Orders-OrderCards"
              style={{ display: displayApplied }}
              hidden={stateOrdersCard}
            >
              {appliedOffers && appliedOffers.length > 0
                ? appliedOffers.map((offer, index) => {
                    return (
                      <OrderCard
                        key={index}
                        id={offer._id}
                        offererId={offer.offererId}
                        applierId={offer.applierId}
                        selected={selected}
                        name={offer.offerName}
                        price={offer.offerPrice}
                        created={offer.createdDate}
                        startingLocation={offer.startingLocation}
                        endingLocation={offer.endingLocation}
                        applied={offer.appliedDate}
                        offererUsername={offer.offererUsername}
                        applierUsername={offer.applierUsername}
                        status={offer.status}
                        isRemoved={offer.isRemoved}
                      />
                    );
                  })
                : "You haven't applied to any offers."}
            </div>
            <div
              className="Orders-OrderCards"
              style={{ display: displayRequested }}
              hidden={stateOrdersCard}
            >
              {requestedOffers && requestedOffers.length > 0
                ? requestedOffers.map((offer, index) => {
                    return (
                      <OrderCard
                        key={index}
                        id={offer._id}
                        offererId={offer.offererId}
                        applierId={offer.applierId}
                        selected={selected}
                        name={offer.offerName}
                        price={offer.offerPrice}
                        created={offer.createdDate}
                        startingLocation={offer.startingLocation}
                        endingLocation={offer.endingLocation}
                        applied={offer.appliedDate}
                        offererUsername={offer.offererUsername}
                        applierUsername={offer.applierUsername}
                        status={offer.status}
                        isRemoved={offer.isRemoved}
                      />
                    );
                  })
                : "Nobody has applied to your offers."}
            </div>
            <div
              className="Orders-OrderCards"
              style={{ display: displayCompleted }}
              hidden={stateOrdersCard}
            >
              {completedOffers && completedOffers.length > 0
                ? completedOffers.map((offer, index) => {
                    return (
                      <OrderCard
                        key={index}
                        id={offer._id}
                        offererId={offer.offererId}
                        applierId={offer.applierId}
                        selected={selected}
                        name={offer.offerName}
                        price={offer.offerPrice}
                        created={offer.createdDate}
                        startingLocation={offer.startingLocation}
                        endingLocation={offer.endingLocation}
                        applied={offer.appliedDate}
                        offererUsername={offer.offererUsername}
                        applierUsername={offer.applierUsername}
                        status={offer.status}
                        dateCompleted={offer.dateCompleted}
                      />
                    );
                  })
                : "You have not completed any offers."}
            </div>
          </div>
        </BlockUi>
      </div>
    </div>
  );
};

const mapStateToProps = ({ offers: { update } }) => ({
  update,
});

export default connect(mapStateToProps)(Orders);
