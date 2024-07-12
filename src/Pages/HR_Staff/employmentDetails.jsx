import React from "react";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseButton from "../../BaseComponents/BaseButton";
import { hrEnums } from "../../Constant/HR_Staff/hrEnums";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import { Submit, Update } from "../../Constant";

const EmploymentDetails = ({
  staffForm,
  viewEmploymentMode,
  handleEmploymentEdit,
  handleEmploymentDiscard,
  editEmploymentMode,
}) => {
  return (
    <>
      {viewEmploymentMode ? (
        <div id="employment-info" className="info-section">
          <div className="row mt-4">
            <div className="col-6">
              <h5 className="f-w-600">{hrEnums.EMPLOYMENT_INFO}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <BaseButton
                onClick={handleEmploymentEdit}
                className="btn btn-pill btn-primary mx-2"
              >
                {hrEnums.EDIT}
              </BaseButton>
            </div>
          </div>
          <div className="border-bottom mb-4 mt-2 mr-4"></div>
          <div className="row custom-section">
            <div className="col-6 col-md-3 mb-3">
              <div>
                <span className="text-secondary">{hrEnums.JOINING_DATE}</span>
                <br />
                <span className="f-w-600">
                  {hrEnums.staffData.joining_date}
                </span>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <div>
                <span className="text-secondary">{hrEnums.UAN}</span>
                <br />
                <span className="f-w-600">{hrEnums.staffData.uan}</span>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <div>
                <span className="text-secondary">{hrEnums.PAN}</span>
                <br />
                <span className="f-w-600">{hrEnums.staffData.pan}</span>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <div>
                <span className="text-secondary">{hrEnums.AADHAR_NUMBER}</span>
                <br />
                <span className="f-w-600">{hrEnums.staffData.aadhar}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="employment-info" className="info-section">
          <div className="row mt-4">
            <div className="col-6">
              <h5 className="f-w-600">{hrEnums.EMPLOYMENT_INFO}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <BaseButton
                onClick={handleEmploymentDiscard}
                className="btn btn-pill btn-primary mx-2"
              >
                {hrEnums.DISCARD}
              </BaseButton>
              <BaseButton
                className="mx-2"
                color="primary"
                children={editEmploymentMode ? Update : Submit}
              ></BaseButton>
            </div>
          </div>
          <div className="border-bottom mb-4 mt-2 mr-4"></div>
          <div className="row custom-section">
            <div className="col-lg-3">
              <BaseInput
                label={hrEnums.JOINING_DATE}
                name="joining_date"
                type="date"
                placeholder={PlaceHolderFormat(hrEnums.JOINING_DATE)}
                value={staffForm.values.joining_date}
                touched={staffForm.touched.joining_date}
                error={staffForm.errors.joining_date}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseInput
                name="uan"
                type="text"
                label={hrEnums.UAN}
                placeholder={PlaceHolderFormat(hrEnums.UAN)}
                value={staffForm.values.uan}
                touched={staffForm.touched.uan}
                error={staffForm.errors.uan}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseInput
                name="pan"
                type="text"
                label={hrEnums.PAN}
                placeholder={PlaceHolderFormat(hrEnums.PAN)}
                value={staffForm.values.pan}
                touched={staffForm.touched.pan}
                error={staffForm.errors.pan}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseInput
                name="aadhar_number"
                type="text"
                label={hrEnums.AADHAR_NUMBER}
                placeholder={PlaceHolderFormat(hrEnums.AADHAR_NUMBER)}
                value={staffForm.values.aadhar_number}
                touched={staffForm.touched.aadhar_number}
                error={staffForm.errors.aadhar_number}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmploymentDetails;
