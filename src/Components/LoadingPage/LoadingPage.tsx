import React from "react";

const LoadingPage = () => {
  return (
    <div id="loading-page">
      <div className="spinner">
        <span>Loading...</span>
        <div className="half-spinner"></div>
      </div>
    </div>
  );
};

export default LoadingPage;
