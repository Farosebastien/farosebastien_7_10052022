import React from "react";

import "../../Styles/Components/LoadingSpinner/LoadingSpinner.css"

const LoadingSpinner = (props) => {
    return (
        <div className={`${props.asOverlay && "loading-spinner__overlay"}`}>
            <div className="lds-dual-ring"></div>
        </div>
    );
};

export default LoadingSpinner;