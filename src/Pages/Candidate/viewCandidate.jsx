import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { viewOfCandidate } from "../../Api/CandidateApi";
import { StatusCodes } from "http-status-codes";
import Spinner from "../../BaseComponents/BaseLoader";
import { CandidateLabel } from "../../Constant/Candidate/candidate";
import { BaseImageURL } from "../../Api/Service";
import { handleResponse } from "../../Constant/common";
import { viewCandidateTitle } from "../../Constant/title";
import {
  AadharBack,
  AadharFront,
  BankPassbook,
  QualificationCertificate,
  passport,
} from "../../Constant/Inquiry/Inquiry";
import { RiSearchLine } from "react-icons/ri";
import { notFound } from "../../Constant";
import moment from "moment";

const ViewCandidate = () => {
  document.title = viewCandidateTitle;
  const { candidateId } = useParams();
  const [loader, setLoader] = useState(false);
  const [candidate, setCandidate] = useState([]);

  const fetchData = () => {
    setLoader(true);
    viewOfCandidate(candidateId)
      .then((response) => {
        if (
          response?.statusCode === StatusCodes.ACCEPTED ||
          response?.statusCode === StatusCodes.OK ||
          response?.statusCode === StatusCodes.CREATED
        ) {
          setCandidate(response?.data);
        }
      })
      .catch((err) => {
        return err;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBack = () => {
    const referrer = document.referrer;
    if (referrer.includes("/candidate")) {
      window.location.href = "/candidate";
    } else if (referrer.includes("/placement")) {
      window.location.href = "/placement";
    } else {
      window.history.back();
    }
  };

  return (
    <div className="page-body">
      {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
      <div className="container-fluid">
        <div className="page-header dash-breadcrumb py-3">
          <div className="row">
            <div className="col-6">
              <h3 className="f-w-600">{CandidateLabel.candidateDetails}</h3>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <button
                onClick={handleBack}
                className="btn btn-pill btn-primary mx-2"
              >
                {CandidateLabel.back}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <div className="section mb-4" id="personalDetails">
              <h6 className="p-2 bg-light text-dark">
                <b>{CandidateLabel.personalDetails}</b>
              </h6>
              <div className="row p-2">
                <div className="col-3">
                  <strong>{CandidateLabel.name}</strong>
                </div>
                <div className="col-3">{candidate.candidate_name}</div>
                <div className="col-3">
                  <strong>{CandidateLabel.email}</strong>
                </div>
                <div className="col-3">{candidate?.email_id || "--"}</div>
                <div className="col-3">
                  <strong>{CandidateLabel.contactNumber}</strong>
                </div>
                <div className="col-3">{candidate?.contact_no}</div>
                <div className="col-3">
                  <strong>{CandidateLabel.aadharNumber}</strong>
                </div>
                <div className="col-3">
                  {candidate.candidateDetail?.aadhar_no}
                </div>
                <div className="col-3">
                  <strong>{CandidateLabel.address}</strong>
                </div>
                <div className="col-3">{candidate?.address}</div>
                <div className="col-3">
                  <strong>{CandidateLabel.gender}</strong>
                </div>
                <div className="col-3">
                  {candidate?.candidateDetail?.gender}
                </div>
              </div>
            </div>
            <div className="section mb-4" id="otherDetails">
              <h6 className="p-2 bg-light text-dark">
                <b>{CandidateLabel.otherDetails}</b>
              </h6>
              <div className="row p-2">
                <div className="col-3">
                  <strong>{CandidateLabel.fatherName}</strong>
                </div>
                <div className="col-3">
                  {candidate?.candidateDetail?.father_name}
                </div>
                <div className="col-3">
                  <strong>{CandidateLabel.motherName}</strong>
                </div>
                <div className="col-3">
                  {candidate?.candidateDetail?.mother_name}
                </div>
                <div className="col-3">
                  <strong>{CandidateLabel.qualification}</strong>
                </div>
                <div className="col-3">
                  {candidate?.candidateDetail?.qualification?.name}
                </div>
                <div className="col-3">
                  <strong>{CandidateLabel.category}</strong>
                </div>
                <div className="col-3">
                  {candidate?.candidateDetail?.caste_category}
                </div>
                <div className="col-3">
                  <strong>{CandidateLabel.sector}</strong>
                </div>
                <div className="col-3">
                  {candidate?.candidateDetail?.sector}
                </div>
                <div className="col-3">
                  <strong>{CandidateLabel.centerName}</strong>
                </div>
                <div className="col-3">{candidate?.center?.center_name}</div>
                <div className="col-3">
                  <strong>{CandidateLabel.courseName}</strong>
                </div>
                <div className="col-3">{candidate?.course?.course_name}</div>
                <div className="col-3">
                  <strong>{CandidateLabel.batchId}</strong>
                </div>
                <div className="col-3">
                  {candidate?.batchAssign?.batch?.batch_id}
                </div>
                <div className="col-3">
                  <strong>{CandidateLabel.status}</strong>
                </div>
                <div className="col-3">{candidate?.batchAssign?.status}</div>
                <div className="col-3">
                  <strong>{CandidateLabel.reference}</strong>
                </div>
                <div className="col-3">{candidate?.source}</div>
                <div className="col-3">
                  <strong>{passport}:</strong>
                </div>
                <div className="col-3">
                  {candidate?.candidateDocument?.passport_photo ? (
                    <a
                      href={`${BaseImageURL}${candidate?.candidateDocument?.passport_photo}`}
                      className="text-decoration-underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {CandidateLabel.viewCertificate}
                    </a>
                  ) : (
                    handleResponse.nullData
                  )}
                </div>
                <div className="col-3">
                  <strong>{AadharFront}:</strong>
                </div>
                <div className="col-3">
                  {candidate?.candidateDocument?.aadharCard_front ? (
                    <a
                      href={`${BaseImageURL}${candidate?.candidateDocument?.aadharCard_front}`}
                      className="text-decoration-underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {CandidateLabel.viewCertificate}
                    </a>
                  ) : (
                    handleResponse.nullData
                  )}
                </div>
                <div className="col-3">
                  <strong>{AadharBack}:</strong>
                </div>
                <div className="col-3">
                  {candidate?.candidateDocument?.aadharCard_back ? (
                    <a
                      href={`${BaseImageURL}${candidate?.candidateDocument?.aadharCard_back}`}
                      className="text-decoration-underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {CandidateLabel.viewCertificate}
                    </a>
                  ) : (
                    handleResponse.nullData
                  )}
                </div>
                <div className="col-3">
                  <strong>{BankPassbook}:</strong>
                </div>
                <div className="col-3">
                  {candidate?.candidateDocument?.bank_passbook ? (
                    <a
                      href={`${BaseImageURL}${candidate?.candidateDocument?.bank_passbook}`}
                      className="text-decoration-underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {CandidateLabel.viewCertificate}
                    </a>
                  ) : (
                    handleResponse.nullData
                  )}
                </div>
                <div className="col-3">
                  <strong>{QualificationCertificate}:</strong>
                </div>
                <div className="col-3">
                  {candidate?.candidateDocument?.qualification_certificate ? (
                    <a
                      href={`${BaseImageURL}${candidate?.candidateDocument?.qualification_certificate}`}
                      className="text-decoration-underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {CandidateLabel.viewCertificate}
                    </a>
                  ) : (
                    handleResponse.nullData
                  )}
                </div>
                <div className="col-3">
                  <strong>{CandidateLabel.assessmentLable}</strong>
                </div>
                <div className="col-3">
                  {moment(candidate?.candidateDetail?.assessment_date).format(
                    "DD-MM-YYYY"
                  ) || handleResponse.nullData}
                </div>
                <div className="col-3">
                  <strong>{CandidateLabel.certificate1}</strong>
                </div>
                <div className="col-3">
                  {candidate?.candidateDetail?.certificate ? (
                    <a
                      href={`${BaseImageURL}${candidate?.candidateDetail?.certificate}`}
                      className="text-decoration-underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {CandidateLabel.viewCertificate}
                    </a>
                  ) : (
                    handleResponse.nullData
                  )}
                </div>
              </div>
            </div>
            <div className="section" id="placementDetails">
              <h6 className="p-2 bg-light text-dark">
                <b>{CandidateLabel.placementDetails}</b>
              </h6>
              {candidate?.placementDetails?.length > 0 ? (
                candidate?.placementDetails?.map((placement, index) => (
                  <div key={index} className="row p-2">
                    <div className="col-3">
                      <strong>{CandidateLabel.companyName}</strong>
                    </div>
                    <div className="col-3">
                      {placement?.company_name || handleResponse.nullData}
                    </div>
                    <div className="col-3">
                      <strong>{CandidateLabel.position}</strong>
                    </div>
                    <div className="col-3">
                      {placement?.position || handleResponse.nullData}
                    </div>
                    <div className="col-3">
                      <strong>{CandidateLabel.joiningDate}</strong>
                    </div>
                    <div className="col-3">
                      {placement?.joining_date || handleResponse.nullData}
                    </div>
                    <div className="col-3">
                      <strong>{CandidateLabel.appointmentLetter}</strong>
                    </div>
                    <div className="col-3">
                      {placement?.appointment_letter ? (
                        <a
                          href={`${BaseImageURL}${placement?.appointment_letter}`}
                          className="text-decoration-underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {CandidateLabel.viewAppointmentLetter}
                        </a>
                      ) : (
                        handleResponse.nullData
                      )}
                    </div>
                    <div className="col-3">
                      {candidate?.candidateDetail?.certificate ? (
                        <a
                          href={`${BaseImageURL}${candidate?.candidateDetail?.certificate}`}
                          className="text-decoration-underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {CandidateLabel.viewCertificate}
                        </a>
                      ) : (
                        handleResponse.nullData
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center">
                  <div>
                    <RiSearchLine className="fs-2" />
                  </div>
                  <div className="mt-4">
                    <h5>{notFound.dataNotFound}</h5>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Container-fluid Ends*/}
    </div>
  );
};

export default ViewCandidate;
