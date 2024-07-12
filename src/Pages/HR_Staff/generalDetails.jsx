import React from "react";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseButton from "../../BaseComponents/BaseButton";
import { hrEnums } from "../../Constant/HR_Staff/hrEnums";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import { SelectPlaceHolder } from "../../Constant/validation";
import BaseSelect from "../../BaseComponents/BaseSelect";
import { Submit, Update } from "../../Constant";

const GeneralDetails = ({
  staffForm,
  viewGeneralMode,
  handleGeneralEdit,
  handleGeneralDiscard,
  editGeneralMode,
}) => {
  return (
    <>
      {viewGeneralMode ? (
        <div id="general-info" class="info-section">
          <div className="row mt-4">
            <div className="col-6">
              <h5 className="f-w-600">{hrEnums.GENERAL_INFO}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <BaseButton
                onClick={handleGeneralEdit}
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
                <span class="text-secondary">{hrEnums.SALARY_CYCLE}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.salary_cycle}</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.WEEK_OFF}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.week_off}</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.HOLIDAY_TEMPLATE}</span>
                <br />
                <span class="f-w-600">
                  {hrEnums.staffData.holiday_template}
                </span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.LEAVE_TEMPLATE}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.leave_template}</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.SHIFT}</span>
                <br />
                <span class="f-w-600">-</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.SALARY_ACCESS}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.salary_access}</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.ATTENDANCE_MODE}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.attendance_mode}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="general-info" class="info-section">
          <div className="row mt-4">
            <div className="col-6">
              <h5 className="f-w-600">{hrEnums.GENERAL_INFO}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <BaseButton
                onClick={handleGeneralDiscard}
                className="btn btn-pill btn-primary mx-2"
              >
                {hrEnums.DISCARD}
              </BaseButton>
              <BaseButton
                className="mx-2"
                color="primary"
                children={editGeneralMode ? Update : Submit}
              ></BaseButton>
            </div>
          </div>
          <div class="border-bottom mb-4 mt-2 mr-4"></div>
          <div class="row custom-section">
            <div className="col-lg-3">
              <BaseInput
                label={<>{hrEnums.SALARY_CYCLE}<span className="text-danger">*</span></>}
                name="salary_cycle"
                type="text"
                placeholder={PlaceHolderFormat(hrEnums.SALARY_CYCLE)}
                value={staffForm.values.salary_cycle}
                touched={staffForm.touched.salary_cycle}
                error={staffForm.errors.salary_cycle}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseSelect
                name="week_off"
                label={hrEnums.WEEK_OFF}
                className="select-border"
                options={hrEnums.option}
                placeholder={SelectPlaceHolder(hrEnums.WEEK_OFF)}
                handleChange={(field, value) => {
                  staffForm.setFieldValue(field, value);
                }}
                handleBlur={() =>
                  staffForm.setFieldTouched(hrEnums.WEEK_OFF, true)
                }
                value={staffForm.values.week_off}
                touched={staffForm.touched.week_off}
                error={staffForm.errors.week_off}
              />
            </div>
            <div className="col-lg-3">
              <BaseSelect
                name="holiday_template"
                label={hrEnums.HOLIDAY_TEMPLATE}
                className="select-border"
                options={hrEnums.option}
                placeholder={SelectPlaceHolder(hrEnums.HOLIDAY_TEMPLATE)}
                handleChange={(field, value) => {
                  staffForm.setFieldValue(field, value);
                }}
                handleBlur={() =>
                  staffForm.setFieldTouched(hrEnums.HOLIDAY_TEMPLATE, true)
                }
                value={staffForm.values.holiday_template}
                touched={staffForm.touched.holiday_template}
                error={staffForm.errors.holiday_template}
              />
            </div>
            <div className="col-lg-3">
              <BaseSelect
                name="leave_template"
                label={hrEnums.LEAVE_TEMPLATE}
                className="select-border"
                options={hrEnums.option}
                placeholder={SelectPlaceHolder(hrEnums.LEAVE_TEMPLATE)}
                handleChange={(field, value) => {
                  staffForm.setFieldValue(field, value);
                }}
                handleBlur={() =>
                  staffForm.setFieldTouched(hrEnums.LEAVE_TEMPLATE, true)
                }
                value={staffForm.values.leave_template}
                touched={staffForm.touched.leave_template}
                error={staffForm.errors.leave_template}
              />
            </div>
            <div className="col-lg-3">
              <BaseSelect
                name="shift"
                label={hrEnums.SHIFT}
                className="select-border"
                options={hrEnums.option}
                placeholder={SelectPlaceHolder(hrEnums.SHIFT)}
                handleChange={(field, value) => {
                  staffForm.setFieldValue(field, value);
                }}
                handleBlur={() =>
                  staffForm.setFieldTouched(hrEnums.SHIFT, true)
                }
                value={staffForm.values.shift}
                touched={staffForm.touched.shift}
                error={staffForm.errors.shift}
              />
            </div>
            <div className="col-lg-3">
              <BaseSelect
                name="salary_access"
                label={<>{hrEnums.SALARY_ACCESS}<span className="text-danger">*</span></>}
                className="select-border"
                options={hrEnums.option}
                placeholder={SelectPlaceHolder(hrEnums.SALARY_ACCESS)}
                handleChange={(field, value) => {
                  staffForm.setFieldValue(field, value);
                }}
                handleBlur={() =>
                  staffForm.setFieldTouched(hrEnums.SALARY_ACCESS, true)
                }
                value={staffForm.values.salary_access}
                touched={staffForm.touched.salary_access}
                error={staffForm.errors.salary_access}
              />
            </div>
            <div className="col-lg-3">
              <BaseSelect
                name="attendance_mode"
                label={hrEnums.ATTENDANCE_MODE}
                className="select-border"
                options={hrEnums.option}
                placeholder={SelectPlaceHolder(hrEnums.ATTENDANCE_MODE)}
                handleChange={(field, value) => {
                  staffForm.setFieldValue(field, value);
                }}
                handleBlur={() =>
                  staffForm.setFieldTouched(hrEnums.ATTENDANCE_MODE, true)
                }
                value={staffForm.values.attendance_mode}
                touched={staffForm.touched.attendance_mode}
                error={staffForm.errors.attendance_mode}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeneralDetails;
