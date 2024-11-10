import React from "react";
import logo from "../assets/blog-logo.png";
function Logo({ width = "100px" }) {
    return (
        <div>
            <img src={logo} alt="Logo" width="50px"/>
        </div>
    )

}

export default Logo;