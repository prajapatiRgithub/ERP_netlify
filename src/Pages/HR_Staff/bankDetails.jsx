import React from "react";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseButton from "../../BaseComponents/BaseButton";
import { hrEnums } from "../../Constant/HR_Staff/hrEnums";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import { Submit, Update } from "../../Constant";

const BankDetails = ({
  staffForm,
  viewBankMode,
  handleBankEdit,
  handleBankDiscard,
  editBankMode,
}) => {
  return (
    <>
      {viewBankMode ? (
        <div id="bank-info" className="info-section">
          <div className="row mt-4">
            <div className="col-6">
              <h5 className="f-w-600">{hrEnums.BANK_INFO}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <BaseButton
                onClick={handleBankEdit}
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
                <span className="text-secondary">{hrEnums.NAME_OF_BANK}</span>
                <br />
                <span className="f-w-600">{hrEnums.staffData.bank_name}</span>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <div>
                <span className="text-secondary">{hrEnums.IFSC_CODE}</span>
                <br />
                <span className="f-w-600">{hrEnums.staffData.ifsc_code}</span>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <div>
                <span className="text-secondary">{hrEnums.ACCOUNT_NO}</span>
                <br />
                <span className="f-w-600">{hrEnums.staffData.account_number}</span>
              </div>
            </div>
            <div className="col-6 col-md-3 mb-3">
              <div>
                <span className="text-secondary">{hrEnums.ACCOUNT_HOLDER_NAME}</span>
                <br />
                <span className="f-w-600">{hrEnums.staffData.account_holder_name}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="bank-info" className="info-section">
          <div className="row mt-4">
            <div className="col-6">
              <h5 className="f-w-600">{hrEnums.BANK_INFO}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <BaseButton
                onClick={handleBankDiscard}
                className="btn btn-pill btn-primary mx-2"
              >
                {hrEnums.DISCARD}
              </BaseButton>
              <BaseButton
                className="mx-2"
                color="primary"
                children={editBankMode ? Update : Submit}
              ></BaseButton>
            </div>
          </div>
          <div className="border-bottom mb-4 mt-2 mr-4"></div>
          <div className="row custom-section">
            <div className="col-lg-3">
              <BaseInput
                label={hrEnums.NAME_OF_BANK}
                name="bank_name"
                type="text"
                placeholder={PlaceHolderFormat(hrEnums.NAME_OF_BANK)}
                value={staffForm.values.bank_name}
                touched={staffForm.touched.bank_name}
                error={staffForm.errors.bank_name}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseInput
                name="ifsc"
                type="text"
                label={hrEnums.IFSC_CODE}
                placeholder={PlaceHolderFormat(hrEnums.IFSC_CODE)}
                value={staffForm.values.ifsc}
                touched={staffForm.touched.ifsc}
                error={staffForm.errors.ifsc}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseInput
                name="account_number"
                type="text"
                label={hrEnums.ACCOUNT_NO}
                placeholder={PlaceHolderFormat(hrEnums.ACCOUNT_NO)}
                value={staffForm.values.account_number}
                touched={staffForm.touched.account_number}
                error={staffForm.errors.account_number}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseInput
                name="account_holder_name"
                type="text"
                label={hrEnums.ACCOUNT_HOLDER_NAME}
                placeholder={PlaceHolderFormat(hrEnums.ACCOUNT_HOLDER_NAME)}
                value={staffForm.values.account_holder_name}
                touched={staffForm.touched.account_holder_name}
                error={staffForm.errors.account_holder_name}
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

export default BankDetails;
