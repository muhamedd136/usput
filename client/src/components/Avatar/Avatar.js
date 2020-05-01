import React from "react";

import "./Avatar.scss";

const Avatar = props => {
  return (
    <div className="avatar">
      <img
        src={
          props.avatar
            ? props.avatar
            : "https://retohercules.com/images/png-avatar-3.png"
        }
        alt=""
      />
    </div>
  );
};

export default Avatar;
