import Header from "../../components/Header/Header";
import Profile from "../../pages/Profile/Profile";
import { Route, Switch } from "react-router-dom";
import Offers from "../../pages/Offers/Offers";
import Orders from "../../pages/Orders/Orders";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Routes = () => {
	return (
		<div>
			<Route component={Header} />
			<ToastContainer />
			<div className="container">
				<Switch>
					<Route exact path="/profile" component={Profile} />
					<Route exact path="/offers" component={Offers} />
					<Route exact path="/orders" component={Orders} />
					<Route path="*" component={Profile} />
				</Switch>
			</div>
		</div>
	);
};

export default Routes;
