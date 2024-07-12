import React, { useEffect, useState } from "react";
import { center } from "../../Constant/Inquiry/Inquiry";
import BaseInput from "../../BaseComponents/BaseInput";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import BaseButton from "../../BaseComponents/BaseButton";
import {
  digitRegex,
  emailRegex,
  numberRegex,
  SelectPlaceHolder,
  validationMessages,
} from "../../Constant/validation";
import * as yup from "yup";
import { useFormik } from "formik";
import { centerApi } from "../../Api/common";
import { StatusCodes } from "http-status-codes";
import {
  Action,
  ContactNo,
  ContactNumber,
  Delete,
  Email,
  Loading,
  notFound,
  Search,
  Submit,
  Update,
} from "../../Constant";
import BaseSelect from "../../BaseComponents/BaseSelect";
import {
  addTot,
  deleteTot,
  editTot,
  exportTot,
  listOfTot,
  listOfUser,
  viewTot,
} from "../../Api/Tot";
import { courseCodeQPList } from "../../Api/BatchApi";
import TableContainer from "../../BaseComponents/BaseTable";
import Spinner from "../../BaseComponents/BaseLoader";
import { useMemo } from "react";
import {
  RiEditFill,
  RiEyeFill,
  RiSearchLine,
  RiDeleteBin7Fill,
} from "react-icons/ri";
import { toast } from "react-toastify";
import { handleEditClick, handleResponse, role } from "../../Constant/common";
import BaseModal from "../../BaseComponents/BaseModal";
import {
  alphabetOnlyRegex,
  placeHolderTot,
  TotLabels,
} from "../../Constant/TOT/tot";
import { DeleteMessage, SrNo } from "../../Constant/Center";
import { BaseImageURL } from "../../Api/Service";
import { totTitle } from "../../Constant/title";

