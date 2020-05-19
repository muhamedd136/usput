import React, { Component } from "react";
import jwt_decode from "jwt-decode";
class Auth extends Component {
	constructor(props) {
		super(props);
	}

	/* Check the validity of the JWT  */
	componentDidMount = () => {
		console.log("Bidnem tu");
		/* If a token is already set, redirect to (logged in) homepage */
		if (localStorage.getItem("access_token")) {
			this.props.history.push("/profile");
		} else {
			/* Otherwise, take the token from the URL, store it and then redirect to the appropriate page */
			let token = new URL(document.location).hash.split("#jwt=")[1];
			if (!token) {
				// no token (in case someone tries to manully access the /auth route)
				this.props.history.push("/");
			} else {
				let decoded;
				try {
					decoded = jwt_decode(token);
					localStorage.setItem("access_token", token);
					localStorage.setItem("user_cache", JSON.stringify(decoded));
				} catch (error) {
					this.props.history.push("/");
				}
				this.props.history.push("/profile");
			}
		}
	};

	render() {
		return <div></div>;
	}
}

export default Auth;
