import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import TableContainer from "../../BaseComponents/BaseTable";
import BaseModal from "../../BaseComponents/BaseModal";
import BaseInput from "../../BaseComponents/BaseInput";
import {
  RiEditFill,
  RiCloseLine,
  RiCheckLine,
  RiSearchLine,
} from "react-icons/ri";
import { classEnums } from "../../Constant/Class/class";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import "../../assets/css/notification.css";
import {
  getClassIdFromSessionStorage,
  getBatchIdFromSessionStorage,
} from "../../Constant/common";
import {
  editMilestoneApi,
  editStatusApi,
  listOfMilestoneApi,
  viewClassApi,
} from "../../Api/ClassApi";
import { StatusCodes } from "http-status-codes";
import Spinner from "../../BaseComponents/BaseLoader";
import { toast } from "react-toastify";
import { Back, Search, Submit, Update, notFound } from "../../Constant";
import { Link } from "react-router-dom";
import { validationMessages } from "../../Constant/validation";

const ClassDetails = () => {
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [classDetails, setClassDetails] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [approveModal, setApproveModal] = useState(false);
  const [milestoneModal, setMilestoneModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [milestoneData, setMilestoneData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [milestoneId, setMilestoneId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const classIdFromSession = getClassIdFromSessionStorage();
  const batchIdFromSession = getBatchIdFromSessionStorage();

  useEffect(() => {
    fetchMilestone(null);
  }, [currentPage, customPageSize, columnName, sortOrder]);

  useEffect(() => {
    fetchClassDetails(classIdFromSession);
  }, []);

  const fetchClassDetails = (classIdFromSession) => {
    setLoader(true);
    viewClassApi(classIdFromSession)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setClassDetails(resp?.data);
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

  const fetchMilestone = async (milestoneId) => {
    setLoader(true);
    const payload = {
      condition: {
        batch_id: batchIdFromSession,
      },
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    const milestonePayload = {
      condition: {
        id: milestoneId,
        batch_id: batchIdFromSession,
      },
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    listOfMilestoneApi(milestoneId !== null ? milestonePayload : payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          if (milestoneId !== null) {
            setEditData(resp?.data?.listOfMilestone[0]);
          } else {
            setMilestoneData(resp?.data?.listOfMilestone);
            setTotalPages(resp?.data?.totalPages);
            setTotalRecords(resp?.data?.totalRecordsCount);
            setTotalNumberOfRows(resp?.data?.numberOfRows);
            setCurrentPage(resp?.data?.currentPage);
          }
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

  const validationSchema = yup.object({
    claimed_amount: yup
      .string()
      .required(validationMessages.required(classEnums.CLAIMED)),
    received_amount: yup
      .string()
      .required(validationMessages.required(classEnums.RECEIVED)),
    bill_invoice: yup
      .string()
      .required(validationMessages.required(classEnums.BILL_INVOICE)),
    submission_date: yup
      .string()
      .required(validationMessages.required(classEnums.SUBMISSION_DATE)),
  });

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };

  const milestoneForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      total_uniform: editData?.total_uniform,
      claimed_amount: isEditMode ? editData?.claimed_amount : "",
      received_amount: isEditMode ? editData?.received_amount : "",
      bill_invoice: isEditMode ? editData?.bill_invoice : "",
      submission_date: isEditMode ? editData?.submission_date : "",
      milestone_status: isEditMode ? editData?.milestone_status : "",
      remarks: isEditMode ? editData?.remarks : "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setBtnLoader(true);
      let payload = {
        claimed_amount: Number(values.claimed_amount),
        received_amount: Number(values.received_amount),
        bill_invoice: Number(values.bill_invoice),
        submission_date: values.submission_date,
      };
      if (isEditMode) {
        payload = {
          ...payload,
          bill_status: classEnums.REJECTED,
          remarks: values.remarks,
        };
        editStatusApi(milestoneId, payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp?.message);
              fetchMilestone(null);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.resp?.data?.message || err?.message);
          })
          .finally(() => {
            setBtnLoader(false);
            resetForm();
            setMilestoneModal(false);
            setMilestoneId(null);
          });
      }
      if (!isEditMode) {
        editMilestoneApi(milestoneId, payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp?.message);
              fetchMilestone(null);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.resp?.data?.message || err?.message);
          })
          .finally(() => {
            setBtnLoader(false);
            resetForm();
            setMilestoneModal(false);
          });
      }
    },
  });

  const approveBill = (id) => {
    setMilestoneId(id);
    setApproveModal(true);
  };

  const handleApprove = () => {
    setBtnLoader(true);
    const payload = {
      bill_status: classEnums.APPROVED,
    };
    editStatusApi(milestoneId, payload)
      .then((response) => {
        if (
          response?.statusCode === StatusCodes.ACCEPTED ||
          response?.statusCode === StatusCodes.OK ||
          response?.statusCode === StatusCodes.CREATED
        ) {
          toast.success(response?.message);
          fetchMilestone(null);
        } else {
          toast.error(response?.message);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
      })
      .finally(() => {
        setLoader(false);
        setApproveModal(false);
        setBtnLoader(false);
        setMilestoneId(null);
      });
  };
  const rejectStatus = (id) => {
    fetchMilestone(id);
    setMilestoneId(id);
    setMilestoneModal(true);
    setIsEditMode(true);
  };

  const addMilestone = (id) => {
    fetchMilestone(id);
    setMilestoneId(id);
    setMilestoneModal(true);
    setIsEditMode(false);
  };

  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  const milestoneColumns = [
    {
      header: classEnums.MILESTONE,
      accessorKey: "milestone",
      enableColumnFilter: false,
    },
    {
      header: classEnums.UNIFORM,
      accessorKey: "total_uniform",
      enableColumnFilter: false,
    },
    {
      header: classEnums.TOTAL,
      accessorKey: "milestone_amount",
      enableColumnFilter: false,
    },
    {
      header: classEnums.CLAIMED,
      accessorKey: "claimed_amount",
      enableColumnFilter: false,
    },
    {
      header: classEnums.RECEIVED,
      accessorKey: "received_amount",
      enableColumnFilter: false,
    },
    {
      header: classEnums.BILL_INVOICE,
      accessorKey: "bill_invoice",
      enableColumnFilter: false,
    },
    {
      header: classEnums.SUBMISSION_DATE,
      accessorKey: "submission_date",
      enableColumnFilter: false,
    },
    {
      header: classEnums.STATUS,
      accessorKey: "bill_status",
      enableColumnFilter: false,
    },
    {
      header: classEnums.ACTION,
      accessorKey: "action",
      enableColumnFilter: false,
      cell: ({ cell }) => {
        const isActionDisabled =
          cell.row.original.bill_status === classEnums.APPROVED ||
          cell.row.original.bill_status === classEnums.REJECTED;
        return (
          <div className="d-flex justify-content-center">
            <RiEditFill
              className={`fs-5 mx-2 ${
                isActionDisabled ? "text-muted" : "text-primary"
              }`}
              onClick={() =>
                !isActionDisabled && addMilestone(cell.row.original.id)
              }
              title={classEnums.ADD_MILESTONE}
            />
            <RiCheckLine
              className={`fs-5 mx-2 ${
                isActionDisabled ? "text-muted" : "text-success"
              }`}
              onClick={() =>
                !isActionDisabled && approveBill(cell.row.original.id)
              }
              title={classEnums.EDIT}
            />
            <RiCloseLine
              className={`fs-5 mx-2 ${
                isActionDisabled ? "text-muted" : "text-danger"
              }`}
              onClick={() =>
                !isActionDisabled && rejectStatus(cell.row.original.id)
              }
              title={classEnums.EDIT}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="container-fluid">
        <div className="page-header dash-breadcrumb py-3">
          <div className="row">
            <div className="col-6">
              <h5 className="f-w-600">{classEnums.CLASS_DETAILS}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <Link to="/class" className="btn btn-pill btn-primary mx-2">
                {Back}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
        <div className="section mb-3">
          {classDetails && (
            <div className="row p-2">
              <div className="col-4">
                <p>
                  <span className="fw-bold">{classEnums.BATCH_ID}:</span>{" "}
                  {classDetails?.viewClass?.batch_id}
                </p>
                <p>
                  <span className="fw-bold">{classEnums.COURSE_NAME}:</span>
                  {classDetails?.viewClass?.batch?.course?.course_name}
                </p>
                <p>
                  <span className="fw-bold">
                    {classEnums?.ENROLLED_CANDIDATES}:
                  </span>
                  {classDetails?.enrolled}
                </p>
                <p>
                  <span className="fw-bold">
                    {classEnums.PLACED_CANDIDATES}:
                  </span>
                  {classDetails?.placement}
                </p>
              </div>
              <div className="col-4">
                <p>
                  <span className="fw-bold">
                    {classEnums.BATCH_START_DATE}:
                  </span>
                  {classDetails?.viewClass?.batch?.start_date}
                </p>
                <p>
                  <span className="fw-bold">{classEnums.TOTAL_HOURS}:</span>
                  {classDetails?.viewClass?.batch?.course?.course_hours}
                </p>
                <p>
                  <span className="fw-bold">
                    {classEnums.ASSESSED_CANDIDATES}:
                  </span>
                  {classDetails?.assessment}
                </p>
                <p>
                  <span className="fw-bold">
                    {classEnums.DROPOUT_CANDIDATES}:
                  </span>
                  {classDetails?.drop_out}
                </p>
              </div>
              <div className="col-4">
                <p>
                  <span className="fw-bold">{classEnums.BATCH_END_DATE}:</span>
                  {classDetails?.viewClass?.batch?.end_date}
                </p>
                <p>
                  <span className="fw-bold">{classEnums.RATE_PER_HOUR}:</span>
                  {classDetails?.viewClass?.batch?.course?.course_rate}
                </p>
                <p>
                  <span className="fw-bold">
                    {classEnums.CERTIFIED_CANDIDATES}:
                  </span>
                  {classDetails?.certified}
                </p>
              </div>
            </div>
          )}
          {!loader && !classDetails && (
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

        <h6 className="p-2 bg-light text-dark">
          <b>{classEnums.MILESTONE}</b>
        </h6>

        <div className="card mx-3">
          <div className="card-body text-center">
            {milestoneData && milestoneData?.length > 0 && (
              <TableContainer
                totalPages={totalPages}
                totalRecords={totalRecords}
                totalNumberOfRows={totalNumberOfRows}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                fetchData={handleFetchData}
                columns={milestoneColumns}
                data={searchValue ? [] : milestoneData || []}
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
            {!loader && !milestoneData && (
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
          isOpen={approveModal}
          toggler={() => setApproveModal(false)}
          title={classEnums.BILL_TITLE}
          submitText={classEnums.YES}
          submit={handleApprove}
          isDisabled={btnLoader}
          loader={btnLoader}
        >
          <div className="text-left">
            <p>{classEnums.billApprove}</p>
          </div>
        </BaseModal>

        <BaseModal
          isOpen={milestoneModal}
          title={
            isEditMode ? classEnums.EDIT_MILESTONE : classEnums.ADD_MILESTONE
          }
          toggler={() => setMilestoneModal(false)}
          size="lg"
          submitText={isEditMode ? Update : Submit}
          submit={milestoneForm.handleSubmit}
          isDisabled={btnLoader}
          loader={btnLoader}
        >
          <form onSubmit={milestoneForm.handleSubmit}>
            <div className="row">
              <div className="col-6">
                <BaseInput
                  name="total_uniform"
                  label={classEnums.UNIFORM}
                  disabled
                  placeholder={PlaceHolderFormat(classEnums.UNIFORM)}
                  value={milestoneForm.values.total_uniform}
                  handleChange={milestoneForm.handleChange}
                  handleBlur={milestoneForm.handleBlur}
                  error={milestoneForm.errors.total_uniform}
                  touched={milestoneForm.touched.total_uniform}
                />
              </div>
              <div className="col-6">
                <BaseInput
                  name="total"
                  label={classEnums.TOTAL}
                  disabled
                  placeholder={PlaceHolderFormat(classEnums.TOTAL)}
                  value={milestoneForm.values.total}
                  handleChange={milestoneForm.handleChange}
                  handleBlur={milestoneForm.handleBlur}
                  error={milestoneForm.errors.total}
                  touched={milestoneForm.touched.total}
                />
              </div>
              <div className="custome-hr my-3"></div>
              <div className="col-6">
                <BaseInput
                  name="claimed_amount"
                  label={classEnums.CLAIMED}
                  placeholder={PlaceHolderFormat(classEnums.CLAIMED)}
                  value={milestoneForm.values.claimed_amount}
                  handleChange={milestoneForm.handleChange}
                  handleBlur={milestoneForm.handleBlur}
                  error={milestoneForm.errors.claimed_amount}
                  touched={milestoneForm.touched.claimed_amount}
                />
              </div>
              <div className="col-6">
                <BaseInput
                  name="received_amount"
                  label={classEnums.RECEIVED}
                  placeholder={PlaceHolderFormat(classEnums.RECEIVED)}
                  value={milestoneForm.values.received_amount}
                  handleChange={milestoneForm.handleChange}
                  handleBlur={milestoneForm.handleBlur}
                  error={milestoneForm.errors.received_amount}
                  touched={milestoneForm.touched.received_amount}
                />
              </div>
              <div className="col-6">
                <BaseInput
                  name="bill_invoice"
                  label={classEnums.BILL_INVOICE}
                  placeholder={PlaceHolderFormat(classEnums.BILL_INVOICE)}
                  value={milestoneForm.values.bill_invoice}
                  handleChange={milestoneForm.handleChange}
                  handleBlur={milestoneForm.handleBlur}
                  error={milestoneForm.errors.bill_invoice}
                  touched={milestoneForm.touched.bill_invoice}
                />
              </div>
              <div className="col-6">
                <BaseInput
                  name="submission_date"
                  type="date"
                  label={classEnums.SUBMISSION_DATE}
                  placeholder={PlaceHolderFormat(classEnums.SUBMISSION_DATE)}
                  value={milestoneForm.values.submission_date}
                  handleChange={milestoneForm.handleChange}
                  handleBlur={milestoneForm.handleBlur}
                  error={milestoneForm.errors.submission_date}
                  touched={milestoneForm.touched.submission_date}
                />
              </div>
              {isEditMode && (
                <div className="col-6">
                  <BaseInput
                    type="textarea"
                    name="remarks"
                    label={classEnums.REMARKS}
                    placeholder={PlaceHolderFormat(classEnums.REMARKS)}
                    value={milestoneForm.values.remarks}
                    handleChange={milestoneForm.handleChange}
                    handleBlur={milestoneForm.handleBlur}
                    error={milestoneForm.errors.remarks}
                    touched={milestoneForm.touched.remarks}
                  />
                </div>
              )}
            </div>
          </form>
        </BaseModal>
      </div>
    </>
  );
};

export default ClassDetails;
