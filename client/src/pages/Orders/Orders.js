import OrderCard from "../../components/OrderCard/OrderCard";
import { ButtonGroup, Button } from "react-bootstrap";
import { getSessionCache } from "../../shared/utils";
import React, { useState, useEffect } from "react";
import { getFailToast } from "../../shared/utils";
import ScrollArea from "react-scrollbar";
import { connect } from "react-redux";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import { order } from "../../api";
import "./Orders.scss";

const Orders = ({ update }) => {
  const [totalRequestedOffers, setTotalRequestedOffers] = useState(1);
  const [totalCompletedOffers, setTotalCompletedOffers] = useState(1);
  const [totalAppliedOffers, setTotalAppliedOffers] = useState(1);
  const [requestedOffers, setRequestedOffers] = useState([]);
  const [completedOffers, setCompletedOffers] = useState([]);
  const [appliedOffers, setAppliedOffers] = useState([]);

  const [displayRequested, setDisplayRequested] = useState("none");
  const [displayCompleted, setDisplayCompleted] = useState("none");
  const [displayApplied, setDisplayApplied] = useState("block");
  const [selected, setSelected] = useState(0);

  const [stateOrdersCard, setStateOrdersCard] = useState(false);

  const ROWS_PER_PAGE = 10;

  /** pagination props */
  const TOTAL_PAGES_REQUESTED = Math.ceil(totalRequestedOffers / ROWS_PER_PAGE);
  const [currentRequestedOffersPage, setCurrentRequestedOfferPage] = useState(
    1
  );
  const OFFSET_REQUESTED =
    ROWS_PER_PAGE * currentRequestedOffersPage - ROWS_PER_PAGE;

  const handleRequestedOfferPageChange = (direction) => {
    switch (direction) {
      case "next":
        if (currentRequestedOffersPage <= TOTAL_PAGES_REQUESTED) {
          setCurrentRequestedOfferPage(currentRequestedOffersPage + 1);
        } else break;
        break;
      case "previous":
        if (currentRequestedOffersPage === 1) break;
        else {
          setCurrentRequestedOfferPage(currentRequestedOffersPage - 1);
        }
        break;
      default:
        break;
    }
  };

  /** pagination props */
  const TOTAL_PAGES_APPLIED = Math.ceil(totalAppliedOffers / ROWS_PER_PAGE);
  const [currentAppliedOfferPage, setCurrentAppliedOfferPage] = useState(1);
  const OFFSET_APPLIED =
    ROWS_PER_PAGE * currentAppliedOfferPage - ROWS_PER_PAGE;

  const handleAppliedOfferPageChange = (direction) => {
    switch (direction) {
      case "next":
        if (currentAppliedOfferPage <= TOTAL_PAGES_APPLIED) {
          setCurrentAppliedOfferPage(currentAppliedOfferPage + 1);
        } else break;
        break;
      case "previous":
        if (currentAppliedOfferPage === 1) break;
        else {
          setCurrentAppliedOfferPage(currentAppliedOfferPage - 1);
        }
        break;
      default:
        break;
    }
  };

  /** pagination props */
  const TOTAL_PAGES_COMPLETED = Math.ceil(totalCompletedOffers / ROWS_PER_PAGE);
  const [currentCompletedOfferPage, setCurrentCompletedOfferPage] = useState(1);
  const OFFSET_COMPLETED =
    ROWS_PER_PAGE * currentCompletedOfferPage - ROWS_PER_PAGE;

  const handleCompletedOfferPageChange = (direction) => {
    switch (direction) {
      case "next":
        if (currentCompletedOfferPage <= TOTAL_PAGES_COMPLETED) {
          setCurrentCompletedOfferPage(currentCompletedOfferPage + 1);
        } else break;
        break;
      case "previous":
        if (currentCompletedOfferPage === 1) break;
        else {
          setCurrentCompletedOfferPage(currentCompletedOfferPage - 1);
        }
        break;
      default:
        break;
    }
  };

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
      .getAppliedOffers(getSessionCache()._id, ROWS_PER_PAGE, OFFSET_APPLIED)
      .then((response) => {
        setStateOrdersCard(false);
        setAppliedOffers(response.data[0].records);
        setTotalAppliedOffers(
          response.data[0].total.length ? response.data[0].total[0].count : 1
        );
      })
      .catch(() => {
        setStateOrdersCard(false);
        getFailToast(
          "Can't fetch applied offers orders, please contact the administrator."
        );
      });
  };

  const fetchRequestedOffers = async () => {
    setStateOrdersCard(true);
    await order
      .getRequestedOffers(
        getSessionCache()._id,
        ROWS_PER_PAGE,
        OFFSET_REQUESTED
      )
      .then((response) => {
        setStateOrdersCard(false);
        setRequestedOffers(response.data[0].records);
        setTotalRequestedOffers(
          response.data[0].total.length ? response.data[0].total[0].count : 1
        );
      })
      .catch(() => {
        setStateOrdersCard(false);
        getFailToast(
          "Can't fetch requested offers orders, please contact the administrator."
        );
      });
  };

  const fetchCompletedOffers = async () => {
    setStateOrdersCard(true);
    await order
      .getCompletedOffers(
        getSessionCache()._id,
        ROWS_PER_PAGE,
        OFFSET_COMPLETED
      )
      .then((response) => {
        setStateOrdersCard(false);
        setCompletedOffers(response.data[0].records);
        setTotalCompletedOffers(
          response.data[0].total.length ? response.data[0].total[0].count : 1
        );
      })
      .catch(() => {
        setStateOrdersCard(false);
        getFailToast(
          "Could not get completed offers, please contact the administrator."
        );
      });
  };

  useEffect(() => {
    fetchAppliedOffers();
  }, [update, currentAppliedOfferPage]);

  useEffect(() => {
    fetchRequestedOffers();
  }, [update, currentRequestedOffersPage]);

  useEffect(() => {
    fetchCompletedOffers();
  }, [update, currentCompletedOfferPage]);

  return (
    <div className="Orders">
      <div className="col-sm-10 Orders-cardContainer">
        <BlockUi tag="div" blocking={stateOrdersCard}>
          <div className="Orders-Card">
            <div className="Orders-CardButtons">
              <ButtonGroup vertical={window.innerWidth <= 575 ? true : false}>
                <Button
                  size="md"
                  variant={selected !== 0 ? "outline-info" : "info"}
                  onClick={handleApplyTabOpen}
                >
                  Applied
                </Button>
                <Button
                  size="md"
                  variant={selected !== 1 ? "outline-info" : "info"}
                  onClick={handleRequestTabOpen}
                >
                  Requested
                </Button>
                <Button
                  size="md"
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
              <ScrollArea smoothScrolling={true} className="Orders-scroll">
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
              </ScrollArea>
              <div className="offers-pagination">
                <Button
                  size="md"
                  variant="info"
                  disabled={currentAppliedOfferPage === 1}
                  onClick={() => {
                    handleAppliedOfferPageChange("previous");
                  }}
                >{`<`}</Button>
                <Button
                  size="md"
                  variant="info"
                  disabled={currentAppliedOfferPage === TOTAL_PAGES_APPLIED}
                  onClick={() => {
                    handleAppliedOfferPageChange("next");
                  }}
                >{`>`}</Button>
              </div>
            </div>
            <div
              className="Orders-OrderCards"
              style={{ display: displayRequested }}
              hidden={stateOrdersCard}
            >
              <ScrollArea smoothScrolling={true} className="Orders-scroll">
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
              </ScrollArea>
              <div className="offers-pagination">
                <Button
                  size="md"
                  variant="info"
                  disabled={currentRequestedOffersPage === 1}
                  onClick={() => {
                    handleRequestedOfferPageChange("previous");
                  }}
                >{`<`}</Button>
                <Button
                  size="md"
                  variant="info"
                  disabled={
                    currentRequestedOffersPage === TOTAL_PAGES_REQUESTED
                  }
                  onClick={() => {
                    handleRequestedOfferPageChange("next");
                  }}
                >{`>`}</Button>
              </div>
            </div>
            <div
              className="Orders-OrderCards"
              style={{ display: displayCompleted }}
              hidden={stateOrdersCard}
            >
              <ScrollArea smoothScrolling={true} className="Orders-scroll">
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
              </ScrollArea>
              <div className="offers-pagination">
                <Button
                  size="md"
                  variant="info"
                  disabled={currentCompletedOfferPage === 1}
                  onClick={() => {
                    handleCompletedOfferPageChange("previous");
                  }}
                >{`<`}</Button>
                <Button
                  size="md"
                  variant="info"
                  disabled={currentCompletedOfferPage === TOTAL_PAGES_COMPLETED}
                  onClick={() => {
                    handleCompletedOfferPageChange("next");
                  }}
                >{`>`}</Button>
              </div>
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
