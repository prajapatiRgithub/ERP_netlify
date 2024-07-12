import React, { useEffect, useState } from "react";
import {
  Aadhar,
  AadharBack,
  AadharFront,
  BankPassbook,
  Endorse,
  FatherName,
  MotherName,
  Qualification,
  QualificationCertificate,
  candidateName,
  center,
  course,
  editInquiry,
  passport,
  reference,
  sector,
  CategoryOptions,
  radioOptions,
  fileSizeMessage,
  hostelMessage,
  viewFile,
  PendingLabel,
  errorMessageEndorse,
  editInquiryErrorForFile,
  editInquiryErrorForFileSize,
  allowedFileTypes,
  courseLabel,
} from "../../Constant/Inquiry/Inquiry";
import {
  Address,
  Back,
  Cancel,
  CandidateName,
  Category,
  ContactNumber,
  Document,
  Email,
  EmailAddress,
  Gender,
  Loading,
  OtherDetails,
  Password,
  PersonalDetails,
  Submit,
} from "../../Constant";
import BaseButton from "../../BaseComponents/BaseButton";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import {
  SelectPlaceHolder,
  aadharRegex,
  digitRegex,
  emailRegex,
  numberRegex,
  validationMessages,
} from "../../Constant/validation";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseSelect from "../../BaseComponents/BaseSelect";
import { StatusCodes } from "http-status-codes";
import {
  centerApi,
  centerWiseCourse,
  fileUploadApi,
  qualificationApi,
} from "../../Api/common";
import BaseRadioGroup from "../../BaseComponents/BaseRadio";
import {
  editInquiryApi,
  endorseApi,
  viewCnadidateData,
} from "../../Api/Inquiry";
import { toast } from "react-toastify";
import Spinner from "../../BaseComponents/BaseLoader";
import { radioOptions1 } from "../../Constant/Hostel/hostel";
import { BaseImageURL } from "../../Api/Service";
import BaseModal from "../../BaseComponents/BaseModal";
import { editInquiryTitle } from "../../Constant/title";

const defaultValidationSchema = yup.object({
  candidate_name: yup
    .string()
    .required(validationMessages.required(CandidateName)),
  contact_no: yup
    .string()
    .required(validationMessages.required(ContactNumber))
    .matches(numberRegex, validationMessages.contactLength(ContactNumber, 10)),
  address: yup.string().required(validationMessages.required(Address)),
  center: yup.string().required(validationMessages.required(center)),
  course: yup.string().required(validationMessages.required(course)),
  address: yup.string().required(validationMessages.required(Address)),
  center: yup.string().required(validationMessages.required(center)),
  course: yup.string().required(validationMessages.required(course)),
  aadhar: yup
    .string()
    .notRequired()
    .matches(aadharRegex, validationMessages.contactLength(Aadhar, 12)),
  email: yup
    .string()
    .notRequired()
    .matches(emailRegex, validationMessages.format(Email)),
});

