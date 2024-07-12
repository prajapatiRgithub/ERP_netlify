import React, { useEffect, useState } from "react";
import { Back } from "../../Constant";
import { hrEnums } from "../../Constant/HR_Staff/hrEnums";
import { Link, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import BankDetails from "./bankDetails";
import EmploymentDetails from "./employmentDetails";
import ProfileDetails from "./profileDetails";
import PersonalDetails from "./personalDetails";
import GeneralDetails from "./generalDetails";

const StaffProfile = () => {
  const location = useLocation();
  const [viewProfileMode, setViewProfileMode] = useState(true);
  const [viewGeneralMode, setViewGeneralMode] = useState(true);
  const [viewPersonalMode, setViewPersonalMode] = useState(true);
  const [viewEmploymentMode, setViewEmploymentMode] = useState(true);
  const [viewBankMode, setViewBankMode] = useState(true);
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [editPersonalMode, setEditPersonalMode] = useState(false);
  const [editGeneralMode, setEditGeneralMode] = useState(false);
  const [editEmploymentMode, setEditEmploymentMode] = useState(false);
  const [editBankMode, setEditBankMode] = useState(false);
  const [radio, setRadio] = useState("No");
  const [selectedGender, setSelectedGender ]= useState("Male");

  const handleProfileEdit = () => {
    setEditProfileMode(true);
    setViewProfileMode(false);
  };
  const handleGeneralEdit = () => {
    setEditGeneralMode(true);
    setViewGeneralMode(false);
  };
  const handlePersonalEdit = () => {
    setEditPersonalMode(true);
    setViewPersonalMode(false);
  };
  const handleEmploymentEdit = () => {
    setEditEmploymentMode(true);
    setViewEmploymentMode(false);
  };
  const handleBankEdit = () => {
    setEditBankMode(true);
    setViewBankMode(false);
  };

  const handleProfileDiscard = () => {
    setEditProfileMode(false);
    setViewProfileMode(true);
  };
  const handleGeneralDiscard = () => {
    setEditGeneralMode(false);
    setViewGeneralMode(true);
  };
  const handlePersonalDiscard = () => {
    setEditPersonalMode(false);
    setViewPersonalMode(true);
  };
  const handleEmploymentDiscard = () => {
    setEditEmploymentMode(false);
    setViewEmploymentMode(true);
  };
  const handleBankDiscard = () => {
    setEditBankMode(false);
    setViewBankMode(true);
  };

  useEffect(() => {
    if (location.state && location.state.viewProfileMode !== undefined) {
      setViewProfileMode(location.state.viewProfileMode);
    }
    if (location.state && location.state.viewGeneralMode !== undefined) {
      setViewGeneralMode(location.state.viewGeneralMode);
    }
    if (location.state && location.state.viewPersonalMode !== undefined) {
      setViewPersonalMode(location.state.viewPersonalMode);
    }
    if (location.state && location.state.viewEmploymentMode !== undefined) {
      setViewEmploymentMode(location.state.viewEmploymentMode);
    }
    if (location.state && location.state.viewBankMode !== undefined) {
      setViewBankMode(location.state.viewBankMode);
    }
  }, [location.state]);

  const handleRadioChange = (event) => {
    setRadio(event?.target?.value);
    staffForm.setFieldValue("physically_challenged", event?.target?.value);
  };

  const handleGenderChange = (event) => {
    setSelectedGender(event?.target?.value);
    staffForm.setFieldValue("gender", event?.target?.value);
  };
  const staffForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      //profile section
      first_name: editProfileMode ? hrEnums.staffData?.first_name || "" : "",
      middle_name: editProfileMode ? hrEnums.staffData?.middle_name || "" : "",
      last_name: editProfileMode ? hrEnums.staffData?.last_name || "" : "",
      contact_no: editProfileMode ? hrEnums.staffData?.contact_no || "" : "",
      designation: editProfileMode ? hrEnums.staffData?.designation || "" : "",
      staff_type: editProfileMode ? hrEnums.staffData?.staff_type || "" : "",
      reporting_manager: editProfileMode
        ? hrEnums.staffData?.reporting_manager || ""
        : "",
      // general section
      salary_cycle: editGeneralMode
        ? hrEnums.staffData?.salary_cycle || ""
        : "",
      week_off: editGeneralMode ? hrEnums.staffData?.week_off || "" : "",
      holiday_template: editGeneralMode
        ? hrEnums.staffData?.holiday_template || ""
        : "",
      leave_template: editGeneralMode
        ? hrEnums.staffData?.leave_template || ""
        : "",
      shift: editGeneralMode ? hrEnums.staffData?.shift || "" : "",
      salary_access: editGeneralMode
        ? hrEnums.staffData?.salary_access || ""
        : "",
      attendance_mode: editGeneralMode
        ? hrEnums.staffData?.attendance_mode || ""
        : "",
      //personal section
      email: editPersonalMode ? hrEnums.staffData?.email || "" : "",
      gender: editPersonalMode ? hrEnums.staffData?.gender || "" : "",
      dob: editPersonalMode ? hrEnums.staffData?.dob || "" : "",
      marital_status: editPersonalMode
        ? hrEnums.staffData?.marital_status || ""
        : "",
      blood_group: editPersonalMode ? hrEnums.staffData?.blood_group || "" : "",
      emergency_contact: editPersonalMode
        ? hrEnums.staffData?.emergency_contact || ""
        : "",
      father_name: editPersonalMode ? hrEnums.staffData?.father_name || "" : "",
      mother_name: editPersonalMode ? hrEnums.staffData?.mother_name || "" : "",
      spouse_name: editPersonalMode ? hrEnums.staffData?.spouse_name || "" : "",
      physically_challenged: editPersonalMode
        ? hrEnums.staffData?.physically_challenged || ""
        : "",
      address_line1: editPersonalMode
        ? hrEnums.staffData?.address_line1 || ""
        : "",
      address_line2: editPersonalMode
        ? hrEnums.staffData?.address_line2 || ""
        : "",
      city: editPersonalMode ? hrEnums.staffData?.city || "" : "",
      state: editPersonalMode ? hrEnums.staffData?.state || "" : "",
      postal_code: editPersonalMode ? hrEnums.staffData?.postal_code || "" : "",
      //employment section
      joining_date: editEmploymentMode
        ? hrEnums.staffData?.joining_date || ""
        : "",
      uan: editEmploymentMode ? hrEnums.staffData?.uan || "" : "",
      pan: editEmploymentMode ? hrEnums.staffData?.pan || "" : "",
      aadhar: editEmploymentMode ? hrEnums.staffData?.aadhar || "" : "",
      //bank section
      bank_name: editBankMode ? hrEnums.staffData?.bank_name || "" : "",
      ifsc: editBankMode ? hrEnums.staffData?.ifsc_code || "" : "",
      account_number: editBankMode
        ? hrEnums.staffData?.account_number || ""
        : "",
      account_holder_name: editBankMode
        ? hrEnums.staffData?.account_holder_name || ""
        : "",
    },
    validationSchema: yup.object({
      //validation schema
    }),
    onSubmit: (values, { resetForm }) => {
      //api calling part
    },
  });

  return (
    <>
      <div className="container-fluid">
        <div className="page-header dash-breadcrumb py-3">
          <div className="row">
            <div className="col-6">
              <h5 className="f-w-600">{hrEnums.STAFF}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <Link to="/staffhr" className="btn btn-pill btn-primary mx-2">
                {Back}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="card section mb-3 p-4">
          <div className="row justify-content-center">
            <form onSubmit={staffForm.handleSubmit}>
              <div>
                <ProfileDetails
                  staffForm={staffForm}
                  viewProfileMode={viewProfileMode}
                  handleProfileEdit={handleProfileEdit}
                  handleProfileDiscard={handleProfileDiscard}
                  editProfileMode={editProfileMode}
                />
                <GeneralDetails
                  staffForm={staffForm}
                  viewGeneralMode={viewGeneralMode}
                  handleGeneralEdit={handleGeneralEdit}
                  handleGeneralDiscard={handleGeneralDiscard}
                  editGeneralMode={editGeneralMode}
                />
                <PersonalDetails
                  staffForm={staffForm}
                  viewPersonalMode={viewPersonalMode}
                  handlePersonalEdit={handlePersonalEdit}
                  handlePersonalDiscard={handlePersonalDiscard}
                  editPersonalMode={editPersonalMode}
                  handleRadioChange={handleRadioChange}
                  handleGenderChange={handleGenderChange}
                  selectedGender={selectedGender}
                  radio={radio}
                />
                <BankDetails
                  staffForm={staffForm}
                  viewBankMode={viewBankMode}
                  handleBankEdit={handleBankEdit}
                  handleBankDiscard={handleBankDiscard}
                  editBankMode={editBankMode}
                />
                <EmploymentDetails
                  staffForm={staffForm}
                  viewEmploymentMode={viewEmploymentMode}
                  handleEmploymentEdit={handleEmploymentEdit}
                  handleEmploymentDiscard={handleEmploymentDiscard}
                  editEmploymentMode={editEmploymentMode}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffProfile;
