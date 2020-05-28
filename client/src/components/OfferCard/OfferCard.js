import { updateOfferList } from "../../redux/offers/actions";
import { getSessionCache } from "../../shared/utils";
import { Button, Modal } from "react-bootstrap";
import { order, offer } from "../../api";
import React, { useState } from "react";
import { connect } from "react-redux";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import {
  getSuccessToast,
  validateAddress,
  getFailToast,
  validateName,
  formValid,
} from "../../shared/utils";
import "./OfferCard.scss";

const OfferCard = (props) => {
  const {
    startingLocation,
    updateOfferList,
    endingLocation,
    isRemoved,
    username,
    created,
    userId,
    status,
    price,
    name,
    id,
  } = props;

  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [applyModalShow, setApplyModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [stateModal, setStateModal] = useState(false);

  const [editOfferData, setEditOfferData] = useState({
    userId: userId,
    username: username,
    name: name,
    price: price,
    created: created,
    startingLocation: startingLocation,
    endingLocation: endingLocation,
    status: status,
    isRemoved: false,
  });
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    startingLocation: "",
    endingLocation: "",
  });

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

    setEditOfferData({
      ...editOfferData,
      [name]: value,
    });
  };

  const handleDeleteModalShow = () => {
    setDeleteModalShow(!deleteModalShow);
  };

  const handleApplyModalShow = () => {
    setApplyModalShow(!applyModalShow);
  };

  const handleEditModalShow = () => {
    setEditModalShow(!editModalShow);
  };

  const submitEditForm = async (event) => {
    event.preventDefault();

    if (formValid(errors, { name, price, startingLocation, endingLocation })) {
      setStateModal(true);
      await offer
        .update(id, editOfferData)
        .then(() => {
          getSuccessToast("Successfuly updated offer.");
          setStateModal(false);
          handleEditModalShow();
          updateOfferList();
        })
        .catch(() => {
          getFailToast(
            "Offer failed to be updated, please contact the administrator."
          );
          setStateModal(false);
        });
    } else {
      console.error("FORM INVALID - CHECK ALL FIELDS");
    }
  };

  const applyToOffer = async () => {
    setStateModal(true);
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
        isRemoved: isRemoved,
      })
      .then(() => {
        getSuccessToast("Successfuly applied to offer.");
        updateOfferList();
        handleApplyModalShow();
        setStateModal(false);
      })
      .catch(() => {
        getFailToast(
          "Failed to apply to offer, please contact the administrator."
        );
        setStateModal(false);
      });
  };

  const deleteOffer = async () => {
    setStateModal(true);
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
        isRemoved: true,
      })
      .then(() => {
        getSuccessToast("Offer successfuly deleted.");
        setStateModal(false);
        handleDeleteModalShow();
        updateOfferList();
      })
      .catch(() => {
        setStateModal(false);
        getFailToast(
          "Failed to delete offer, please contact the administrator."
        );
      });
  };

  const editOfferFormMarkup = (
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
          value={editOfferData.name}
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
          value={editOfferData.price}
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
          value={editOfferData.startingLocation}
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
          value={editOfferData.endingLocation}
        />
        {errors.endingLocation.length > 0 && (
          <span className="input-errorMessage">{errors.endingLocation}</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="OfferCard">
      <Modal centered show={applyModalShow} onHide={handleApplyModalShow}>
        <BlockUi tag="div" blocking={stateModal}>
          <Modal.Header closeButton>
            <Modal.Title>Apply to offer</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to apply to this offer?</Modal.Body>
          <Modal.Footer>
            <Button
              size="md"
              variant="outline-danger"
              onClick={handleApplyModalShow}
            >
              Close
            </Button>
            <Button size="md" variant="info" onClick={applyToOffer}>
              Apply
            </Button>
          </Modal.Footer>
        </BlockUi>
      </Modal>
      <Modal centered show={deleteModalShow} onHide={handleDeleteModalShow}>
        <BlockUi tag="div" blocking={stateModal}>
          <Modal.Header closeButton>
            <Modal.Title>Delete offer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this offer? There is no going back
            if you accept.
          </Modal.Body>
          <Modal.Footer>
            <Button
              size="md"
              variant="outline-info"
              onClick={handleDeleteModalShow}
            >
              Close
            </Button>
            <Button size="md" variant="danger" onClick={deleteOffer}>
              Delete
            </Button>
          </Modal.Footer>
        </BlockUi>
      </Modal>
      <Modal centered show={editModalShow} onHide={handleEditModalShow}>
        <BlockUi tag="div" blocking={stateModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit offer</Modal.Title>
          </Modal.Header>
          <Modal.Body>{editOfferFormMarkup}</Modal.Body>
          <Modal.Footer>
            <Button
              size="md"
              variant="outline-danger"
              onClick={handleEditModalShow}
            >
              Close
            </Button>
            <Button size="md" variant="info" onClick={submitEditForm}>
              Save
            </Button>
          </Modal.Footer>
        </BlockUi>
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
          <span>Offerer:</span>{" "}
          <a href={`/profile/${userId}`}>{username && username}</a>
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
          <Button
            size="sm"
            variant="outline-info"
            onClick={handleApplyModalShow}
          >
            Apply
          </Button>
        )}
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateOfferList: () => dispatch(updateOfferList()),
});

export default connect(null, mapDispatchToProps)(OfferCard);
