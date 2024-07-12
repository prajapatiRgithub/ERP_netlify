import React from "react";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseButton from "../../BaseComponents/BaseButton";
import { hrEnums } from "../../Constant/HR_Staff/hrEnums";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import { digitRegex, SelectPlaceHolder } from "../../Constant/validation";
import BaseSelect from "../../BaseComponents/BaseSelect";
import { Submit, Update } from "../../Constant";

const ProfileDetails = ({
  staffForm,
  viewProfileMode,
  handleProfileEdit,
  handleProfileDiscard,
  editProfileMode,
}) => {
  return (
    <>
      {viewProfileMode ? (
        <div id="profile-info" class="info-section">
          <div className="row mt-4">
            <div className="col-6">
              <h5 className="f-w-600">{hrEnums.PROFILE_INFO}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <BaseButton
                onClick={handleProfileEdit}
                className="btn btn-pill btn-primary mx-2"
              >
                {hrEnums.EDIT}
              </BaseButton>
            </div>
          </div>
          <div class="border-bottom mb-4 mt-2 mr-4"></div>
          <div class="row custom-section">
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.STAFF_NAME}</span>
                <br />
                <span class="f-w-600">
                  {hrEnums.staffData.first_name} {hrEnums.staffData.middle_name}{" "}
                  {hrEnums.staffData.last_name}
                </span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.ID}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.id}</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.DESIGNATION}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.designation}</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.STAFF_TYPE}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.staff_type}</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.CONTACT_NO}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.contact_no}</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.REPORTING_MANAGER}</span>
                <br />
                <span class="f-w-600">
                  {hrEnums.staffData.reporting_manager}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="profile-info" class="info-section">
          <div className="row mt-4">
            <div className="col-6">
              <h5 className="f-w-600">{hrEnums.PROFILE_INFO}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <BaseButton
                onClick={handleProfileDiscard}
                className="btn btn-pill btn-primary mx-2"
              >
                {hrEnums.DISCARD}
              </BaseButton>
              <BaseButton
                className="mx-2"
                color="primary"
                children={editProfileMode ? Update : Submit}
              ></BaseButton>
            </div>
          </div>
          <div class="border-bottom mb-4 mt-2 mr-4"></div>
          <div class="row custom-section">
            <div className="col-lg-3">
              <BaseInput
                label={<>{hrEnums.FIRST_NAME}<span className="text-danger">*</span></>}
                name="first_name"
                type="text"
                placeholder={PlaceHolderFormat(hrEnums.FIRST_NAME)}
                value={staffForm.values.first_name}
                touched={staffForm.touched.first_name}
                error={staffForm.errors.first_name}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseInput
                name="middle_name"
                type="text"
                label={<>{hrEnums.MIDDLE_NAME}<span className="text-danger">*</span></>}
                placeholder={PlaceHolderFormat(hrEnums.MIDDLE_NAME)}
                value={staffForm.values.middle_name}
                touched={staffForm.touched.middle_name}
                error={staffForm.errors.middle_name}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseInput
                name="last_name"
                type="text"
                label={<>{hrEnums.LAST_NAME}<span className="text-danger">*</span></>}
                placeholder={PlaceHolderFormat(hrEnums.LAST_NAME)}
                value={staffForm.values.last_name}
                touched={staffForm.touched.last_name}
                error={staffForm.errors.last_name}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseSelect
                name="designation"
                label={hrEnums.DESIGNATION}
                className="select-border"
                options={hrEnums.option}
                placeholder={SelectPlaceHolder(hrEnums.DESIGNATION)}
                handleChange={(field, value) => {
                  staffForm.setFieldValue(field, value);
                }}
                handleBlur={() =>
                  staffForm.setFieldTouched(hrEnums.DESIGNATION, true)
                }
                value={staffForm.values.designation}
                touched={staffForm.touched.designation}
                error={staffForm.errors.designation}
              />
            </div>
            <div className="col-lg-3">
              <BaseSelect
                name="staff_type"
                label={hrEnums.STAFF_TYPE}
                className="select-border"
                options={hrEnums.option}
                placeholder={SelectPlaceHolder(hrEnums.STAFF_TYPE)}
                handleChange={(field, value) => {
                  staffForm.setFieldValue(field, value);
                }}
                handleBlur={() =>
                  staffForm.setFieldTouched(hrEnums.STAFF_TYPE, true)
                }
                value={staffForm.values.staff_type}
                touched={staffForm.touched.staff_type}
                error={staffForm.errors.staff_type}
              />
            </div>
            <div className="col-lg-3">
              <BaseInput
                name="contact_no"
                type="text"
                label={hrEnums.CONTACT_NO}
                placeholder={PlaceHolderFormat(hrEnums.CONTACT_NO)}
                value={staffForm.values.contact_no}
                touched={staffForm.touched.contact_no}
                error={staffForm.errors.contact_no}
                handleBlur={staffForm.handleBlur}
                handleChange={(e) => {
                  if (
                    e?.target?.value?.length <= 10 &&
                    digitRegex.test(e?.target?.value)
                  ) {
                    staffForm.handleChange(e);
                  }
                }}
              />
            </div>
            <div className="col-lg-3">
              <BaseSelect
                name="reporting_manager"
                label={hrEnums.REPORTING_MANAGER}
                className="select-border"
                options={hrEnums.option}
                placeholder={SelectPlaceHolder(hrEnums.REPORTING_MANAGER)}
                handleChange={(field, value) => {
                  staffForm.setFieldValue(field, value);
                }}
                handleBlur={() =>
                  staffForm.setFieldTouched(hrEnums.REPORTING_MANAGER, true)
                }
                value={staffForm.values.reporting_manager}
                touched={staffForm.touched.reporting_manager}
                error={staffForm.errors.reporting_manager}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileDetails;
