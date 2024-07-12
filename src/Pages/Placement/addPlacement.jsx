import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BaseSelect from "../../BaseComponents/BaseSelect";
import BaseInput from "../../BaseComponents/BaseInput";
import { useFormik } from "formik";
import * as yup from "yup";
import BaseButton from "../../BaseComponents/BaseButton";
import { fileUploadApi, listOfState } from "../../Api/common";
import { StatusCodes } from "http-status-codes";
import {
  addPlacement,
  addSalarySlip,
  editPlacement,
  editSalarySlip,
  listOfPlacement,
  listOfPlacementCandidate,
  viewPlacementCandidate,
} from "../../Api/placement";
import TableContainer from "../../BaseComponents/BaseTable";
import { SrNo } from "../../Constant/Center";
import { RiAddLine, RiEyeFill, RiEditFill, RiSearchLine } from "react-icons/ri";
import {
  Action,
  Back,
  Loading,
  notFound,
  Search,
  Submit,
  Update,
} from "../../Constant";
import { toast } from "react-toastify";
import Spinner from "../../BaseComponents/BaseLoader";
import { BaseImageURL } from "../../Api/Service";
import BaseModal from "../../BaseComponents/BaseModal";
import { handleEditClick, handleResponse } from "../../Constant/common";
import {
  EmploymentNatureOptions,
  Options,
  placementLable,
  placementViewLable,
} from "../../Constant/Placement/placement";
import {
  digitRegex,
  SelectPlaceHolder,
  validationMessages,
} from "../../Constant/validation";
import { PlaceHolderFormat } from "../../Constant/requireMessage";

