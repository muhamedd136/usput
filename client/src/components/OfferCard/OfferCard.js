import { updateOfferList } from "../../redux/offers/actions";
import { Button, Form, Modal } from "react-bootstrap";
import { getSessionCache } from "../../shared/utils";
import { order, offer } from "../../api";
import React, { useState } from "react";
import { connect } from "react-redux";
import "./OfferCard.scss";

const OfferCard = props => {
  const {
    id,
    userId,
    name,
    username,
    price,
    created,
    startingLocation,
    endingLocation,
    status,
    isRemoved,
    updateOfferList
  } = props;

  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editOfferData, setEditOfferData] = useState({
    userId: userId,
    username: username,
    name: name,
    price: price,
    created: created,
    startingLocation: startingLocation,
    endingLocation: endingLocation,
    status: status,
    isRemoved: false
  });
  const [isEmpty, setIsEmpty] = useState(false);

  const handleChange = event => {
    setEditOfferData({
      ...editOfferData,
      [event.target.name]: [event.target.value]
    });
  };

  const handleDeleteModalShow = () => {
    setDeleteModalShow(!deleteModalShow);
  };

  const handleEditModalShow = () => {
    setEditModalShow(!editModalShow);
  };

  const submitEditForm = async () => {
    if (
      editOfferData.name.length === 0 ||
      editOfferData.price.length === 0 ||
      editOfferData.startingLocation.length === 0 ||
      editOfferData.endingLocation.length === 0
    ) {
      setIsEmpty(true);
      return;
    } else {
      setIsEmpty(false);

      await offer
        .update(id, editOfferData)
        .then(() => {
          console.log("Successfuly updated offer.");
          updateOfferList();
        })
        .catch(() => console.log("Could not update offer, please try again."));
    }
    handleEditModalShow();
  };

  const applyToOffer = async () => {
    await order
      .create({
        offererId: userId,
        offererUsername: username,
        applierUsername: getSessionCache().username,
        applierId: getSessionCache()._id,
        offerName: name,
        offerPrice: price,
        createdDate: created,
        startingLocation: startingLocation,
        endingLocation: endingLocation,
        appliedDate: Date.now(),
        status: status,
        isRemoved: isRemoved
      })
      .then(() => {
        console.log("Successfuly applied to an offer");
        updateOfferList();
      })
      .catch(() => console.log("Can't apply, try again."));
  };

  const deleteOffer = async () => {
    await offer
      .delete(id, {
        userId: userId,
        username: username,
        name: name,
        price: price,
        created: created,
        startingLocation: startingLocation,
        endingLocation: endingLocation,
        status: status,
        isRemoved: true
      })
      .then(() => {
        console.log("Offer successfuly deleted.");
        updateOfferList();
      })
      .catch(() => console.log("Could not delete offer, try again."));
    handleDeleteModalShow();
  };

  const editOfferFormMarkup = (
    <Form>
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={editOfferData.name}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="price">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={editOfferData.price}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="startingLocation">
        <Form.Label>Starting address</Form.Label>
        <Form.Control
          type="text"
          name="startingLocation"
          value={editOfferData.startingLocation}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group controlId="endingAddress">
        <Form.Label>Ending address</Form.Label>
        <Form.Control
          type="text"
          name="endingLocation"
          value={editOfferData.endingLocation}
          onChange={handleChange}
        />
      </Form.Group>
    </Form>
  );

  return (
    <div className="OfferCard">
      <Modal centered show={deleteModalShow} onHide={handleDeleteModalShow}>
        <Modal.Header closeButton>
          <Modal.Title>Delete offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this offer? There is no going back if
          you accept.
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="sm"
            variant="outline-info"
            onClick={handleDeleteModalShow}
          >
            Close
          </Button>
          <Button size="sm" variant="danger" onClick={deleteOffer}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal centered show={editModalShow} onHide={handleEditModalShow}>
        <Modal.Header closeButton>
          <Modal.Title>Edit offer</Modal.Title>
        </Modal.Header>
        <Modal.Body>{editOfferFormMarkup}</Modal.Body>
        <Modal.Footer>
          <Button
            size="sm"
            variant="outline-info"
            onClick={handleEditModalShow}
          >
            Close
          </Button>
          <Button size="sm" variant="info" onClick={submitEditForm}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="OfferCard-firstRow">
        <p>
          <span>Name:</span> {name && name}
        </p>
        <p>
          <span>Price:</span> {price && price}
        </p>
        <p>
          <span>Created:</span>
          {created && new Date(created).toLocaleString("en-US")}
        </p>
      </div>
      <div className="OfferCard-secondRow">
        <p>
          <span>From:</span> {startingLocation && startingLocation}
        </p>
        <p>
          <span>To:</span> {endingLocation && endingLocation}
        </p>
      </div>
      <div className="OfferCard-thirdRow">
        <p>
          <span>Offerer:</span> {username && username}
        </p>
        <p>
          <span>Status: </span> {status && status}
        </p>
        {userId === getSessionCache()._id ? (
          <div className="OfferCard-buttons">
            <Button
              size="sm"
              variant="outline-danger"
              onClick={handleDeleteModalShow}
            >
              Delete
            </Button>
            <Button
              size="sm"
              variant="outline-info"
              onClick={handleEditModalShow}
            >
              Edit
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline-info" onClick={applyToOffer}>
            Apply
          </Button>
        )}
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  updateOfferList: () => dispatch(updateOfferList())
});

export default connect(null, mapDispatchToProps)(OfferCard);
