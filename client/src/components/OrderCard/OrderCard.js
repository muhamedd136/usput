import { getSuccessToast, getFailToast } from "../../shared/utils";
import { updateOfferList } from "../../redux/offers/actions";
import { Button } from "react-bootstrap";
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
				getSuccessToast("Order canceled successfuly.");
				console.log("Order canceled successfuly.");
				updateOfferList();
			})
			.catch(() => {
				console.log("Could not cancel order, try again.");
				getFailToast("Order failed to be canceled, please contact the administrator.");
			});
	};

	const completeOrder = async () => {
		orderBody.status = "completed";

		await order
			.complete(id, orderBody)
			.then(() => {
				getSuccessToast("Order successfuly comleted.");
				console.log("Order successfuly comleted.");
				updateOfferList();
			})
			.catch(() => {
				getFailToast("Order failed to be completed, please contact the administrator.");
				console.log("Could not complete order, try again.");
			});
	};

	return (
		<div className="OrderCard">
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
							<Button size="sm" variant="outline-danger" onClick={cancelApplication}>
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
							<Button size="sm" variant="outline-danger" onClick={cancelApplication}>
								Decline
							</Button>
							<Button size="sm" variant="outline-info" onClick={completeOrder}>
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
