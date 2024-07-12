import React from "react";
import img from "../../assets/images/404.png";
import img2 from '../../assets/images/logo/logo.png';
import { useNavigate } from "react-router-dom";
import BaseButton from "../../BaseComponents/BaseButton";

const NotFound = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="notFound">
     <img src={img2} alt="logo" className="img-fluid mb-5" height={50} width={100} />
      <img className="m-5" src={img} alt="404" height={300} width={250} />
      <h3 className="my-4 fs-5">404 | This page could not be found.</h3>
      <BaseButton
        className="btn btn-primary btn-sm btn-pill"
        onClick={handleBack}
        children="Back"
      />
    </div>
  );
};

export default NotFound;
