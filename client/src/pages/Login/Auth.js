import jwt_decode from "jwt-decode";
import React, { useEffect } from "react";
function Auth(props) {
	/* Check the validity of the JWT  */
	useEffect(() => {
		/* If a token is already set, redirect to (logged in) homepage */
		if (localStorage.getItem("access_token")) {
			props.history.push("/profile");
		} else {
			/* Otherwise, take the token from the URL, store it and then redirect to the appropriate page */
			let token = new URL(document.location).hash.split("#jwt=")[1];
			if (!token) {
				// no token (in case someone tries to manully access the /auth route)
				props.history.push("/");
			} else {
				let decoded;
				try {
					decoded = jwt_decode(token);
					localStorage.setItem("access_token", token);
					localStorage.setItem("user_cache", JSON.stringify(decoded));
				} catch (error) {
					this.props.history.push("/");
				}
				props.history.push("/profile");
			}
		}
	});

	return <div></div>;
}

export default Auth;
