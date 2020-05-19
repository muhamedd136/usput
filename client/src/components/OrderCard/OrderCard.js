import { updateOfferList } from "../../redux/offers/actions";
import { Button, Modal } from "react-bootstrap";
import React, { useState } from "react";
import { connect } from "react-redux";
import { order } from "../../api";
import "./OrderCard.scss";

const OrderCard = (props) => {
  const {
    startingLocation,
    offererUsername,
    applierUsername,
    updateOfferList,
    endingLocation,
    dateCompleted,
    offererId,
    applierId,
    isRemoved,
    selected,
    created,
    applied,
    status,
    price,
    name,
    id,
  } = props;

  const [orderBody, setOrderBody] = useState({
    offererId: offererId,
    offererUsername: offererUsername,
    applierUsername: applierUsername,
    applierId: applierId,
    offerName: name,
    offerPrice: price,
    createdDate: created,
    startingLocation: startingLocation,
    endingLocation: endingLocation,
    appliedDate: applied,
    status: status,
    isRemoved: isRemoved,
  });

  let dateApplied = new Date(applied).toLocaleString("en-US");
  let dateCreated = new Date(created).toLocaleString("en-US");
  let completed = new Date(dateCompleted).toLocaleString("en-US");

  const cancelApplication = async () => {
    orderBody.isRemoved = true;

    await order
      .cancel(id, orderBody)
      .then(() => {
        console.log("Order canceled successfuly.");
        updateOfferList();
        handleCancelAppliedModalShow();
      })
      .catch(() => console.log("Could not cancel order, try again."));
  };

  const completeOrder = async () => {
    orderBody.status = "completed";

    await order
      .complete(id, orderBody)
      .then(() => {
        console.log("Order successfuly comleted.");
        updateOfferList();
        handleAcceptRequestedModalShow();
      })
      .catch(() => console.log("Could not complete offer, try again."));
  };

  const [acceptRequestedModalShow, setAcceptRequestedModalShow] = useState(
    false
  );
  const [cancelAppliedModalShow, setCancelAppliedModalShow] = useState(false);

  const handleCancelAppliedModalShow = () => {
    setCancelAppliedModalShow(!cancelAppliedModalShow);
  };
  const handleAcceptRequestedModalShow = () => {
    setAcceptRequestedModalShow(!acceptRequestedModalShow);
  };

  const generateModal = (
    showModal,
    handleShowModal,
    title,
    text,
    onSubmit,
    confirmationButtonText
  ) => {
    return (
      <Modal centered show={showModal} onHide={handleShowModal}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{text}</Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="outline-danger" onClick={handleShowModal}>
            Close
          </Button>
          <Button size="sm" variant="info" onClick={onSubmit}>
            {confirmationButtonText}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div className="OrderCard">
      {generateModal(
        cancelAppliedModalShow,
        handleCancelAppliedModalShow,
        "Cancel application",
        "Are you sure you want to cancel this application?",
        cancelApplication,
        "Cancel Application"
      )}
      {generateModal(
        acceptRequestedModalShow,
        handleAcceptRequestedModalShow,
        "Accept application",
        "Are you sure you want to accept this application?",
        completeOrder,
        "Accept application"
      )}
      <div className="OrderCard-firstRow">
        <p>
          <span>Name:</span> {name && name}
        </p>
        <p>
          <span>Price:</span> {price && price}
        </p>
        <p>
          <span>Created:</span> {dateCreated && dateCreated}
        </p>
      </div>
      <div className="OrderCard-secondRow">
        <p>
          <span>From:</span> {startingLocation && startingLocation}
        </p>
        <p>
          <span>To:</span> {endingLocation && endingLocation}
        </p>
        {selected !== 2 ? (
          <p>
            <span>Applied:</span> {dateApplied && dateApplied}
          </p>
        ) : (
          <p>
            <span>Completed:</span> {completed && completed}
          </p>
        )}
      </div>
      <div className="OrderCard-thirdRow">
        {selected !== 1 ? (
          <>
            <p>
              <span>Offerer:</span> {offererUsername && offererUsername}
            </p>
            {selected !== 2 ? (
              <Button
                size="sm"
                variant="outline-danger"
                onClick={handleCancelAppliedModalShow}
              >
                Cancel
              </Button>
            ) : (
              <p>
                <span>Applier: </span> {applierUsername && applierUsername}
              </p>
            )}
          </>
        ) : (
          <>
            <p>
              <span>Applier:</span> {applierUsername && applierUsername}
            </p>
            <div className="OrderCard-requestButtons">
              <Button
                size="sm"
                variant="outline-danger"
                onClick={handleCancelAppliedModalShow}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="outline-info"
                onClick={handleAcceptRequestedModalShow}
              >
                Accept
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateOfferList: () => dispatch(updateOfferList()),
});

export default connect(null, mapDispatchToProps)(OrderCard);
