import React from "react";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseButton from "../../BaseComponents/BaseButton";
import { hrEnums } from "../../Constant/HR_Staff/hrEnums";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import { digitRegex, SelectPlaceHolder } from "../../Constant/validation";
import BaseSelect from "../../BaseComponents/BaseSelect";
import { Email, Submit, Update } from "../../Constant";
import BaseRadioGroup from "../../BaseComponents/BaseRadio";
import { radioOptions } from "../../Constant/Inquiry/Inquiry";

const PersonalDetails = ({
  staffForm,
  viewPersonalMode,
  handlePersonalEdit,
  handlePersonalDiscard,
  handleRadioChange,
  editPersonalMode,
  radio,
  selectedGender,
  handleGenderChange,
}) => {
  
  return (
    <>
      {viewPersonalMode ? (
        <div id="personal-info" class="info-section">
          <div className="row mt-4">
            <div className="col-6">
              <h5 className="f-w-600">{hrEnums.PERSONAL_INFO}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <BaseButton
                onClick={handlePersonalEdit}
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
                <span class="text-secondary">{Email}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.email}</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.GENDER}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.gender}</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.DOB}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.dob}</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.MARITAL_STATUS}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.marital_status}</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.BLOOD_GRP}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.blood_group}</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.EMERGENCY_CONTACT}</span>
                <br />
                <span class="f-w-600">
                  {hrEnums.staffData.emergency_contact}
                </span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.FATHER_NAME}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.father_name}</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.MOTHER_NAME}</span>
                <br />
                <span class="f-w-600">{hrEnums.staffData.mother_name}</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">{hrEnums.SPOUSE_NAME}</span>
                <br />
                <span class="f-w-600">-</span>
              </div>
            </div>
            <div class="col-6 col-md-3 mb-3">
              <div>
                <span class="text-secondary">
                  {hrEnums.PHYSICALLY_CHALLENGED}
                </span>
                <br />
                <span class="f-w-600">
                  {hrEnums.staffData.physically_challenged}
                </span>
              </div>
            </div>
            <div class="border-bottom mb-4 mr-4"></div>
            <div class="row custom-section">
              <div class="col-sm-3 mb-3">
                <div>
                  <span class="text-secondary">{hrEnums.CURRENT_ADDRESS}</span>
                  <br />
                </div>
              </div>
              <div class="col-sm-9 mb-3">
                <div class="row">
                  <div class="col-6 col-md-3 mb-3">
                    <div>
                      <span class="text-secondary">
                        {hrEnums.ADDRESS_LINE1}
                      </span>
                      <br />
                      <span class="f-w-600">
                        {hrEnums.staffData.address_line1}
                      </span>
                    </div>
                  </div>
                  <div class="col-6 col-md-3 mb-3">
                    <div>
                      <span class="text-secondary">
                        {hrEnums.ADDRESS_LINE2}
                      </span>
                      <br />
                      <span class="f-w-600">
                        {hrEnums.staffData.address_line2}
                      </span>
                    </div>
                  </div>
                  <div class="col-6 col-md-3 mb-3">
                    <div>
                      <span class="text-secondary">{hrEnums.CITY}</span>
                      <br />
                      <span class="f-w-600">{hrEnums.staffData.city}</span>
                    </div>
                  </div>
                  <div class="col-6 col-md-3 mb-3">
                    <div>
                      <span class="text-secondary">{hrEnums.STATE}</span>
                      <br />
                      <span class="f-w-600">{hrEnums.staffData.state}</span>
                    </div>
                  </div>
                  <div class="col-6 col-md-3 mb-3">
                    <div>
                      <span class="text-secondary">{hrEnums.POSTAL_CODE}</span>
                      <br />
                      <span class="f-w-600">
                        {hrEnums.staffData.postal_code}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="border-bottom mb-4  mr-4"></div>
            <div class="row custom-section">
              <div class="col-sm-3 mb-3">
                <div>
                  <span class="text-secondary">
                    {hrEnums.PERMANENT_ADDRESS}
                  </span>
                  <br />
                </div>
              </div>
              <div class="col-sm-9 mb-3">
                <div class="row">
                  <div class="col-6 col-md-3 mb-3">
                    <div>
                      <span class="text-secondary">
                        {hrEnums.ADDRESS_LINE1}
                      </span>
                      <br />
                      <span class="f-w-600">
                        {hrEnums.staffData.address_line1}
                      </span>
                    </div>
                  </div>
                  <div class="col-6 col-md-3 mb-3">
                    <div>
                      <span class="text-secondary">
                        {hrEnums.ADDRESS_LINE2}
                      </span>
                      <br />
                      <span class="f-w-600">
                        {hrEnums.staffData.address_line2}
                      </span>
                    </div>
                  </div>
                  <div class="col-6 col-md-3 mb-3">
                    <div>
                      <span class="text-secondary">{hrEnums.CITY}</span>
                      <br />
                      <span class="f-w-600">{hrEnums.staffData.city}</span>
                    </div>
                  </div>
                  <div class="col-6 col-md-3 mb-3">
                    <div>
                      <span class="text-secondary">{hrEnums.STATE}</span>
                      <br />
                      <span class="f-w-600">{hrEnums.staffData.state}</span>
                    </div>
                  </div>
                  <div class="col-6 col-md-3 mb-3">
                    <div>
                      <span class="text-secondary">{hrEnums.POSTAL_CODE}</span>
                      <br />
                      <span class="f-w-600">
                        {hrEnums.staffData.postal_code}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div id="personal-info" class="info-section">
          <div className="row mt-4">
            <div className="col-6">
              <h5 className="f-w-600">{hrEnums.PERSONAL_INFO}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <BaseButton
                onClick={handlePersonalDiscard}
                className="btn btn-pill btn-primary mx-2"
              >
                {hrEnums.DISCARD}
              </BaseButton>
              <BaseButton
                className="mx-2"
                color="primary"
                children={editPersonalMode ? Update : Submit}
              ></BaseButton>
            </div>
          </div>
          <div class="border-bottom mb-4 mt-2 mr-4"></div>
          <div class="row custom-section">
            <div className="col-lg-3">
              <BaseInput
                label={<>{Email}<span className="text-danger">*</span></>}
                name="email"
                type="text"
                placeholder={PlaceHolderFormat(Email)}
                value={staffForm.values.email}
                touched={staffForm.touched.email}
                error={staffForm.errors.email}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
            <label htmlFor="">{<>{hrEnums.GENDER}<span className="text-danger">*</span></>}</label>
                  <BaseRadioGroup
                    name="gender"
                    options={radioOptions}
                    selectedValue={selectedGender}
                    onChange={handleRadioChange}
                    value={staffForm.values.gender}
                    touched={staffForm.touched.gender}
                    error={staffForm.errors.gender}
                    handleBlur={staffForm.handleBlur}
                  />
                  
            </div>
            <div className="col-lg-3">
              <BaseInput
                name="dob"
                type="text"
                label={<>{hrEnums.DOB}<span className="text-danger">*</span></>}
                placeholder={PlaceHolderFormat(hrEnums.DOB)}
                value={staffForm.values.dob}
                touched={staffForm.touched.dob}
                error={staffForm.errors.dob}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseSelect
                name="marital_status"
                label={hrEnums.MARITAL_STATUS}
                className="select-border"
                options={hrEnums.option}
                placeholder={SelectPlaceHolder(hrEnums.MARITAL_STATUS)}
                handleChange={(field, value) => {
                  staffForm.setFieldValue(field, value);
                }}
                handleBlur={() =>
                  staffForm.setFieldTouched(hrEnums.MARITAL_STATUS, true)
                }
                value={staffForm.values.marital_status}
                touched={staffForm.touched.marital_status}
                error={staffForm.errors.marital_status}
              />
            </div>
            <div className="col-lg-3">
              <BaseSelect
                name="blood_group"
                label={hrEnums.BLOOD_GRP}
                className="select-border"
                options={hrEnums.option}
                placeholder={SelectPlaceHolder(hrEnums.BLOOD_GRP)}
                handleChange={(field, value) => {
                  staffForm.setFieldValue(field, value);
                }}
                handleBlur={() =>
                  staffForm.setFieldTouched(hrEnums.BLOOD_GRP, true)
                }
                value={staffForm.values.blood_group}
                touched={staffForm.touched.blood_group}
                error={staffForm.errors.blood_group}
              />
            </div>
            <div className="col-lg-3">
              <BaseInput
                name="emergency_contact"
                type="text"
                label={hrEnums.EMERGENCY_CONTACT}
                placeholder={PlaceHolderFormat(hrEnums.EMERGENCY_CONTACT)}
                value={staffForm.values.emergency_contact}
                touched={staffForm.touched.emergency_contact}
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
              <label htmlFor="">{hrEnums.PHYSICALLY_CHALLENGED}</label>
                  <BaseRadioGroup
                    name="physically_challenged"
                    options={hrEnums.radio_option}
                    selectedValue={radio}
                    onChange={handleRadioChange}
                    value={staffForm.values.physically_challenged}
                    touched={staffForm.touched.physically_challenged}
                    error={staffForm.errors.physically_challenged}
                    handleBlur={staffForm.handleBlur}
                  />
            </div>
            <div className="col-lg-3">
              <BaseInput
                name="father_name"
                type="text"
                label={hrEnums.FATHER_NAME}
                placeholder={PlaceHolderFormat(hrEnums.FATHER_NAME)}
                value={staffForm.values.father_name}
                touched={staffForm.touched.father_name}
                error={staffForm.errors.father_name}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseInput
                name="mother_name"
                type="text"
                label={hrEnums.MOTHER_NAME}
                placeholder={PlaceHolderFormat(hrEnums.MOTHER_NAME)}
                value={staffForm.values.mother_name}
                touched={staffForm.touched.mother_name}
                error={staffForm.errors.mother_name}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseInput
                name="spouse_name"
                type="text"
                label={hrEnums.SPOUSE_NAME}
                placeholder={PlaceHolderFormat(hrEnums.SPOUSE_NAME)}
                value={staffForm.values.spouse_name}
                touched={staffForm.touched.spouse_name}
                error={staffForm.errors.spouse_name}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div class="border-bottom mb-4 mt-3 mr-4"></div>
            <div class="row mb-2">
              <p>Current Address:</p>
            </div>
            <div className="col-lg-3">
              <BaseInput
                label={hrEnums.ADDRESS_LINE1}
                name="address_line1"
                type="text"
                placeholder={PlaceHolderFormat(hrEnums.ADDRESS_LINE1)}
                value={staffForm.values.address_line1}
                touched={staffForm.touched.address_line1}
                error={staffForm.errors.address_line1}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseInput
                label={hrEnums.ADDRESS_LINE2}
                name="address_line2"
                type="text"
                placeholder={PlaceHolderFormat(hrEnums.ADDRESS_LINE2)}
                value={staffForm.values.address_line2}
                touched={staffForm.touched.address_line2}
                error={staffForm.errors.address_line2}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseSelect
                name="state"
                label={hrEnums.STATE}
                className="select-border"
                options={hrEnums.option}
                placeholder={SelectPlaceHolder(hrEnums.STATE)}
                handleChange={(field, value) => {
                  staffForm.setFieldValue(field, value);
                }}
                handleBlur={() =>
                  staffForm.setFieldTouched(hrEnums.STATE, true)
                }
                value={staffForm.values.state}
                touched={staffForm.touched.state}
                error={staffForm.errors.state}
              />
            </div>
            <div className="col-lg-3">
              <BaseSelect
                name="city"
                label={hrEnums.CITY}
                className="select-border"
                options={hrEnums.option}
                placeholder={SelectPlaceHolder(hrEnums.CITY)}
                handleChange={(field, value) => {
                  staffForm.setFieldValue(field, value);
                }}
                handleBlur={() => staffForm.setFieldTouched(hrEnums.CITY, true)}
                value={staffForm.values.city}
                touched={staffForm.touched.city}
                error={staffForm.errors.city}
              />
            </div>
            <div class="border-bottom mb-4 mt-3 mr-4"></div>
            <div class="row mb-2">
              <p>Permanent Address:</p>
            </div>
            <div className="col-lg-3">
              <BaseInput
                label={hrEnums.ADDRESS_LINE1}
                name="address_line1"
                type="text"
                placeholder={PlaceHolderFormat(hrEnums.ADDRESS_LINE1)}
                value={staffForm.values.address_line1}
                touched={staffForm.touched.address_line1}
                error={staffForm.errors.address_line1}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseInput
                label={hrEnums.ADDRESS_LINE2}
                name="address_line2"
                type="text"
                placeholder={PlaceHolderFormat(hrEnums.ADDRESS_LINE2)}
                value={staffForm.values.address_line2}
                touched={staffForm.touched.address_line2}
                error={staffForm.errors.address_line2}
                handleBlur={staffForm.handleBlur}
                handleChange={staffForm.handleChange}
              />
            </div>
            <div className="col-lg-3">
              <BaseSelect
                name="state"
                label={hrEnums.STATE}
                className="select-border"
                options={hrEnums.option}
                placeholder={SelectPlaceHolder(hrEnums.STATE)}
                handleChange={(field, value) => {
                  staffForm.setFieldValue(field, value);
                }}
                handleBlur={() =>
                  staffForm.setFieldTouched(hrEnums.STATE, true)
                }
                value={staffForm.values.state}
                touched={staffForm.touched.state}
                error={staffForm.errors.state}
              />
            </div>
            <div className="col-lg-3">
              <BaseSelect
                name="city"
                label={hrEnums.CITY}
                className="select-border"
                options={hrEnums.option}
                placeholder={SelectPlaceHolder(hrEnums.CITY)}
                handleChange={(field, value) => {
                  staffForm.setFieldValue(field, value);
                }}
                handleBlur={() => staffForm.setFieldTouched(hrEnums.CITY, true)}
                value={staffForm.values.city}
                touched={staffForm.touched.city}
                error={staffForm.errors.city}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalDetails;
