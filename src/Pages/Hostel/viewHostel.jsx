import React, { useEffect, useMemo, useState } from "react";
import TableContainer from "../../BaseComponents/BaseTable";
import Spinner from "../../BaseComponents/BaseLoader";
import BaseModal from "../../BaseComponents/BaseModal";
import BaseInput from "../../BaseComponents/BaseInput";
import { RiEditFill, RiCheckLine, RiCloseLine, RiSearchLine } from "react-icons/ri";
import { Action, Back, notFound, Submit, Update } from "../../Constant";
import { Link, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import { hostelLabel } from "../../Constant/Hostel/hostel";
import { validationMessages } from "../../Constant/validation";
import { hostelEdit, hostelStatusEdit, viewHostel } from "../../Api/hostel";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import moment from "moment";

const ViewHostel = () => {
  const [loader, setLoader] = useState(false);
  const [viewData, setViewData] = useState([]);
  const [customPageSize, setCustomPageSize] = useState(50);
  const [hostelModal, setHostelModal] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [statusData, setStatusData] = useState();
  const [editData, setEditData] = useState();
  const [btnLoader, setBtnLoader] = useState(false);
  const [rowId, setRowId] = useState(null);
  const [statusId, setStatusId] = useState(null);
  const [monthName, setMonthName] = useState(null);
  const [pageSize, setPageSize] = useState(customPageSize);
  const { hostelId } = useParams();

  const fetchData = () => {
    setLoader(true);
    viewHostel(hostelId)
      .then((response) => {
        if (
          response?.statusCode === StatusCodes.ACCEPTED ||
          response?.statusCode === StatusCodes.OK ||
          response?.statusCode === StatusCodes.CREATED
        ) {
          setViewData(response?.data);
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
  }, []);

  const validationSchema = yup.object({
    batchId: yup
      .string()
      .required(validationMessages.required(hostelLabel.batchId)),
    invoiceNo: yup
      .string()
      .required(validationMessages.required(hostelLabel.invoiceNo)),
    month: yup
      .string()
      .required(validationMessages.required(hostelLabel.month)),
    projectValued: yup
      .string()
      .required(validationMessages.required(hostelLabel.projectValued)),
    days: yup.string().required(validationMessages.required(hostelLabel.days)),
    fromDate: yup
      .string()
      .required(validationMessages.required(hostelLabel.fromDate)),
    toDate: yup
      .string()
      .required(validationMessages.required(hostelLabel.toDate)),
    claimedBill: yup
      .string()
      .required(validationMessages.required(hostelLabel.claimedBill)),
    received: yup
      .string()
      .required(validationMessages.required(hostelLabel.received)),
  });
  const hostelForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      batchId: isEditMode
        ? viewData?.batch?.batch_id
        : viewData?.batch?.batch_id,
      days: isEditMode ? statusData?.days : editData?.days,
      fromDate: isEditMode ? statusData?.from_date : editData?.from_date,
      toDate: isEditMode ? statusData?.to_date : editData?.to_date,
      projectValued: isEditMode
        ? statusData?.projection_valued
        : editData?.projection_valued,
      month: isEditMode ? statusData?.month_sr_no : editData?.month_sr_no,
      invoiceNo: "",
      claimedBill: "",
      received: "",
      status: "",
      remarks: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      setBtnLoader(true);
      let payload = {
        bill_invoice_no: values.invoiceNo,
        month: values.month,
        claimed_bill: values.claimedBill,
        projection_valued: values.projectValued,
        received: values.received,
      };
      if (isEditMode) {
        payload = {
          ...payload,
          status: hostelLabel.reject,
          remarks: values.remarks,
        };
      }
      if (isEditMode) {
        hostelStatusEdit(rowId, payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp?.message);
              fetchData();
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.resp?.data?.message || err?.message);
          })
          .finally(() => {
            resetForm();
            setBtnLoader(false);
            setHostelModal(false);
            setRowId(null);
          });
      } else {
        // Add new hostel details
        hostelEdit(rowId, payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp.message);
              fetchData();
            } else {
              toast.error(resp.message);
            }
          })
          .catch((err) => {
            toast.error(err?.resp?.data?.message || err?.message);
          })
          .finally(() => {
            resetForm();
            setBtnLoader(false);
            setHostelModal(false);
            setRowId(null);
          });
      }
    },
  });

  const approveBill = (id) => {
    setStatusId(id);
    setApproveModal(true);
  };

  const handleApprove = () => {
    setBtnLoader(true);
    const payload = {
      status: hostelLabel.approve,
    };
    hostelStatusEdit(statusId, payload)
      .then((response) => {
        if (
          response?.statusCode === StatusCodes.ACCEPTED ||
          response?.statusCode === StatusCodes.OK ||
          response?.statusCode === StatusCodes.CREATED
        ) {
          toast.success(response?.message);
          fetchData();
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
        setStatusId(null);
      });
  };

  const rejectStatus = (row) => {
    setStatusData(row);
    setRowId(row?.id);
    setMonthName(row?.month_sr_no);
    setHostelModal(true);
    setIsEditMode(true);
  };

  const editHostel = (row) => {
    setEditData(row);
    setRowId(row.id);
    setHostelModal(true);
    setIsEditMode(false);
  };

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "month_sr_no",
        enableColumnFilter: false,
      },
      {
        header: hostelLabel.fromDate,
        accessorKey: "from_date",
        enableColumnFilter: false,
      },
      {
        header: hostelLabel.toDate,
        accessorKey: "to_date",
        enableColumnFilter: false,
      },
      {
        header: hostelLabel.days,
        accessorKey: "days",
        enableColumnFilter: false,
      },
      {
        header: hostelLabel.projectValued,
        accessorKey: "projection_valued",
        enableColumnFilter: false,
      },
      {
        header: hostelLabel.submissionDate,
        accessorKey: "submission_date",
        enableColumnFilter: false,
        cell: (cell) =>
          moment(cell?.row?.original?.submission_date).format("YYYY-MM-DD"),
      },
      {
        header: hostelLabel.claimedBill,
        accessorKey: "claimed_bill",
        enableColumnFilter: false,
      },
      {
        header: hostelLabel.received,
        accessorKey: "received",
        enableColumnFilter: false,
      },
      {
        header: hostelLabel.invoiceNo,
        accessorKey: "bill_invoice_no",
        enableColumnFilter: false,
      },
      {
        header: hostelLabel.status,
        accessorKey: "status",
        enableColumnFilter: false,
      },
      {
        header: Action,
        accessorKey: "action",
        enableSorting: false,
        cell: (cell) => {
          const { status } = cell.row.original;
          const isActionDisabled =
            status === hostelLabel.approve || status === hostelLabel.reject;

          return (
            <div className="d-flex justify-content-center icon">
              <span>
                <RiEditFill
                  className={`fs-5 mx-2 ${
                    isActionDisabled ? "text-muted" : "text-primary"
                  }`}
                  onClick={() =>
                    !isActionDisabled && editHostel(cell.row.original)
                  }
                  title="Edit"
                />
              </span>
              <span>
                <RiCheckLine
                  className={`fs-5 mx-2 ${
                    isActionDisabled ? "text-muted" : "text-success"
                  }`}
                  onClick={() =>
                    !isActionDisabled && approveBill(cell?.row?.original?.id)
                  }
                  title="Approve"
                />
              </span>
              <span>
                <RiCloseLine
                  className={`fs-5 mx-2 ${
                    isActionDisabled ? "text-muted" : "text-danger"
                  }`}
                  onClick={() =>
                    !isActionDisabled && rejectStatus(cell?.row?.original)
                  }
                  title="Reject"
                />
              </span>
            </div>
          );
        },
        enableColumnFilter: false,
      },
    ],
    []
  );

  return (
    <div className="page-body">
      <div className="container-fluid">
        <div className="page-header dash-breadcrumb py-3">
          <div className="row">
            <div className="col-6">
              <h3 className="f-w-600">{hostelLabel.hostelDetails}</h3>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <Link to="/hostel" className="btn btn-pill btn-primary mx-2">
                {Back}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="container-fluid">
            <h6 className="p-2 bg-light text-dark fs-6">
              {hostelLabel.centerDetails}
            </h6>
            <div className="row p-2">
              <div className="col-6">
                <label>{hostelLabel.centerName}</label>
                <span>{viewData?.center?.center_name}</span>
              </div>
              <div className="col-6">
                <label>{hostelLabel.batchName}</label>
                <span>{viewData?.batch?.batch_id}</span>
              </div>
              <div className="col-6">
                <label>{hostelLabel.BatchStartDate}</label>
                <span>{viewData?.batch_start_date}</span>
              </div>
              <div className="col-6">
                <label>{hostelLabel.BatchEndDate}</label>
                <span>{viewData?.batch_end_date}</span>
              </div>
              <div className="col-6">
                <label>{hostelLabel.courseName}</label>
                <span>{viewData?.course?.course_name}</span>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <h6 className="section-title p-2 bg-light text-dark fs-6">
              {hostelLabel.hostelDetails}
            </h6>
            <div className="card mx-3">
              <div className="card-body text-center">
                {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
                {!loader &&
                  viewData?.hostelDetails &&
                  viewData?.hostelDetails?.length > 0 && (
                    <TableContainer
                      fetchData={false}
                      columns={columns}
                      customPageSize={customPageSize}
                      data={viewData?.hostelDetails || []}
                      tableClass="table text-center"
                      fetchSortingData={false}
                      pageSize={pageSize}
                      setPageSize={setPageSize}
                      setCustomPageSize={setCustomPageSize}
                      hasManualPagination={false}
                    />
                  )}
                {!loader &&
                  (!viewData || viewData?.hostelDetails?.length === 0) && (
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
          <BaseModal
            isOpen={approveModal}
            toggler={() => setApproveModal(false)}
            title={hostelLabel.approveBill}
            disabled={btnLoader}
            loader={btnLoader}
            submitText={hostelLabel.yes}
            submit={handleApprove}
          >
            <div className="text-center">
              <p>{hostelLabel.billApprove}</p>
            </div>
          </BaseModal>
          <BaseModal
            isOpen={hostelModal}
            toggler={() => setHostelModal(false)}
            title={isEditMode ? `${monthName} Edit` : hostelLabel.addHostelDlt}
            submitText={isEditMode ? Update : Submit}
            disabled={btnLoader}
            loader={btnLoader}
            submit={hostelForm.handleSubmit}
            size="lg"
          >
            <div className="container-fluid">
              <div className="row">
                {/* First row: batchId, month, days */}
                <div className="col-lg-4">
                  <BaseInput
                    label={hostelLabel.batchId}
                    type="text"
                    name="batchId"
                    className="form-control"
                    readOnly
                    disabled={true}
                    placeholder={PlaceHolderFormat(hostelLabel.batchId)}
                    value={hostelForm.values.batchId}
                    touched={hostelForm.touched.batchId}
                    error={hostelForm.errors.batchId}
                    handleBlur={hostelForm.handleBlur}
                    handleChange={hostelForm.handleChange}
                  />
                </div>
                <div className="col-lg-4">
                  <BaseInput
                    label={hostelLabel.month}
                    type="text"
                    name="month"
                    className="form-control"
                    readOnly
                    disabled={true}
                    placeholder={PlaceHolderFormat(hostelLabel.month)}
                    value={hostelForm.values.month}
                    touched={hostelForm.touched.month}
                    error={hostelForm.errors.month}
                    handleBlur={hostelForm.handleBlur}
                    handleChange={hostelForm.handleChange}
                  />
                </div>
                <div className="col-lg-4">
                  <BaseInput
                    label={hostelLabel.days}
                    type="number"
                    name="days"
                    className="form-control"
                    readOnly
                    disabled={true}
                    placeholder={PlaceHolderFormat(hostelLabel.days)}
                    value={hostelForm.values.days}
                    touched={hostelForm.touched.days}
                    error={hostelForm.errors.days}
                    handleBlur={hostelForm.handleBlur}
                    handleChange={hostelForm.handleChange}
                  />
                </div>
              </div>
              {/* Second row: projectValued, fromDate, toDate */}
              <div className="row">
                <div className="col-lg-4">
                  <BaseInput
                    label={hostelLabel.fromDate}
                    type="date"
                    name="fromDate"
                    className="form-control"
                    readOnly
                    disabled={true}
                    placeholder={PlaceHolderFormat(hostelLabel.fromDate)}
                    value={hostelForm.values.fromDate}
                    touched={hostelForm.touched.fromDate}
                    error={hostelForm.errors.fromDate}
                    handleBlur={hostelForm.handleBlur}
                    handleChange={hostelForm.handleChange}
                  />
                </div>
                <div className="col-lg-4">
                  <BaseInput
                    label={hostelLabel.toDate}
                    type="date"
                    name="toDate"
                    className="form-control"
                    readOnly
                    disabled={true}
                    placeholder={PlaceHolderFormat(hostelLabel.toDate)}
                    value={hostelForm.values.toDate}
                    touched={hostelForm.touched.toDate}
                    error={hostelForm.errors.toDate}
                    handleBlur={hostelForm.handleBlur}
                    handleChange={hostelForm.handleChange}
                  />
                </div>
                <div className="col-lg-4">
                  <BaseInput
                    label={hostelLabel.projectValued}
                    type="number"
                    name="projectValued"
                    className="form-control"
                    placeholder={PlaceHolderFormat(hostelLabel.projectValued)}
                    value={hostelForm.values.projectValued}
                    touched={hostelForm.touched.projectValued}
                    error={hostelForm.errors.projectValued}
                    handleBlur={hostelForm.handleBlur}
                    handleChange={hostelForm.handleChange}
                  />
                </div>
              </div>
              <div className="custome-hr my-3"></div>
              {/* Third row: invoiceNo, claimedBill, received */}
              <div className="row">
                <div className="col-lg-4">
                  <BaseInput
                    label={hostelLabel.invoiceNo}
                    type="text"
                    name="invoiceNo"
                    className="form-control"
                    placeholder={PlaceHolderFormat(hostelLabel.invoiceNo)}
                    value={hostelForm.values.invoiceNo}
                    touched={hostelForm.touched.invoiceNo}
                    error={hostelForm.errors.invoiceNo}
                    handleBlur={hostelForm.handleBlur}
                    handleChange={hostelForm.handleChange}
                  />
                </div>
                <div className="col-lg-4">
                  <BaseInput
                    label={hostelLabel.claimedBill}
                    type="number"
                    name="claimedBill"
                    className="form-control"
                    placeholder={PlaceHolderFormat(hostelLabel.claimedBill)}
                    value={hostelForm.values.claimedBill}
                    touched={hostelForm.touched.claimedBill}
                    error={hostelForm.errors.claimedBill}
                    handleBlur={hostelForm.handleBlur}
                    handleChange={hostelForm.handleChange}
                  />
                </div>
                <div className="col-lg-4">
                  <BaseInput
                    label={hostelLabel.received}
                    type="number"
                    name="received"
                    className="form-control"
                    placeholder={PlaceHolderFormat(hostelLabel.received)}
                    value={hostelForm.values.received}
                    touched={hostelForm.touched.received}
                    error={hostelForm.errors.received}
                    handleBlur={hostelForm.handleBlur}
                    handleChange={hostelForm.handleChange}
                  />
                </div>
              </div>

              {/* Fourth row (conditionally rendered if isEditMode is true): remarks and status */}
              {isEditMode && (
                <div className="row">
                  <div className="col-lg-4">
                    <BaseInput
                      label={hostelLabel.remarks}
                      type="textarea"
                      name="remarks"
                      className="form-control"
                      placeholder={PlaceHolderFormat(hostelLabel.remarks)}
                      value={hostelForm.values.remarks}
                      touched={hostelForm.touched.remarks}
                      error={hostelForm.errors.remarks}
                      handleBlur={hostelForm.handleBlur}
                      handleChange={hostelForm.handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </BaseModal>
        </div>
      </div>
    </div>
  );
};

export default ViewHostel;