const AddPlacement = () => {
  const { can_id } = useParams();
  const [states, setStates] = useState();
  const [placementCandidate, setPlacementCandidate] = useState(null);
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [customPage, setCustomPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [searchValue, setSearchValue] = useState("");
  const [candidateData, setCandidateData] = useState([]);
  const [employmentType, setEmploymentType] = useState();
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [slarySlipModal, setSlarySlipModal] = useState(false);
  const [slarySlip, setSlarySlip] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [placeId, setPlaceId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [currentSlipId, setCurrentSlipId] = useState(null);
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [candidateDetailsModal, setCandidateDetailsModal] = useState(false);

  const viewCandidateDetails = (id) => {
    setLoader(true);
    viewPlacementCandidate(id)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setCandidateDetails(resp?.data);
          setCandidateDetailsModal(!candidateDetailsModal);
        }
      })
      .catch((err) => {
        return err;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };
  let data;
  const validationSchema = yup.object().shape({
    candidateName: yup
      .string()
      .required(validationMessages.required(placementLable.candidateName)),
    employmentType: yup
      .string()
      .required(validationMessages.required(placementLable.employmentType)),
    ...(employmentType === placementLable.Business
      ? {
          businessName: yup
            .string()
            .required(validationMessages.required(placementLable.businessName)),
          businessDetails: yup
            .string()
            .required(
              validationMessages.required(placementLable.businessDetails)
            ),
        }
      : {
          companyName: yup
            .string()
            .required(validationMessages.required(placementLable.companyName)),
          appointmentLetter: yup
            .mixed()
            .required(
              validationMessages.required(placementLable.appointmentLetter)
            ),
          employmentNature: yup
            .string()
            .required(
              validationMessages.required(placementLable.employmentNature)
            ),
          jobLocation: yup
            .string()
            .required(validationMessages.required(placementLable.jobLocation)),
          salary: yup
            .number()
            .required(validationMessages.required(placementLable.salary))
            .positive(placementLable.salaryPositive),
          joiningDate: yup
            .date()
            .required(validationMessages.required(placementLable.joiningDate)),
          closingDate: yup.date().when("joiningDate", (joiningDate, schema) => {
            return schema.test({
              name: "closingDate",
              exclusive: false,
              message: placementLable.closingDateValidation,
              test: function (value) {
                if (!value || !joiningDate) return true;
                return new Date(value) > new Date(joiningDate);
              },
            });
          }),
        }),
  });

  const placementForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      candidateName: candidateData?.candidate_name || "",
      employmentType: editData ? editData?.employment_type : "",
      businessName: editData ? editData?.business_name : "",
      businessDetails: editData ? editData?.business_detail : "",
      companyName: editData ? editData?.company_name : "",
      appointmentLetter: editData ? editData?.appointment_letter : null,
      employmentNature: editData ? editData?.employment_nature : "",
      jobLocation: editData ? editData?.state_id : "",
      salary: editData ? editData?.salary : "",
      joiningDate: editData ? editData?.joining_date : "",
      closingDate: editData ? editData?.closing_date : "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setBtnLoader(true);
      const payload = {
        center_id: candidateData?.center?.id,
        course_id: candidateData?.course?.id,
        batch_id: parseInt(candidateData?.batchAssign?.batch?.id),
        candidate_id: candidateData?.id,
        employment_type: values.employmentType,
        business_name: values.businessName,
        business_detail: values.businessDetails,
        company_name: values.companyName,
        appointment_letter: values.appointmentLetter,
        employment_nature: values.employmentNature,
        state_id: values.jobLocation || null,
        salary: values.salary || null,
        joining_date: values.joiningDate,
        closing_date: values.closingDate,
      };
      if (editId !== null) {
        editPlacement(editId, payload)

          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
            toast.success(resp?.message);
            fetchPlacementData(null);
            }
            else{
              toast.error(resp?.message)
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
          })
          .finally(() => {
            setEditId(null);
            setEditData(null);
            setBtnLoader(false);
          });
      } else {
        addPlacement(payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ){
            toast.success(resp.message);
            fetchPlacementData(null);
            }else{
              toast.error(resp?.message)
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
          })
          .finally(() => {
            setBtnLoader(false);
            placementForm.resetForm();
          });
      }
    },
  });

  const handleEmploymentTypeChange = (field, value) => {
    placementForm.setFieldValue(field, value);
    setShowBusinessFields(value === placementLable.Business);
    setEmploymentType(value);
  };

  const [showBusinessFields, setShowBusinessFields] = useState(false);

  const editPlacementData = (id) => {
    setEditId(id);
    fetchPlacementData(id);
  };

  const fetchData = () => {
    setLoader(true);

    listOfState({})
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setStates(
            data?.map((item) => ({
              value: item?.id,
              label: item?.state_name,
              id: item?.id,
            }))
          );
        }
        else{
          toast.error(resp?.message)
        }
      })
      .catch((err) => {
        return err;
      });

    listOfPlacementCandidate({
      condition: {
        id: can_id,
      },
    })
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setCandidateData(resp?.data?.listOfCandidate?.[0]);
        }
        else{
          toast.error(resp?.message)
        }
      })
      .catch((err) => {
        return err;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const fetchPlacementData = (id) => {
    setLoader(true);
    const payload1 = {
      order: [columnName, sortOrder],
      condition: {
        id: id,
      },
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    const payload = {
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
      condition: {
        candidate_id: parseInt(can_id),
      },
    };
    listOfPlacement(id !== null ? payload1 : payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          {
            if (id !== null) {
              setEditData(resp?.data?.listOfPlacement?.[0]);
              handleEmploymentTypeChange(
                null,
                resp?.data?.listOfPlacement?.[0].employment_type
              );
            } else {
              setPlacementCandidate(resp?.data?.listOfPlacement);
              setTotalRecords(resp.data.totalRecordsCount);
              setTotalPages(resp?.data?.totalPages);
              setTotalNumberOfRows(resp?.data?.numberOfRows);
              setCurrentPage(resp?.data?.currentPage);
            }
          }
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
    fetchPlacementData(null);
  }, [columnName, sortOrder, currentPage, customPageSize]);

  const slarySlipAdd = (addSlip) => {
    setCandidateId(addSlip?.candidate_id);
    setPlaceId(addSlip?.id);
    setSlarySlip(addSlip);
    setSlarySlipModal(!slarySlipModal);
  };

  const columns = useMemo(
    () => [
      {
        header: SrNo,
        accessorKey: "serial_number",
        cell: (cell) => cell.row.index + 1,
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: placementLable.candidateName,
        accessorKey: placementLable.candidateKey,
        enableColumnFilter: false,
      },
      {
        header: placementLable.employmentType,
        accessorKey: placementLable.employmentTypeKey,
        enableColumnFilter: false,
      },
      {
        header: placementLable.companyName,
        accessorKey: placementLable.companyNameKey,
        enableColumnFilter: false,
      },
      {
        header: placementLable.appointmentLetter,
        accessorKey: placementLable.appointmentLetterKey,
        cell: (cell) => (
          <div className="d-flex justify-content-center">
            {cell.row.original.appointment_letter ? (
              <a
                href={`${BaseImageURL}${cell.row.original.appointment_letter}`}
                target="_blank"
                rel="noopener noreferrer"
                className={` text-success mx-2 ${
                  cell.row.original.employment_type === placementLable.Business
                    ? "disabled"
                    : ""
                }`}
              >
                {placementLable.viewLetter}
              </a>
            ) : (
              <span>{placementLable.noLetter}</span>
            )}
          </div>
        ),
        enableColumnFilter: false,
      },
      {
        header: placementLable.totalWorkingDays,
        accessorKey: placementLable.totalWorkingKey,
        enableColumnFilter: false,
      },
      {
        header: placementLable.businessName,
        accessorKey: placementLable.businessNameKey,
        enableColumnFilter: false,
      },
      {
        header: placementLable.businessDetails,
        accessorKey: placementLable.businessDetailsKey,
        enableColumnFilter: false,
      },
      {
        header: Action,
        accessorKey: "action",
        enableSorting: true,
        cell: (cell) => (
          <div className="d-flex justify-content-center icon">
            <span>
              <RiEditFill
                className="fs-5 text-primary mx-2"
                onClick={() => {
                  editPlacementData(cell?.row?.original?.id);
                  handleEditClick();
                }}
                title="Edit"
              />
            </span>
            <span>
              <RiAddLine
                className={`fs-5 text-primary mx-2 ${
                  cell?.row?.original?.employment_type ===
                  placementLable.Business
                    ? "disabled"
                    : ""
                }`}
                title={placementViewLable.addSlipTitle}
                onClick={() => {
                  if (
                    cell?.row?.original?.employment_type !==
                    placementLable.Business
                  ) {
                    // Handle action for Add Placement
                    slarySlipAdd(cell?.row?.original);
                  }
                }}
              />
            </span>
            <span>
              <RiEyeFill
                className={`fs-5 text-success mx-2 ${
                  cell?.row?.original?.employment_type ===
                  placementLable.Business
                    ? "disabled"
                    : ""
                }`}
                onClick={() => {
                  if (
                    cell?.row?.original?.employment_type !==
                    placementLable.Business
                  ) {
                    // Handle action for Add Placement
                    viewCandidateDetails(cell?.row?.original?.id);
                  }
                }}
                title="View"
              />
            </span>
          </div>
        ),
        enableColumnFilter: false,
      },
    ],
    []
  );
  const SalarySlipColumn = useMemo(
    () => [
      {
        header: placementLable.companyName,
        accessorKey: placementLable.companyNameKey,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: placementLable.totalWorkingDays,
        accessorKey: placementLable.workingDayKey,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: placementLable.month,
        accessorKey: placementLable.monthKey,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: placementLable.salarySlip,
        accessorKey: placementLable.salarySlipKey,
        enableColumnFilter: false,
        enableSorting: false,
        cell: (cell) => (
          <div className="d-flex justify-content-center">
            {cell.row.original.salary_slip ? (
              <a
                href={`${BaseImageURL}${cell.row.original.salary_slip}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-success mx-2 "
              >
                {placementLable.viewSlip}
              </a>
            ) : (
              <span>{placementLable.noSlip}</span>
            )}
          </div>
        ),
      },
      {
        header: Action,
        accessorKey: "action",
        enableSorting: true,
        cell: (cell) => (
          <div className="d-flex justify-content-center icon">
            <span>
              <RiEditFill
                className="fs-5 text-primary mx-2"
                onClick={() => {
                  handleEditSlip(cell?.row?.original);
                  handleEditClick();
                }}
                title="Edit"
              />
            </span>
          </div>
        ),
        enableColumnFilter: false,
      },
    ],
    []
  );

  const fileUploads = (fileName, file, formikInstance) => {
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
          formikInstance.setFieldValue(fileName, resp?.data[0]);
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

  const handleFileChange = (e) => {
    const file = e?.target?.files[0];
    const fileName = e?.target?.name;
    if (file && file?.size > 1024 * 1024) {
      toast.warning(placementLable.fileSizeValidation);
      return;
    }
    fileUploads(fileName, file, placementForm);
  };

  const handleSlarySlipChange = (e, name) => {
    const file = e?.target?.files[0];
    if (file && file?.size > 1024 * 1024) {
      toast.warning(placementLable.fileSizeValidation);
      return;
    }
    fileUploads(name, file, SlipFrom);
  };
  const SlipFrom = useFormik({
    enableReinitialize: true,
    initialValues: {
      companyName: slarySlip?.company_name || "",
      month: "",
      totalWorkingDays: "",
      salarySlip: null,
    },
    validationSchema: yup.object().shape({
      month: yup
        .string()
        .required(validationMessages.required(placementLable.month)),
      totalWorkingDays: yup
        .number()
        .min(0, placementLable.totalWorkingDaysValidation)
        .required(validationMessages.required(placementLable.totalWorkingDays)),
      salarySlip: yup
        .string()
        .required(validationMessages.required(placementLable.salarySlip)),
    }),
    onSubmit: (values) => {
      setBtnLoader(true);
      let payload = {
        company_name: values.companyName,
        month: values.month,
        working_days: values.totalWorkingDays,
        salary_slip: values.salarySlip,
      };

      if (!isEdit) {
        // This condition ensures that candidate_id and placement_details_id are included only during addition
        payload = {
          ...payload,
          candidate_id: candidateId,
          placement_details_id: placeId,
        };
      }

      if (isEdit) {
        editSalarySlip(currentSlipId, payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp?.message);
              fetchPlacementData(null);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
          })
          .finally(() => {
            setIsEdit(null);
            setCurrentSlipId(null);
            setSlarySlipModal(false);
            setCandidateDetailsModal(false);
            setBtnLoader(false);
          });
      } else {
        addSalarySlip(payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp?.message);
              fetchPlacementData(null);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
          })
          .finally(() => {
            setBtnLoader(false);
            setSlarySlipModal(false);
            SlipFrom.resetForm();
          });
      }
    },
  });

  const handleEditSlip = (slip) => {
    setIsEdit(true);
    setCurrentSlipId(slip.id);
    SlipFrom.setValues({
      companyName: slip?.company_name,
      month: slip?.month,
      totalWorkingDays: slip?.working_days,
      salarySlip: slip?.salary_slip,
    });
    setSlarySlipModal(true);
    setSlarySlipModal(!slarySlipModal);
  };
  return (
    <>
      <div className="container-fluid">
        <div className="page-header dash-breadcrumb py-3">
          <div className="row">
            <div className="col-6 py-2 px-3">
              <h5 className="f-w-600">{placementLable.addPlacement}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <button className="btn btn-pill btn-primary">
                <Link to="/placement" className="text-white">
                  {Back}
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
      {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
      <div className="container-fluid default-dash">
        <div className="card p-4 rounded mb-0">
          <form onSubmit={placementForm.handleSubmit}>
            <div className="row">
              <div className="col-lg-12 row">
                <div className="d-flex justify-content-end">
                  <span className="text-warning fw-normal">
                    {placementLable.fileAllowedAppointmentLetter}
                  </span>
                </div>

                <div className="col-lg-3">
                  <BaseSelect
                    label={placementLable.candidateName}
                    name="candidateName"
                    options={[
                      {
                        label: candidateData?.candidate_name,
                        value: candidateData?.candidate_name,
                      },
                    ]}
                    isDisabled={true}
                    handleChange={(field, value) => {
                      placementForm.setFieldValue(field, value);
                    }}
                    value={placementForm.values.candidateName}
                    touched={placementForm.touched.candidateName}
                    error={placementForm.errors.candidateName}
                    handleBlur={placementForm.handleBlur}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseSelect
                    label={placementLable.employmentType}
                    name="employmentType"
                    placeholder={SelectPlaceHolder(
                      placementLable.employmentType
                    )}
                    options={Options}
                    handleChange={(field, value) =>
                      handleEmploymentTypeChange(field, value)
                    }
                    value={placementForm.values.employmentType}
                    touched={placementForm.touched.employmentType}
                    error={placementForm.errors.employmentType}
                    handleBlur={placementForm.handleBlur}
                  />
                </div>
                {/* Conditional rendering based on employmentType */}
                {showBusinessFields && (
                  <>
                    <div className="col-lg-3">
                      <BaseInput
                        label={placementLable.businessName}
                        type="text"
                        name="businessName"
                        className="form-control"
                        placeholder={PlaceHolderFormat(
                          placementLable.businessName
                        )}
                        value={placementForm.values.businessName}
                        touched={placementForm.touched.businessName}
                        error={placementForm.errors.businessName}
                        handleBlur={placementForm.handleBlur}
                        handleChange={placementForm.handleChange}
                      />
                    </div>
                    <div className="col-lg-3">
                      <BaseInput
                        name="businessDetails"
                        label={placementLable.businessDetails}
                        type="text"
                        className="form-control"
                        placeholder={PlaceHolderFormat(
                          placementLable.businessDetails
                        )}
                        value={placementForm.values.businessDetails}
                        touched={placementForm.touched.businessDetails}
                        error={placementForm.errors.businessDetails}
                        handleBlur={placementForm.handleBlur}
                        handleChange={placementForm.handleChange}
                      />
                    </div>
                  </>
                )}
                {!showBusinessFields && (
                  <>
                    <div className="col-lg-3">
                      <BaseInput
                        label={placementLable.companyName}
                        type="text"
                        name="companyName"
                        className="form-control"
                        placeholder={PlaceHolderFormat(
                          placementLable.companyName
                        )}
                        value={placementForm.values.companyName}
                        touched={placementForm.touched.companyName}
                        error={placementForm.errors.companyName}
                        handleBlur={placementForm.handleBlur}
                        handleChange={placementForm.handleChange}
                      />
                    </div>
                    <div className="col-lg-3">
                      <BaseInput
                        name="appointmentLetter"
                        type="file"
                        accept=".jpg,.png,.doc,.docx,.pdf"
                        label={placementLable.appointmentLetter}
                        handleChange={(e) => handleFileChange(e, e.target.name)}
                        touched={placementForm.touched.appointmentLetter}
                        error={placementForm.errors.appointmentLetter}
                        handleBlur={placementForm.handleBlur}
                      />
                      {placementForm.values.appointmentLetter?.length > 0 && (
                        <span className="fw-normal">
                          <Link
                            target="_blank"
                            className="text-dark"
                            to={`${BaseImageURL}${placementForm.values.appointmentLetter}`}
                          >
                            {placementLable.viewLetter}
                          </Link>
                        </span>
                      )}
                    </div>
                    <div className="col-lg-3">
                      <BaseSelect
                        label={placementLable.employmentNature}
                        name="employmentNature"
                        placeholder={SelectPlaceHolder(
                          placementLable.employmentNature
                        )}
                        options={EmploymentNatureOptions}
                        handleChange={(field, value) => {
                          placementForm.setFieldValue(field, value);
                        }}
                        value={placementForm.values.employmentNature}
                        touched={placementForm.touched.employmentNature}
                        error={placementForm.errors.employmentNature}
                        handleBlur={placementForm.handleBlur}
                      />
                    </div>
                    <div className="col-lg-3">
                      <BaseSelect
                        label={placementLable.jobLocation}
                        name="jobLocation"
                        options={states}
                        handleChange={(field, value) => {
                          placementForm.setFieldValue(field, value);
                        }}
                        placeholder={SelectPlaceHolder(
                          placementLable.jobLocation
                        )}
                        value={placementForm.values.jobLocation}
                        touched={placementForm.touched.jobLocation}
                        error={placementForm.errors.jobLocation}
                        handleBlur={placementForm.handleBlur}
                      />
                    </div>
                    <div className="col-lg-3">
                      <BaseInput
                        label={placementLable.salary}
                        name="salary"
                        type="number"
                        className="form-control"
                        placeholder={PlaceHolderFormat(placementLable.salary)}
                        value={placementForm.values.salary}
                        touched={placementForm.touched.salary}
                        error={placementForm.errors.salary}
                        handleBlur={placementForm.handleBlur}
                        handleChange={placementForm.handleChange}
                      />
                    </div>
                    <div className="col-lg-3">
                      <BaseInput
                        label={placementLable.joiningDate}
                        name="joiningDate"
                        type="date"
                        className="form-control"
                        value={placementForm.values.joiningDate}
                        touched={placementForm.touched.joiningDate}
                        error={placementForm.errors.joiningDate}
                        handleBlur={placementForm.handleBlur}
                        handleChange={placementForm.handleChange}
                      />
                    </div>
                    <div className="col-lg-3">
                      <BaseInput
                        label={placementLable.closingDate}
                        name="closingDate"
                        type="date"
                        className="form-control"
                        value={placementForm.values.closingDate}
                        touched={placementForm.touched.closingDate}
                        error={placementForm.errors.closingDate}
                        handleBlur={placementForm.handleBlur}
                        handleChange={placementForm.handleChange}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12 row">
                <div className="col-lg-6" />
                <div className="col-lg-6 mt-2 d-flex justify-content-end align-items-end">
                  <BaseButton
                    className="btn btn-pill"
                    type="submit"
                    loader={btnLoader}
                    disabled={btnLoader}
                    children={
                      editId !== null ? (btnLoader ? Loading : Update) : Submit
                    }
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="col-6 py-2 px-3">
        <h5 className="f-w-600">{placementLable.placementList}</h5>
      </div>
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {placementCandidate && placementCandidate?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              fetchData={handleFetchData}
              columns={columns}
              data={searchValue ? [] : placementCandidate || []}
              isGlobalFilter={true}
              customPageSize={customPageSize}
              setCustomPageSize={setCustomPageSize}
              manualPagination={true}
              tableClass="table table-bordered text-center"
              onSearch={handleSearchValueChange}
              SearchPlaceholder={Search}
              fetchSortingData={handleFetchSorting}
            />
          )}
          {!loader && !placementCandidate && (
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

      <BaseModal
        isOpen={slarySlipModal}
        toggler={slarySlipAdd}
        title={
          isEdit
            ? placementViewLable.editSlipTitle
            : placementViewLable.addSlipTitle
        }
        submitText={isEdit ? Update : Submit}
        disabled={btnLoader}
        loader={btnLoader}
        submit={SlipFrom.handleSubmit}
      >
        <div className="row">
          <div className="col-lg-6">
            <BaseSelect
              label={placementLable.companyName}
              name="companyName"
              options={
                isEdit
                  ? [
                      {
                        label: SlipFrom.values.companyName,
                        value: SlipFrom.values.companyName,
                      },
                    ]
                  : [
                      {
                        label: slarySlip?.company_name,
                        value: slarySlip?.company_name,
                      },
                    ]
              }
              isDisabled={true}
              handleChange={(field, value) => {
                SlipFrom.setFieldValue(field, value);
              }}
              value={SlipFrom.values.companyName}
              touched={SlipFrom.touched.companyName}
              error={SlipFrom.errors.companyName}
              handleBlur={SlipFrom.handleBlur}
            />
          </div>
          <div className="col-lg-6">
            <BaseInput
              label={placementLable.month}
              type="month"
              name="month"
              className="form-control"
              handleChange={SlipFrom.handleChange}
              value={SlipFrom.values.month}
              touched={SlipFrom.touched.month}
              error={SlipFrom.errors.month}
              handleBlur={SlipFrom.handleBlur}
            />
          </div>
          <div className="col-lg-6">
            <BaseInput
              label={placementLable.totalWorkingDays}
              type="number"
              min={0}
              name="totalWorkingDays"
              className="form-control"
              placeholder={PlaceHolderFormat(placementLable.totalWorkingDays)}
              value={SlipFrom.values.totalWorkingDays}
              touched={SlipFrom.touched.totalWorkingDays}
              handleChange={(e) => {
                if (
                  e?.target?.value?.length <= 3 &&
                  digitRegex.test(e.target.value)
                ) {
                  SlipFrom.handleChange(e);
                }
              }}
              error={SlipFrom.errors.totalWorkingDays}
              handleBlur={SlipFrom.handleBlur}
            />
          </div>
          <div className="col-lg-6">
            <BaseInput
              name="salarySlip"
              label={placementLable.salarySlip}
              className="form-control"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf.doc,.docx"
              handleChange={(e) => handleSlarySlipChange(e, e.target.name)}
              touched={SlipFrom.touched.salarySlip}
              error={SlipFrom.errors.salarySlip}
              handleBlur={SlipFrom.handleBlur}
            />

            {SlipFrom.values.salarySlip?.length > 0 && (
              <span className="fw-normal">
                <Link
                  target="_blank"
                  className="text-dark"
                  to={`${BaseImageURL}${SlipFrom.values.salarySlip}`}
                >
                  {placementLable.viewSlip}
                </Link>
              </span>
            )}
          </div>
          <span className="text-warning fw-normal mb-2">
            {placementLable.fileAllowed}
          </span>
        </div>
      </BaseModal>

      {candidateDetailsModal && (
        <BaseModal
          size="lg"
          isOpen={candidateDetailsModal}
          toggler={() => setCandidateDetailsModal(false)}
          title={placementViewLable.CandidatePlacementDetails}
          submitText="Close"
          hasSubmitButton={false}
        >
          <div className="p-6">
            {candidateDetails ? (
              <>
                <div className="section-content">
                  <div className="section-title p-1 bg-light text-dark fs-6 font-weight-bold">
                    <b>{placementLable.personaldetails}</b>
                  </div>
                  <div className="row p-2">
                    <div className="col-6">
                      <label>{placementViewLable.candidateName}</label>
                      <span>
                        {candidateDetails?.candidate?.candidate_name || "N/A"}
                      </span>
                    </div>
                    <div className="col-6">
                      <label>{placementViewLable.employmentType}</label>
                      <span>{candidateDetails?.employment_type || "N/A"}</span>
                    </div>
                    <div className="col-6">
                      <label>{placementViewLable.contactNumber}</label>
                      <span>
                        {candidateDetails?.candidate?.contact_no || "N/A"}
                      </span>
                    </div>
                    <div className="col-6">
                      <label>{placementViewLable.emailAddress}</label>
                      <span>{candidateDetails?.candidate?.email || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div className="section-content salaryslip">
                  <div className="section-title p-1 bg-light text-dark fs-6 font-weight-bold">
                    <b>{placementViewLable.slarySlipDetails}</b>
                  </div>

                  <div className="card-body text-center">
                    {loader && (
                      <Spinner attrSpinner={{ className: "loader-2" }} />
                    )}
                    {Array.isArray(candidateDetails?.salarySlipDetail) && (
                      <>
                        <TableContainer
                          fetchData={false}
                          columns={SalarySlipColumn}
                          data={candidateDetails?.salarySlipDetail}
                          tableClass="table table-bordered text-center"
                          fetchSortingData={false}
                          setCustomPageSize={setCustomPage}
                          customPage={customPage}
                          hasManualPagination={false}
                          customPageSize={customPageSize}
                          manualPagination={true}
                        />
                      </>
                    )}
                    {!loader && !candidateDetails?.salarySlipDetail && (
                      <div className="py-4 text-center">
                        <div>
                          <i className="ri-search-line display-5 text-success"></i>
                        </div>
                        <div className="mt-4">
                          <h5>{notFound.dataNotFound}</h5>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p>{handleResponse.dataNotFound}</p>
            )}
          </div>
        </BaseModal>
      )}
    </>
  );
};

export default AddPlacement;
