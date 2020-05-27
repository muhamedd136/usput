import React from "react";

import "./Avatar.scss";

const Avatar = (props) => {
  return (
    <div className="avatar">
      <img
        src={
          props.avatar
            ? props.avatar
            : "https://lh3.googleusercontent.com/proxy/CRoLGshXRUTaru27uJkfutTmMtRGGuVzf87C3bVkdgo0xPvDb1nI3aLCnIRjaW_8nGr58EMerVy0Fny36zLT82a1SmfI4PH8IbWe8oFafrKjsIU9RIdC-GXtvLelI1bHkA"
        }
        alt=""
      />
    </div>
  );
};

export default Avatar;