const Tot = () => {
  document.title = totTitle;
  const [centerList, setCenterList] = useState();
  const [totData, setTotData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editId, setEditId] = useState(null);
  const [courseData, setCourseData] = useState();
  const [userData, setUserData] = useState();
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [totDetails, setTotDetails] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [totId, setTotId] = useState();
  const [modal, setModal] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  let data;

  const handleExportTot = () => {
    setLoader(true);
    exportTot()
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          const filename = resp?.data;
          const url = `${BaseImageURL}${resp?.data}`;
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          toast.success(resp.success);
        } else {
          toast.error(resp.message);
        }
      })
      .catch((error) => {
        toast.error(error.message);
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

  const fetchTotData = async (id) => {
    setLoader(true);
    const payload = {
      order: [columnName, sortOrder],
      condition: {
        id: id,
      },
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    const totPayload = {
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    listOfTot(id !== null ? payload : totPayload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          if (id !== null) {
            setEditData(resp?.data?.listOfTotDetail[0]);
            handleCourseList(resp?.data?.listOfTotDetail[0]?.center.id);
          } else {
            setTotData(resp?.data?.listOfTotDetail);
            setTotalRecords(resp.data.totalRecordsCount);
            setTotalPages(resp?.data?.totalPages);
            setTotalNumberOfRows(resp?.data?.numberOfRows);
            setCurrentPage(resp?.data?.currentPage);
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

  const fetchData = () => {
    centerApi({})
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setCenterList(
            data?.map((item) => ({
              value: item?.id,
              label: item?.center_name,
              id: item?.id,
            }))
          );
        }
      })
      .catch((err) => {
        return err;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleCourseList = (id) => {
    setLoader(true);
    const payload = {
      order: ["id", "ASC"],
      condition: {
        id: id,
      },
    };
    courseCodeQPList(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data[0].centerCourse;
          setCourseData(
            data?.map((item) => ({
              value: item?.course?.id,
              label: item?.course?.course_name,
              qpCode: item?.course?.qp_code,
              id: item?.course?.id,
            }))
          );
        }
      })
      .catch((err) => {
        return err;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const fetchUsers = () => {
    listOfUser({
      condition: {
        role: role.trainer,
      },
    })
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setUserData(
            data?.map((item) => ({
              value: item?.id,
              label: item?.name,
              id: item?.id,
              email: item?.email,
              contact_no: item?.contact_no,
            }))
          );
        }
      })
      .catch((err) => {
        return err;
      });
  };

  useEffect(() => {
    fetchData();
    fetchTotData(null);
    fetchUsers();
  }, [columnName, sortOrder, currentPage, customPageSize]);

  const totForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      center_id: editData ? editData?.center?.id : "",
      course_name: editData ? editData?.course?.id : "",
      candidate_name: editData ? editData?.trainerId?.id : "",
      trainer_id: editData ? editData?.trainerId?.id : "",
      qp_code: editData ? editData?.qp_code : "",
      certificate_number: editData ? editData?.certificate_no : "",
      issue_date: editData ? editData?.issue_date : "",
      valid_upto: editData ? editData?.valid_upto : "",
      alt_name: editData ? editData?.alter_name : "",
      alt_email: editData ? editData?.alter_email : "",
      alt_contact_no: editData ? editData?.alter_contact_no : "",
      contact_no: userDetails
        ? userDetails?.contact_no
        : editData
        ? editData?.contact_no
        : "",
      email: userDetails ? userDetails?.email : editData ? editData?.email : "",
    },
    validationSchema: yup.object({
      center_id: yup.string().required(validationMessages.required(center)),
      course_name: yup
        .string()
        .required(validationMessages.required(TotLabels.courseName)),
      candidate_name: yup
        .string()
        .required(validationMessages.required(TotLabels.staffName)),
      qp_code: yup
        .string()
        .required(validationMessages.required(TotLabels.qpCode)),
      trainer_id: yup
        .string()
        .required(validationMessages.required(TotLabels.trId)),
      certificate_number: yup
        .string()
        .required(validationMessages.required(TotLabels.certificateNumber)),
      issue_date: yup
        .date()
        .required(validationMessages.required(TotLabels.issueDate)),
      valid_upto: yup
        .date()
        .required(validationMessages.required(TotLabels.validUpto))
        .when("issue_date", (issue_date, schema) => {
          return schema.test({
            name: "valid_upto",
            exclusive: false,
            message: TotLabels.dateValidate,
            test: function (value) {
              if (!value || !issue_date) return true;
              return new Date(value) > new Date(issue_date);
            },
          });
        }),
      alt_name: yup
        .string()
        .required(validationMessages.required(TotLabels.alterName))
        .matches(alphabetOnlyRegex, TotLabels.alterNameValidation),
      alt_contact_no: yup
        .string()
        .required(validationMessages.required(TotLabels.Alternativecontactno))
        .matches(numberRegex, TotLabels.alterNoValidation),
      contact_no: yup
        .string()
        .required(validationMessages.required(ContactNo))
        .matches(numberRegex, validationMessages.format(ContactNo)),
      email: yup
        .string()
        .required(validationMessages.required(Email))
        .matches(emailRegex, validationMessages.format(Email)),
      alt_email: yup
        .string()
        .required(validationMessages.required(TotLabels.emailId))
        .matches(emailRegex, TotLabels.alterEmailValidation),
    }),
    onSubmit: (values, { resetForm }) => {
      setBtnLoader(true);
      const payload = {
        center_id: values.center_id,
        alter_name: values.alt_name,
        alter_contact_no: values.alt_contact_no.toString(),
        alter_email: values.alt_email,
        trainer_id: values.candidate_name,
        course_id: values.course_name,
        qp_code: values.qp_code,
        certificate_no: values.certificate_number,
        issue_date: values.issue_date,
        valid_upto: values.valid_upto,
      };
      if (editId !== null) {
        editTot(editId, payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp?.message);
              fetchTotData(null);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
          })
          .finally(() => {
            setEditId(null);
            setEditData(null);
            setBtnLoader(false);
            setUserDetails(null);
            totForm.resetForm();
            resetForm();
          });
      } else {
        setEditId(null);
        addTot(payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp.message);
              fetchTotData(null);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
          })
          .finally(() => {
            setBtnLoader(false);
            totForm.resetForm();
            setUserDetails(null)
          });
      }
    },
  });
  const fetchUserDetails = (userId) => {
    return listOfUser({
      condition: {
        id: userId,
      },
    });
  };

  const editTotData = (row) => {
    setEditId(row?.id);
    fetchTotData(row?.id);
    fetchUserDetails(row?.trainerId?.id)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          const data = resp?.data?.[0];
          setUserDetails(data?.contact_no);
          totForm.setFieldValue("trainer_id", data?.id);
          totForm.setFieldValue("contact_no", data?.contact_no);
          totForm.setFieldValue("email", data?.email);
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || err.message);
      });
  };
  const viewTotDetails = (id) => {
    if (id) {
      fetchTotDetails(id);
    }
    setModalOpen(!modalOpen);
  };

  const fetchTotDetails = (id) => {
    setLoader(true);
    viewTot(id)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setTotDetails(resp?.data);
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
  const deleteTotDetails = async () => {
    setDeleteLoader(true);
    await deleteTot(totId)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          toast.success(resp?.message);
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
      })
      .finally(() => {
        setDeleteLoader(false);
        toggle(null);
        fetchTotData(null);
      });
  };

  const toggle = (id) => {
    setTotId(id);
    setModal(!modal);
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
        header: TotLabels.staffName,
        accessorKey: TotLabels.candiateAccessKey,
        enableColumnFilter: false,
      },
      {
        header: TotLabels.alterName,
        accessorKey: TotLabels.alterAccessKey,
        enableColumnFilter: false,
      },
      {
        header: TotLabels.center,
        accessorKey: TotLabels.centerAccessKey,
        enableColumnFilter: false,
      },
      {
        header: TotLabels.certificateNumber,
        accessorKey: TotLabels.certificateNoAccessKey,
        enableColumnFilter: false,
      },
      {
        header: TotLabels.issueDate,
        accessorKey: TotLabels.issuseDateKey,
        enableColumnFilter: false,
      },
      {
        header: TotLabels.validUpto,
        accessorKey: TotLabels.validUptoKey,
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
                  editTotData(cell?.row?.original);
                  handleEditClick();
                }}
                title="Edit"
              />
            </span>
            <span>
              <RiEyeFill
                className="fs-5 text-success mx-2"
                onClick={() => viewTotDetails(cell?.row?.original?.id)}
                title="View"
              />
            </span>
            <span>
              <RiDeleteBin7Fill
                className="fs-5 text-danger mx-2"
                onClick={() => toggle(cell?.row?.original?.id)}
                title="Delete"
              />
            </span>
          </div>
        ),
        enableColumnFilter: false,
      },
    ],
    []
  );

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    if (editId !== null && editData) {
      totForm.setFieldValue("qp_code", editData?.qp_code);
      totForm.setFieldValue("candidate_name", editData?.trainerId?.id);
      totForm.setFieldValue("contact_no");
    }
  }, [editId, editData]);

  return (
    <>
      <div className="px-3 d-flex justify-content-between ">
        <h5 className="f-w-600">{TotLabels.tot}</h5>
        <div className="col-sm-auto col-md-auto mb-2">
          <BaseButton onClick={() => handleExportTot()} color="success">
            {TotLabels.totExport}
          </BaseButton>
        </div>
      </div>{" "}
      <div className="card p-4 rounded mb-0 mx-3">
        <form onSubmit={totForm.handleSubmit}>
          <div className="row">
            <div className="col-lg-12 row">
              <div className="col-lg-3">
                <BaseSelect
                  label={TotLabels.staffName}
                  name="candidate_name"
                  className="select-border"
                  handleChange={(field, value) => {
                    totForm.setFieldValue(field, value);
                    const selectedTrainer = userData?.find(
                      (user) => user?.value === value
                    );
                    totForm.setFieldValue("trainer_id", selectedTrainer.id);
                    totForm.setFieldValue(
                      "contact_no",
                      selectedTrainer.contact_no
                    );
                    totForm.setFieldValue("email", selectedTrainer.email);
                  }}
                  value={totForm.values.candidate_name}
                  placeholder={SelectPlaceHolder(TotLabels.staffName)}
                  options={userData}
                  touched={totForm.touched.candidate_name}
                  error={totForm.errors.candidate_name}
                  handleBlur={totForm.handleBlur}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="contact_no"
                  type="number"
                  label="Contact No"
                  readOnly
                  disabled={true}
                  placeholder={PlaceHolderFormat(ContactNumber)}
                  value={totForm.values.contact_no}
                  touched={totForm.touched.contact_no}
                  error={totForm.errors.contact_no}
                  handleBlur={totForm.handleBlur}
                  handleChange={totForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="email"
                  type="email"
                  label={Email}
                  readOnly
                  disabled={true}
                  placeholder={PlaceHolderFormat(Email)}
                  value={totForm.values.email}
                  touched={totForm.touched.email}
                  error={totForm.errors.email}
                  handleBlur={totForm.handleBlur}
                  handleChange={totForm.handleChange}
                />
              </div>

              <div className="col-lg-3">
                <BaseSelect
                  label={center}
                  name="center_id"
                  className="select-border"
                  handleChange={(field, value) => {
                    totForm.setFieldValue(field, value);
                    handleCourseList(value);
                  }}
                  placeholder={SelectPlaceHolder(center)}
                  options={centerList}
                  value={totForm.values.center_id}
                  touched={totForm.touched.center_id}
                  error={totForm.errors.center_id}
                  handleBlur={totForm.handleBlur}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 row">
              <div className="col-lg-3">
                <BaseSelect
                  name="course_name"
                  label={TotLabels.courseName}
                  className="select-border"
                  options={courseData}
                  placeholder={SelectPlaceHolder(TotLabels.courseName)}
                  handleChange={(field, value) => {
                    totForm.setFieldValue(field, value);
                    // Retrieve the QP code based on the selected course
                    const selectedCourse = courseData?.find(
                      (course) => course?.value === value
                    );
                    if (selectedCourse) {
                      totForm.setFieldValue("qp_code", selectedCourse?.qpCode);
                    }
                  }}
                  value={totForm.values.course_name}
                  handleBlur={totForm.handleBlur}
                  touched={totForm.touched.course_name}
                  error={totForm.errors.course_name}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="trainer_id"
                  type="number"
                  label={TotLabels.trId}
                  readOnly
                  disabled={true}
                  placeholder={placeHolderTot}
                  value={totForm.values.trainer_id}
                  touched={totForm.touched.trainer_id}
                  error={totForm.errors.trainer_id}
                  handleBlur={totForm.handleBlur}
                  handleChange={totForm.handleChange}
                />
              </div>

              <div className="col-lg-3">
                <BaseInput
                  name="alt_name"
                  type="text"
                  label={TotLabels.alterName}
                  placeholder={PlaceHolderFormat(TotLabels.alterName)}
                  value={totForm.values.alt_name}
                  touched={totForm.touched.alt_name}
                  error={totForm.errors.alt_name}
                  handleBlur={totForm.handleBlur}
                  handleChange={totForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="alt_contact_no"
                  type="number"
                  label={TotLabels.alterContactNo}
                  placeholder={PlaceHolderFormat(TotLabels.alterContactNo)}
                  value={totForm.values.alt_contact_no}
                  touched={totForm.touched.alt_contact_no}
                  error={totForm.errors.alt_contact_no}
                  handleBlur={totForm.handleBlur}
                  handleChange={(e) => {
                    if (
                      e?.target?.value?.length <= 10 &&
                      digitRegex.test(e.target.value)
                    ) {
                      totForm.handleChange(e);
                    }
                  }}
                />
              </div>

              <div className="row">
                <div className="col-lg-3">
                  <BaseInput
                    name="alt_email"
                    type="text"
                    label={TotLabels.alterEmailId}
                    placeholder={PlaceHolderFormat(TotLabels.alterEmailId)}
                    value={totForm.values.alt_email}
                    touched={totForm.touched.alt_email}
                    error={totForm.errors.alt_email}
                    handleBlur={totForm.handleBlur}
                    handleChange={totForm.handleChange}
                  />
                </div>

                <div className="col-lg-3">
                  <BaseInput
                    name="qp_code"
                    type="text"
                    label={TotLabels.qpCode}
                    readOnly
                    disabled={true}
                    placeholder={PlaceHolderFormat(TotLabels.qpCode)}
                    value={totForm.values.qp_code}
                    touched={totForm.touched.qp_code}
                    error={totForm.errors.qp_code}
                    handleBlur={totForm.handleBlur}
                    handleChange={totForm.handleChange}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    name="issue_date"
                    type="date"
                    label={TotLabels.issueDate}
                    placeholder={PlaceHolderFormat(TotLabels.issueDate)}
                    value={totForm.values.issue_date}
                    touched={totForm.touched.issue_date}
                    error={totForm.errors.issue_date}
                    handleBlur={totForm.handleBlur}
                    handleChange={totForm.handleChange}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    name="valid_upto"
                    type="date"
                    label={TotLabels.validUpto}
                    placeholder={PlaceHolderFormat(TotLabels.validUpto)}
                    value={totForm.values.valid_upto}
                    touched={totForm.touched.valid_upto}
                    error={totForm.errors.valid_upto}
                    handleBlur={totForm.handleBlur}
                    handleChange={totForm.handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-3">
                  <BaseInput
                    name="certificate_number"
                    type="text"
                    label={TotLabels.certificateNumber}
                    placeholder={PlaceHolderFormat(TotLabels.certificateNumber)}
                    value={totForm.values.certificate_number}
                    touched={totForm.touched.certificate_number}
                    error={totForm.errors.certificate_number}
                    handleBlur={totForm.handleBlur}
                    handleChange={totForm.handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 d-flex justify-content-end align-items-end">
                  <div className="mt-2">
                    <BaseButton
                      className="btn btn-pill"
                      type="submit"
                      disabled={btnLoader}
                      loader={btnLoader}
                      children={
                        editId !== null
                          ? btnLoader
                            ? Loading
                            : Update
                          : Submit
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="col-6 py-2 px-3">
        <h5 className="f-w-600">{TotLabels.totList}</h5>
      </div>
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {totData && totData?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              fetchData={handleFetchData}
              columns={columns}
              data={searchValue ? [] : totData || []}
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
          {!loader && totData?.length === 0 && (
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
      {modalOpen && totDetails && (
        <BaseModal
          isOpen={modalOpen}
          title={TotLabels.totDetails}
          hasSubmitButton={false}
          toggler={handleCloseModal}
        >
          <div className="list-group-flush">
            <div class="row my-2 pb-1 border-bottom ">
              <span class="col-6">{TotLabels.staffName}:</span>
              <span class="col-6">{totDetails?.trainerId?.name}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{TotLabels.email}:</span>
              <span class="col-6">{totDetails?.trainerId?.email}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{TotLabels.contactNumber}:</span>
              <span class="col-6">{totDetails?.trainerId?.contact_no}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{TotLabels.alterName}:</span>
              <span class="col-6">{totDetails?.alter_name}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{TotLabels.alterContactNo}:</span>
              <span class="col-6">
                {totDetails?.alter_contact_no || handleResponse.nullData}
              </span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{TotLabels.alterEmailId}:</span>
              <span class="col-6">
                {totDetails?.alter_email || handleResponse.nullData}
              </span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{TotLabels.qpCode}:</span>
              <span class="col-6">{totDetails?.qp_code}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{TotLabels.certificateNumber}:</span>
              <span class="col-6">{totDetails?.certificate_no}</span>
            </div>

            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{TotLabels.center}:</span>
              <span class="col-6">{totDetails?.center?.center_name}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{TotLabels.courseName}:</span>
              <span class="col-6">
                {totDetails?.course?.course_name || "--"}
              </span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{TotLabels.issueDate}:</span>
              <span class="col-6">{totDetails?.issue_date}</span>
            </div>
            <div class="row my-2">
              <span class="col-6">{TotLabels.validUpto}:</span>
              <span class="col-6">{totDetails?.valid_upto}</span>
            </div>
          </div>
        </BaseModal>
      )}
      <BaseModal
        isOpen={modal}
        title={Delete}
        toggler={toggle}
        submit={() => deleteTotDetails()}
        submitText={Delete}
        disabled={deleteLoader}
        loader={deleteLoader}
      >
        {DeleteMessage}
      </BaseModal>
    </>
  );
};

export default Tot;
