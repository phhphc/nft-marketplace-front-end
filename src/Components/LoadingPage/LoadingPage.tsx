import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const LoadingPage = () => {
  return (
    <div id="loading-page">
      <div className="card flex">
        <ProgressSpinner strokeWidth="5" />
      </div>
    </div>
  );
};

export default LoadingPage;
