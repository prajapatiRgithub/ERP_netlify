import React, { useEffect, useMemo, useState } from "react";
import {
  listOfAccreditationApi,
  viewAccreditationApi,
  addAccreditationApi,
  editAccreditationApi,
  deleteAccreditationApi,
} from "../../Api/AccreditationApi";
import TableContainer from "../../BaseComponents/BaseTable";
import { Action, Loading, notFound } from "../../Constant";
import Spinner from "../../BaseComponents/BaseLoader";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseSelect from "../../BaseComponents/BaseSelect";
import {
  SelectPlaceHolder,
  validationMessages,
} from "../../Constant/validation";
import BaseButton from "../../BaseComponents/BaseButton";
import {
  RiEditFill,
  RiEyeLine,
  RiDeleteBin7Fill,
  RiSearchLine,
} from "react-icons/ri";
import { StatusCodes } from "http-status-codes";
import { useFormik } from "formik";
import * as yup from "yup";
import { accreditationEnums } from "../../Constant/Accreditation";
import BaseModal from "../../BaseComponents/BaseModal";
import { toast } from "react-toastify";
import { DeleteMessage } from "../../Constant/Center";
import { centerApi } from "../../Api/common";
import { handleEditClick } from "../../Constant/common";
import { editBatchLable } from "../../Constant/BatchAllocation/batchallocation";
import { exportAccreditation } from "../../Api/exportBtn";
import { BaseImageURL } from "../../Api/Service";
import { courseCodeQPList } from "../../Api/BatchApi";