let endorseBtn = false;
const EditInquiry = () => {
  document.title = editInquiryTitle;
  document.title = editInquiryTitle;
  const { id } = useParams();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [btnELoader, setBtnELoader] = useState(false);
  const [viewInquiryData, setViewInquiryData] = useState();
  const [qualificationData, setQualificationData] = useState();
  const [centerData, setCenterData] = useState();
  const [courseData, setCourseData] = useState();
  const [error, setError] = useState([]);
  const [errorModal, setErrorModal] = useState(false);
  let fileName;
  let file;
  const [selectedRadio, setSelectedRadio] = useState("Male");
  const [radio, setRadio] = useState("No");
  const fetchData = async () => {
    setLoader(true);
    const payload = {
      condition: {
        id: id,
      },
    };
    let data;

    centerApi()
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setCenterData(
            data?.map((item) => ({
              value: item?.id,
              label: item?.center_name,
              id: item?.id,
            }))
          );
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        return err;
      });

    qualificationApi()
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setQualificationData(
            data?.map((item) => ({
              value: item?.id,
              label: item?.name,
              id: item?.id,
            }))
          );
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        return err;
      });

    viewCnadidateData(id, payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setViewInquiryData(resp?.data);
          setRadio(resp?.data?.is_hostel);
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        return err;
      })
      .finally(() => {
        setLoader(false);
      });

    qualificationApi()
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setQualificationData(
            data?.map((item) => ({
              value: item?.id,
              label: item?.name,
              id: item?.id,
            }))
          );
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        return err;
      });
  };

  const endorse = async () => {
    setBtnELoader(true);
    await endorseApi(id)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          toast.success(resp?.message);
          navigate("/dashboard");
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
        setError(err?.response?.data?.message);
        setErrorModal(true);
      })
      .finally(() => {
        setBtnELoader(false);
      });
  };

  const inquiryForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      candidate_name: viewInquiryData ? viewInquiryData?.candidate_name : "",
      contact_no: viewInquiryData ? viewInquiryData?.contact_no : "",
      address: viewInquiryData ? viewInquiryData?.address : "",
      center: viewInquiryData ? viewInquiryData?.center_id : "",
      course: viewInquiryData ? viewInquiryData?.course_id : "",
      reference: viewInquiryData ? viewInquiryData?.reference : "",
      gender: viewInquiryData ? viewInquiryData?.inquiryDetail?.gender : "Male",
      aadhar: viewInquiryData ? viewInquiryData?.inquiryDetail?.aadhar_no : "",
      is_hostel: viewInquiryData ? viewInquiryData?.is_hostel : "No",
      password: "",
      email: viewInquiryData ? viewInquiryData?.email : "",
      qualification: viewInquiryData
        ? viewInquiryData?.inquiryDetail?.qualification_id
        : null,
      category: viewInquiryData
        ? viewInquiryData?.inquiryDetail?.caste_category
        : "",
      sector: viewInquiryData ? viewInquiryData?.inquiryDetail?.sector : "",
      father_name: viewInquiryData
        ? viewInquiryData?.inquiryDetail?.father_name
        : "",
      mother_name: viewInquiryData
        ? viewInquiryData?.inquiryDetail?.mother_name
        : "",
      passport: viewInquiryData
        ? viewInquiryData?.inquiryDocument?.passport_photo
        : "",
      aadharFront: viewInquiryData
        ? viewInquiryData?.inquiryDocument?.aadharCard_front
        : "",
      aadharBack: viewInquiryData
        ? viewInquiryData?.inquiryDocument?.aadharCard_back
        : "",
      qualificationCerti: viewInquiryData
        ? viewInquiryData?.inquiryDocument?.qualification_certificate
        : "",
      bankPassbook: viewInquiryData
        ? viewInquiryData?.inquiryDocument?.bank_passbook
        : "",
    },
    validationSchema: defaultValidationSchema,
    onSubmit: (values) => {
      endorseBtn === true ? setBtnELoader(true) : setBtnLoader(true);
      const payload = {
        inquiry: {
          center_id: values.center,
          course_id: values.course,
          candidate_name: values.candidate_name,
          address: values.address,
          contact_no: values.contact_no,
          email: values.email,
          password: values.password,
          reference: values.reference,
          is_hostel: values.is_hostel,
        },
        inquiryDetails: {
          aadhar_no: values.aadhar,
          gender: values.gender,
          father_name: values.father_name,
          mother_name: values.mother_name,
          caste_category: values.category,
          qualification_id: values.qualification,
          sector: values.sector,
          batch_time: values.batch_time,
        },
        inquiryDocument: {
          passport_photo: values.passport,
          aadharCard_front: values.aadharFront,
          aadharCard_back: values.aadharBack,
          bank_passbook: values.bankPassbook,
          qualification_certificate: values.qualificationCerti,
        },
      };
      editInquiryApi(id, payload)
        .then((resp) => {
          if (
            resp?.statusCode === StatusCodes.ACCEPTED ||
            resp?.statusCode === StatusCodes.OK ||
            resp?.statusCode === StatusCodes.CREATED
          ) {
            toast.success(resp?.message);
            navigate("/dashboard");
          } else {
            toast.error(resp?.message);
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || err?.message);
        })
        .finally(() => {
          endorseBtn ? setBtnELoader(false) : setBtnLoader(false);
        });
    },
  });

  const fetchCourse = () => {
    setLoader(true);
    const payload = {
      condition: {
        id: parseInt(inquiryForm.values.center),
      },
    };
    centerWiseCourse(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          const data = resp?.data;
          const courses = data?.flatMap((center) =>
            center?.centerCourse?.map((item) => ({
              value: item.course.id,
              label: item.course.course_name,
              id: item.course.id,
            }))
          );
          setCourseData(courses);
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        return err;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleFileChange = (e, name) => {
    fileName = name;
    file = e?.target?.files[0];
    if (file) {
      if (!allowedFileTypes.includes(file.type)) {
        toast.error(editInquiryErrorForFile);
        return;
      } else {
        if (file.size > 1024 * 1024) {
          toast.error(editInquiryErrorForFileSize);
          return;
        } else {
          fileUploads();
        }
      }
    }
  };

  const fileUploads = () => {
    setLoader(true);
    const formData = new FormData();
    formData.append("files", file);
    fileUploadApi(formData)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          inquiryForm.setFieldValue(fileName, resp?.data[0]);
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
    inquiryForm.setFieldValue("gender", event.target.value);
  };
  const handleChange = (event) => {
    setRadio(event.target.value);
    inquiryForm.setFieldValue("is_hostel", event.target.value);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchCourse();
  }, [inquiryForm.values.center]);

  return (
    <>
      <div className="px-3 d-flex justify-content-between mb-1">
        {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
        <h5 className="f-w-600">{editInquiry}</h5>
        <button
          className="btn btn-pill btn-primary"
          onClick={() => navigate("/")}
        >
          <Link to="/" className="text-white">
            {Back}
          </Link>
        </button>
      </div>
      <div className="card">
        <div className="card-body">
          <form onSubmit={inquiryForm.handleSubmit}>
            <h5 className="my-4 sub-title">{PersonalDetails}</h5>
            <div className="row">
              <div className="col-lg-12 row">
                <div className="col-lg-3">
                  <BaseInput
                    label={candidateName}
                    name="candidate_name"
                    type="text"
                    placeholder={PlaceHolderFormat(CandidateName)}
                    value={inquiryForm.values.candidate_name}
                    touched={inquiryForm.touched.candidate_name}
                    error={inquiryForm.errors.candidate_name}
                    handleBlur={inquiryForm.handleBlur}
                    handleChange={inquiryForm.handleChange}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    name="contact_no"
                    type="number"
                    label={ContactNumber}
                    placeholder={PlaceHolderFormat(ContactNumber)}
                    value={inquiryForm.values.contact_no}
                    touched={inquiryForm.touched.contact_no}
                    error={inquiryForm.errors.contact_no}
                    handleBlur={inquiryForm.handleBlur}
                    handleChange={(e) => {
                      if (
                        e?.target?.value?.length <= 10 &&
                        digitRegex.test(e.target.value)
                      ) {
                        inquiryForm.handleChange(e);
                      }
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    name="email"
                    type="text"
                    label={EmailAddress}
                    placeholder={PlaceHolderFormat(EmailAddress)}
                    value={inquiryForm.values.email}
                    touched={inquiryForm.touched.email}
                    error={inquiryForm.errors.email}
                    handleBlur={inquiryForm.handleBlur}
                    handleChange={inquiryForm.handleChange}
                  />
                </div>
                <div className="col-lg-3">
                  <label htmlFor="">{Gender}</label>
                  <BaseRadioGroup
                    name="gender"
                    options={radioOptions}
                    selectedValue={selectedRadio}
                    onChange={handleRadioChange}
                    value={inquiryForm.values.gender}
                    touched={inquiryForm.touched.gender}
                    error={inquiryForm.errors.gender}
                    handleBlur={inquiryForm.handleBlur}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-lg-12 row">
                <div className="col-lg-3">
                  <BaseInput
                    name="aadhar"
                    type="number"
                    label={Aadhar}
                    placeholder={PlaceHolderFormat(Aadhar)}
                    value={inquiryForm.values.aadhar}
                    touched={inquiryForm.touched.aadhar}
                    error={inquiryForm.errors.aadhar}
                    handleBlur={inquiryForm.handleBlur}
                    handleChange={inquiryForm.handleChange}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    name="password"
                    type="text"
                    label={Password}
                    placeholder={PlaceHolderFormat(Password)}
                    value={inquiryForm.values.password}
                    touched={inquiryForm.touched.password}
                    error={inquiryForm.errors.password}
                    handleBlur={inquiryForm.handleBlur}
                    handleChange={inquiryForm.handleChange}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseSelect
                    name="center"
                    label={center}
                    className="select-border"
                    options={centerData}
                    placeholder={SelectPlaceHolder(center)}
                    handleChange={(field, value) => {
                      inquiryForm.setFieldValue(field, value);
                      inquiryForm.setFieldValue(courseLabel, "");
                    }}
                    handleBlur={() => inquiryForm.setFieldTouched(center, true)}
                    value={inquiryForm.values.center}
                    touched={inquiryForm.touched.center}
                    error={inquiryForm.errors.center}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseSelect
                    name="course"
                    label={course}
                    className="select-border"
                    options={courseData}
                    placeholder={SelectPlaceHolder(course)}
                    handleChange={(field, value) => {
                      inquiryForm.setFieldValue(field, value);
                    }}
                    handleBlur={() => inquiryForm.setFieldTouched(course, true)}
                    value={inquiryForm.values.course}
                    touched={inquiryForm.touched.course}
                    error={inquiryForm.errors.course}
                  />
                </div>
              </div>
            </div>
            <h5 className="my-4 sub-title">{OtherDetails}</h5>
            <div className="row mt-2">
              <div className="col-lg-12 row">
                <div className="col-lg-3">
                  <BaseSelect
                    name="qualification"
                    label={Qualification}
                    className="select-border"
                    options={qualificationData}
                    placeholder={SelectPlaceHolder(Qualification)}
                    handleChange={(field, value) => {
                      inquiryForm.setFieldValue(field, value);
                    }}
                    handleBlur={() =>
                      inquiryForm.setFieldTouched(Qualification, true)
                    }
                    value={inquiryForm.values.qualification}
                    touched={inquiryForm.touched.qualification}
                    error={inquiryForm.errors.qualification}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseSelect
                    name="category"
                    label={Category}
                    className="select-border"
                    options={CategoryOptions}
                    placeholder={SelectPlaceHolder(Category)}
                    handleChange={(field, value) => {
                      inquiryForm.setFieldValue(field, value);
                    }}
                    handleBlur={() =>
                      inquiryForm.setFieldTouched(Category, true)
                    }
                    value={inquiryForm.values.category}
                    touched={inquiryForm.touched.category}
                    error={inquiryForm.errors.category}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    name="sector"
                    type="text"
                    label={sector}
                    placeholder={PlaceHolderFormat(sector)}
                    value={inquiryForm.values.sector}
                    touched={inquiryForm.touched.sector}
                    error={inquiryForm.errors.sector}
                    handleBlur={inquiryForm.handleBlur}
                    handleChange={inquiryForm.handleChange}
                  />
                </div>
                <div className="col-lg-3">
                  <label htmlFor="">{hostelMessage}</label>
                  <BaseRadioGroup
                    name="is_hostel"
                    options={radioOptions1}
                    selectedValue={radio}
                    onChange={handleChange}
                    value={inquiryForm.values.is_hostel}
                    touched={inquiryForm.touched.is_hostel}
                    error={inquiryForm.errors.is_hostel}
                    handleBlur={inquiryForm.handleBlur}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-lg-12 row">
                <div className="col-lg-3">
                  <BaseInput
                    name="father_name"
                    type="text"
                    label={FatherName}
                    placeholder={PlaceHolderFormat(FatherName)}
                    value={inquiryForm.values.father_name}
                    touched={inquiryForm.touched.father_name}
                    error={inquiryForm.errors.father_name}
                    handleBlur={inquiryForm.handleBlur}
                    handleChange={inquiryForm.handleChange}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    name="mother_name"
                    type="text"
                    label={MotherName}
                    placeholder={PlaceHolderFormat(MotherName)}
                    value={inquiryForm.values.mother_name}
                    touched={inquiryForm.touched.mother_name}
                    error={inquiryForm.errors.mother_name}
                    handleBlur={inquiryForm.handleBlur}
                    handleChange={inquiryForm.handleChange}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    name="reference"
                    type="text"
                    label={reference}
                    placeholder={PlaceHolderFormat(reference)}
                    value={inquiryForm.values.reference}
                    touched={inquiryForm.touched.reference}
                    error={inquiryForm.errors.reference}
                    handleBlur={inquiryForm.handleBlur}
                    handleChange={inquiryForm.handleChange}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    name="address"
                    type="textarea"
                    label={Address}
                    placeholder={PlaceHolderFormat(Address)}
                    value={inquiryForm.values.address}
                    touched={inquiryForm.touched.address}
                    error={inquiryForm.errors.address}
                    handleBlur={inquiryForm.handleBlur}
                    handleChange={inquiryForm.handleChange}
                  />
                </div>
              </div>
            </div>
            <h5 className="mt-4 sub-title">{Document}</h5>
            <span className="text-warning fw-normal mb-4">
              {fileSizeMessage}
            </span>
            <div className="row mt-2">
              <div className="col-lg-12 row">
                <div className="col-lg-3">
                  <BaseInput
                    name="passport"
                    type="file"
                    accept=".jpg,.jpeg,.png,.doc,.docx,.pdf"
                    label={passport}
                    handleChange={(e) => handleFileChange(e, e.target.name)}
                    touched={inquiryForm.touched.passport}
                    error={inquiryForm.errors.passport}
                    handleBlur={inquiryForm.handleBlur}
                  />
                  {inquiryForm.values.passport?.length > 0 && (
                    <span className="fw-normal">
                      <Link
                        target="_blank"
                        className="text-dark"
                        to={`${BaseImageURL}${inquiryForm.values.passport}`}
                      >
                        {viewFile}
                      </Link>
                    </span>
                  )}
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    name="aadharFront"
                    type="file"
                    accept=".jpg,.jpeg,.png,.doc,.docx,.pdf"
                    label={AadharFront}
                    handleChange={(e) => handleFileChange(e, e.target.name)}
                    touched={inquiryForm.touched.aadharFront}
                    error={inquiryForm.errors.aadharFront}
                    handleBlur={inquiryForm.handleBlur}
                  />
                  {inquiryForm.values.aadharFront?.length > 0 && (
                    <span className="fw-normal">
                      <Link
                        target="_blank"
                        className="text-dark"
                        to={`${BaseImageURL}${inquiryForm.values.aadharFront}`}
                      >
                        {viewFile}
                      </Link>
                    </span>
                  )}
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    name="aadharBack"
                    type="file"
                    accept=".jpg,.jpeg,.png,.doc,.docx,.pdf"
                    label={AadharBack}
                    handleChange={(e) => handleFileChange(e, e.target.name)}
                    touched={inquiryForm.touched.aadharBack}
                    error={inquiryForm.errors.aadharBack}
                    handleBlur={inquiryForm.handleBlur}
                  />
                  {inquiryForm.values.aadharBack?.length > 0 && (
                    <span className="fw-normal">
                      <Link
                        target="_blank"
                        className="text-dark"
                        to={`${BaseImageURL}${inquiryForm.values.aadharBack}`}
                      >
                        {viewFile}
                      </Link>
                    </span>
                  )}
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    name="qualificationCerti"
                    type="file"
                    accept=".jpg,.jpeg,.png,.doc,.docx,.pdf"
                    label={QualificationCertificate}
                    handleChange={(e) => handleFileChange(e, e.target.name)}
                    touched={inquiryForm.touched.qualificationCerti}
                    error={inquiryForm.errors.qualificationCerti}
                    handleBlur={inquiryForm.handleBlur}
                  />
                  {inquiryForm.values.qualificationCerti?.length > 0 && (
                    <span className="fw-normal">
                      <Link
                        target="_blank"
                        className="text-dark"
                        to={`${BaseImageURL}${inquiryForm.values.qualificationCerti}`}
                      >
                        {viewFile}
                      </Link>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-lg-12 row">
                <div className="col-lg-3">
                  <BaseInput
                    name="bankPassbook"
                    type="file"
                    accept=".jpg,.jpeg,.png,.doc,.docx,.pdf"
                    label={BankPassbook}
                    handleChange={(e) => handleFileChange(e, e.target.name)}
                    touched={inquiryForm.touched.bankPassbook}
                    error={inquiryForm.errors.bankPassbook}
                    handleBlur={inquiryForm.handleBlur}
                  />
                  {inquiryForm.values.bankPassbook?.length > 0 && (
                    <span className="fw-normal">
                      <Link
                        target="_blank"
                        className="text-dark"
                        to={`${BaseImageURL}${inquiryForm.values.bankPassbook}`}
                      >
                        {viewFile}
                      </Link>
                    </span>
                  )}
                </div>
                <div className="col-lg-3"></div>
                <div className="col-lg-3"></div>
                <div className="col-lg-3"></div>
              </div>
            </div>
            <div className="card-footer d-flex justify-content-end">
              <BaseButton
                className="mx-2"
                color="danger"
                type="button"
                onClick={() => navigate("/dashboard")}
              >
                {Cancel}
              </BaseButton>
              <BaseButton
                className="mx-2"
                color="primary"
                type="submit"
                disabled={btnLoader}
                loader={btnLoader}
                children={btnLoader ? Loading : Submit}
              ></BaseButton>
              <BaseButton
                onClick={() => {
                  endorse();
                }}
                className="mx-2"
                color="success"
                type="button"
                loader={btnELoader}
                disabled={
                  viewInquiryData?.status === PendingLabel || btnELoader
                }
                children={Endorse}
              ></BaseButton>
            </div>
          </form>
        </div>
        <BaseModal
          isOpen={errorModal}
          toggler={() => setErrorModal(false)}
          title={errorMessageEndorse}
          submitText="Submit"
          hasSubmitButton={false}
          bodyClass="endorse-error-modal"
        >
          <ul className="list-group list-group-flush">
            {error?.map((errorMessage, index) => (
              <li key={index} className="list-group-item text-danger">
                {index + 1}. {errorMessage}
              </li>
            ))}
          </ul>
        </BaseModal>
      </div>
    </>
  );
};

export default EditInquiry;
