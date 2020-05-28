import React from "react";
import person_avatar from "../../assets/person.png";
import "./Avatar.scss";

const Avatar = (props) => {
	return (
		<div className="avatar">
			<img src={props.avatar ? props.avatar : person_avatar} alt="" />
		</div>
	);
};

export default Avatar;