const Accreditation = () => {
  document.title = accreditationEnums.TITLE;
  const [accreditationData, setAccreditationData] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [totalNumberOfRows, setTotalNumberOfRows] = useState();
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [editData, setEditData] = useState(null);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [centerData, setCenterData] = useState();
  const [courseData, setCourseData] = useState();
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [accreditationDetails, setAccreditationDetails] = useState(null);
  const [accreditationId, setAccreditationId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [modalDelete, setModalDelete] = useState(false);

  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  const handleFetchData = (page) => {
    setCurrentPage(page);
    setBtnLoader(false);
  };

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
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
          let data = resp?.data[0].centerCourse;
          setCourseData(
            data?.map((item) => ({
              value: item?.course?.id,
              label: item?.course?.course_name,
              qp_code: item?.course?.qp_code,
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

  const fetchAccreditationData = async (id) => {
    setLoader(true);
    const payload = {
      order: [columnName, sortOrder],
      condition: {
        id: id,
      },
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    const accdrentiationPayload = {
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    listOfAccreditationApi(id !== null ? payload : accdrentiationPayload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          if (id !== null) {
            setEditData(resp?.data?.listOfAccreditation[0]);
            handleCourseList(resp?.data?.listOfAccreditation[0]?.center.id);
          } else {
            setAccreditationData(resp?.data?.listOfAccreditation);
            setTotalPages(resp?.data?.totalPages);
            setTotalRecords(resp?.data?.totalRecordsCount);
            setTotalNumberOfRows(resp?.data?.numberOfRows);
            setCurrentPage(resp?.data?.currentPage);
          }
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((error) => {
        return error;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const fetchData = () => {
    centerApi()
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          let data = resp?.data;
          setCenterData(
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
      });
  };

  useEffect(() => {
    fetchData();
    fetchAccreditationData(null);
  }, [currentPage, customPageSize, columnName, sortOrder]);

  const accreditationForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      center_name: editData ? editData?.center?.id : "",
      course_name: editData ? editData?.course?.id : "",
      qp_code: editData ? editData?.qp_code : "",
      sector: editData ? editData?.sector : "",
      accreditation_date: editData ? editData?.accreditation_date : "",
      expiry_date: editData ? editData?.expiry_date : "",
      remarks: editData ? editData?.remarks : "",
    },
    validationSchema: yup.object({
      center_name: yup
        .string()
        .required(validationMessages.required(accreditationEnums.CENTER_NAME)),
      course_name: yup
        .string()
        .required(validationMessages.required(accreditationEnums.COURSE_NAME)),
      qp_code: yup
        .string()
        .required(validationMessages.required(accreditationEnums.QP_CODE)),
      sector: yup
        .string()
        .required(validationMessages.required(accreditationEnums.SECTOR)),
      accreditation_date: yup
        .date()
        .required(
          validationMessages.required(accreditationEnums.ACCREDITATION_DATE)
        ),
      expiry_date: yup
        .string()
        .when("accreditation_date", (accreditation_date, schema) => {
          return schema.test({
            name: accreditationEnums.expiry_data,
            exclusive: false,
            message: accreditationEnums.EXPIRY_DATE_VALIDATION,
            test: function (value) {
              if (!value || !accreditation_date) return true;
              return new Date(value) > new Date(accreditation_date);
            },
          });
        }),
      remarks: yup
        .string()
        .required(validationMessages.required(accreditationEnums.REMARKS)),
    }),
    onSubmit: (values, { resetForm }) => {
      setBtnLoader(true);
      const payload = {
        center_id: values.center_name,
        course_id: values.course_name,
        qp_code: values.qp_code,
        sector: values.sector,
        accreditation_date: values.accreditation_date,
        expiry_date: values.expiry_date,
        remarks: values.remarks,
      };

      if (editId !== null) {
        editAccreditationApi(editId, payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp?.message);
              fetchAccreditationData(null);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
            return err;
          })
          .finally(() => {
            setBtnLoader(false);
            setEditData(null);
            setEditId(null);
            accreditationForm.resetForm();
            resetForm();
          });
      } else {
        setEditId(null);
        addAccreditationApi(payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp?.message);
              fetchAccreditationData(null);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
            return err;
          })
          .finally(() => {
            setBtnLoader(false);
            accreditationForm.resetForm();
          });
      }
    },
  });

  const editAccreditation = (id) => {
    setEditId(id);
    fetchAccreditationData(id);
  };

  const viewAccreditationDetails = (id) => {
    if (id) {
      fetchAccreditationDetails(id);
    }
    setModalOpen(!modalOpen);
  };

  const fetchAccreditationDetails = (id) => {
    setLoader(true);
    viewAccreditationApi(id)
      .then((response) => {
        if (
          response?.statusCode === StatusCodes.ACCEPTED ||
          response?.statusCode === StatusCodes.OK ||
          response?.statusCode === StatusCodes.CREATED
        ) {
          setAccreditationDetails(response?.data);
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const deleteAccreditation = async () => {
    setDeleteLoader(true);
    await deleteAccreditationApi(accreditationId)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          toast.success(resp?.message);
          fetchAccreditationData(null);
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
        return err;
      })
      .finally(() => {
        setDeleteLoader(false);
        setModalDelete(false);
        setLoader(false);
      });
  };

  const toggleDelete = (id) => {
    setAccreditationId(id);
    setModalDelete(!modalDelete);
  };

  const columns = useMemo(() => [
    {
      header: accreditationEnums.CENTER_NAME,
      accessorKey: "center.center_name",
      enableColumnFilter: false,
    },
    {
      header: accreditationEnums.COURSE_NAME,
      accessorKey: "course.course_name",
      enableColumnFilter: false,
    },
    {
      header: accreditationEnums.SECTOR,
      accessorKey: "sector",
      enableColumnFilter: false,
    },
    {
      header: accreditationEnums.ACCREDITATION_DATE,
      accessorKey: "accreditation_date",
      enableColumnFilter: false,
    },
    {
      header: accreditationEnums.EXPIRY_DATE,
      accessorKey: "expiry_date",
      enableColumnFilter: false,
    },
    {
      header: accreditationEnums.REMARKS,
      accessorKey: "remarks",
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
                editAccreditation(cell?.row?.original?.id);
                handleEditClick();
              }}
              title="Edit"
            />
          </span>
          <span>
            <RiEyeLine
              className={`fs-5 mx-2 text-success ${
                cell?.row?.original?.status === "Pending" ? `icon-disabled` : ``
              }`}
              onClick={() => viewAccreditationDetails(cell?.row?.original?.id)}
              title="Delete"
            />
          </span>
          <span>
            <RiDeleteBin7Fill
              className={`fs-5 mx-2 text-danger ${
                cell?.row?.original?.status === "Pending" ? `icon-disabled` : ``
              }`}
              onClick={() => toggleDelete(cell?.row?.original?.id)}
              title="Delete"
            />
          </span>
        </div>
      ),
      enableColumnFilter: false,
    },
  ]);

  const handleExportAccreditation = () => {
    setLoader(true);
    exportAccreditation(1)
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

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center w-full px-3">
        <h5 className="f-w-600">{accreditationEnums.ACCREDITATION}</h5>
        <div className="col-sm-auto col-md-auto mb-2">
          <BaseButton color="success" onClick={handleExportAccreditation}>
            {editBatchLable.export} {accreditationEnums.ACCREDITATION}
          </BaseButton>
        </div>
      </div>
      <BaseModal
        isOpen={modalDelete}
        title="Delete"
        toggler={toggleDelete}
        submit={() => deleteAccreditation()}
        submitText="Delete"
        disabled={deleteLoader}
        loader={deleteLoader}
      >
        {DeleteMessage}
      </BaseModal>
      <BaseModal
        isOpen={modalOpen}
        title="View Accreditation"
        toggler={handleCloseModal}
        size="lg"
        submitText="Close"
        children={
          accreditationDetails ? (
            <div>
              <div className="mb-3">
                <div className="row p-2">
                  <div className="col-12 bg-light mb-2">
                    <h6 className="col-12 text-dark fw-bold pt-3 pb-2">
                      {accreditationEnums.ACCREDITATION_DETAILS}
                    </h6>
                  </div>
                  <div className="col-6 mb-2 mt-2">
                    <h6 className="mb-4">
                      <span className="fw-bold mb-2 mt-2">
                        {accreditationEnums.CENTER_NAME}:
                      </span>{" "}
                      {accreditationDetails.center.center_name}
                    </h6>
                    <h6 className="mb-4">
                      <span className="fw-bold mb-2 mt-2">
                        {accreditationEnums.COURSE_NAME}:
                      </span>{" "}
                      {accreditationDetails.course.course_name}
                    </h6>
                    <h6 className="mb-4">
                      <span className="fw-bold mb-2 mt-2">
                        {accreditationEnums.EXPIRY_DATE}:
                      </span>{" "}
                      {accreditationDetails.expiry_date}
                    </h6>
                  </div>
                  <div className="col-6 mb-2 mt-2">
                    <h6 className="mb-4">
                      <span className="fw-bold mb-2 mt-2">
                        {accreditationEnums.SECTOR}:
                      </span>{" "}
                      {accreditationDetails.sector}
                    </h6>
                    <h6 className="mb-4">
                      <span className="fw-bold mb-2 mt-2">
                        {accreditationEnums.ACCREDITATION_DATE}:
                      </span>{" "}
                      {accreditationDetails.accreditation_date}
                    </h6>
                    <h6 className="mb-4">
                      <span className="fw-bold mb-2 mt-2">
                        {accreditationEnums.REMARKS}:
                      </span>{" "}
                      {accreditationDetails.remarks}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Spinner />
          )
        }
        hasSubmitButton={false}
      ></BaseModal>

      <div className="card p-4 rounded mb-0 mx-3">
        <div className="">
          <form onSubmit={accreditationForm.handleSubmit}>
            <div className="row justify-content-center">
              <div className="col-lg-12 row">
                <h5 className="my-2 sub-title">
                  {accreditationEnums.ACCREDITATION_DETAILS}
                </h5>
                <div className="col-lg-3">
                  <BaseSelect
                    name="center_name"
                    label={accreditationEnums.CENTER_NAME}
                    className="select-border"
                    options={centerData}
                    placeholder={SelectPlaceHolder(
                      accreditationEnums.CENTER_NAME
                    )}
                    handleChange={(field, value) => {
                      accreditationForm.setFieldValue(field, value);
                      handleCourseList(value)
                    }}
                    handleBlur={() =>
                      accreditationForm.setFieldTouched(
                        accreditationEnums.CENTER_NAME,
                        true
                      )
                    }
                    value={accreditationForm.values.center_name}
                    touched={accreditationForm.touched.center_name}
                    error={accreditationForm.errors.center_name}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseSelect
                    name="course_name"
                    label={accreditationEnums.COURSE_NAME}
                    className="select-border"
                    options={courseData}
                    placeholder={SelectPlaceHolder(
                      accreditationEnums.COURSE_NAME
                    )}
                    handleChange={(field, value) => {
                      const selectedCourse = courseData.find(
                        (course) => course.value === value
                      );
                      accreditationForm.setFieldValue(field, value);
                      accreditationForm.setFieldValue(
                        "qp_code",
                        selectedCourse?.qp_code || ""
                      );
                    }}
                    handleBlur={() =>
                      accreditationForm.setFieldTouched(
                        accreditationEnums.COURSE_NAME,
                        true
                      )
                    }
                    value={accreditationForm.values.course_name}
                    touched={accreditationForm.touched.course_name}
                    error={accreditationForm.errors.course_name}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    label={accreditationEnums.QP_CODE}
                    name="qp_code"
                    value={accreditationForm.values.qp_code}
                    onChange={accreditationForm.handleChange}
                    onBlur={accreditationForm.handleBlur}
                    disabled={true}
                    isInvalid={
                      accreditationForm.touched.qp_code &&
                      accreditationForm.errors.qp_code
                    }
                    isValid={
                      accreditationForm.touched.qp_code &&
                      !accreditationForm.errors.qp_code
                    }
                    errorMessage={accreditationForm.errors.qp_code}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    name="sector"
                    type="text"
                    label={accreditationEnums.SECTOR}
                    placeholder={PlaceHolderFormat(accreditationEnums.SECTOR)}
                    value={accreditationForm.values.sector}
                    touched={accreditationForm.touched.sector}
                    error={accreditationForm.errors.sector}
                    handleBlur={accreditationForm.handleBlur}
                    handleChange={accreditationForm.handleChange}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    name="accreditation_date"
                    type="date"
                    label={accreditationEnums.ACCREDITATION_DATE}
                    placeholder={PlaceHolderFormat(
                      accreditationEnums.ACCREDITATION_DATE
                    )}
                    value={accreditationForm.values.accreditation_date}
                    touched={accreditationForm.touched.accreditation_date}
                    error={accreditationForm.errors.accreditation_date}
                    handleBlur={accreditationForm.handleBlur}
                    handleChange={accreditationForm.handleChange}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    name="expiry_date"
                    type="date"
                    label={accreditationEnums.EXPIRY_DATE}
                    placeholder={PlaceHolderFormat(
                      accreditationEnums.EXPIRY_DATE
                    )}
                    value={accreditationForm.values.expiry_date}
                    touched={accreditationForm.touched.expiry_date}
                    error={accreditationForm.errors.expiry_date}
                    handleBlur={accreditationForm.handleBlur}
                    handleChange={accreditationForm.handleChange}
                  />
                </div>
                <div className="col-lg-3">
                  <BaseInput
                    type="textarea"
                    name="remarks"
                    label={accreditationEnums.REMARKS}
                    rows={2}
                    className={`form-control ${
                      accreditationForm.touched.address &&
                      accreditationForm.errors.remarks
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder={PlaceHolderFormat(accreditationEnums.REMARKS)}
                    value={accreditationForm.values.remarks}
                    touched={accreditationForm.touched.remarks}
                    error={accreditationForm.errors.remarks}
                    handleBlur={accreditationForm.handleBlur}
                    handleChange={accreditationForm.handleChange}
                  />
                </div>
                <div className="col-lg-3 d-flex justify-content-end align-items-end">
                  <div className="mt-4 mt-lg-0">
                    <BaseButton
                      className="mx-2"
                      color="primary"
                      type="submit"
                      disabled={btnLoader}
                      loader={btnLoader}
                      children={
                        editId !== null
                          ? btnLoader
                            ? Loading
                            : "Update"
                          : "Submit"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="col-6 py-2 px-3 mt-4">
        <h5 className="f-w-600">{accreditationEnums.ACCREDITATION_LIST}</h5>
      </div>
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {accreditationData && accreditationData?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              currentPage={currentPage}
              fetchData={handleFetchData}
              setCurrentPage={setCurrentPage}
              customPageSize={customPageSize}
              setCustomPageSize={setCustomPageSize}
              fetchSortingData={handleFetchSorting}
              manualPagination={true}
              columns={columns}
              data={searchValue ? [] : accreditationData || []}
              isGlobalFilter={true}
              SearchPlaceholder="Search"
              onSearch={handleSearchValueChange}
              tableClass="table table-bordered text-center"
            />
          )}
          {!loader && !accreditationData && (
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
  );
};

export default Accreditation;
