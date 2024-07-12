import React, { useEffect, useMemo, useState } from "react";
import BaseModal from "../../BaseComponents/BaseModal/index";
import {
  RiSearchLine,
  RiEyeFill,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";
import { changeStatusApi, listBillApi, viewBillApi } from "../../Api/BillApi";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import {
  Amount,
  ApproveBillMsg,
  ApproveBillText,
  ApproveBy,
  BillApprovalText,
  BillText,
  CEOStatus,
  DepartementLevelStatus,
  RejectBillMsg,
  RejectBillText,
  Service,
  SubmittedBy,
  VendorName,
  ViewBillText,
} from "../../Constant/Bill";
import { SrNo } from "../../Constant/Center/index";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Action,
  Loading,
  Remarks,
  Search,
  Status,
  notFound,
} from "../../Constant/index";
import Spinner from "../../BaseComponents/BaseLoader";
import TableContainer from "../../BaseComponents/BaseTable";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import BaseInput from "../../BaseComponents/BaseInput";
import { Link } from "react-router-dom";
import { BaseImageURL } from "../../Api/Service";
import { billApprovalTitle } from "../../Constant/title";
import { validationMessages } from "../../Constant/validation";

const BillApproval = () => {
  document.title = billApprovalTitle;
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [modalLoader, setModalLoader] = useState(false);
  const [billList, setBillList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [approveId, setApproveId] = useState(null);
  const [rejectId, setRejectId] = useState(null);
  const [modal, setModal] = useState(false);
  const [modalApprove, setModalApprove] = useState(false);
  const [modalReject, setModalReject] = useState(false);
  const [viewBill, setViewBill] = useState(false);
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(null);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };
  const ViewBill = (id) => {
    setModalLoader(true);
    viewBillApi(id)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setViewBill(resp?.data);
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        return err;
      })
      .finally(() => {
        setModalLoader(false);
      });
  };

  const toggle = (id) => {
    setModal(!modal);
    if (id !== null) {
      ViewBill(id);
    }
  };
  const toggleApprove = (id) => {
    setRejectId(null);
    setApproveId(id);
    setModalApprove(!modalApprove);
  };
  const toggleReject = (id) => {
    setApproveId(null);
    setRejectId(id);
    setModalReject(!modalReject);
  };

  const fetchData = () => {
    setLoader(true);
    const payload = {
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    listBillApi(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setBillList(resp?.data?.listOfBill);
          setTotalRecords(resp.data.totalRecordsCount);
          setTotalPages(resp?.data?.totalPages);
          setTotalNumberOfRows(resp?.data?.numberOfRows);
          setCurrentPage(resp?.data?.currentPage);
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

  const columns = useMemo(
    () => [
      {
        header: SrNo,
        accessorKey: "serial_number",
        cell: (cell) =>
          cell.row.index +
          1 +
          cell.table.getState().pagination.pageIndex *
            cell.table.getState().pagination.pageSize,
        enableColumnFilter: false,
      },
      {
        header: Service,
        accessorKey: "service.service_name",
        enableColumnFilter: false,
      },
      {
        header: Amount,
        accessorKey: "amount",
        enableColumnFilter: false,
      },
      {
        header: ApproveBy,
        accessorKey: "approvedBy.name",
        enableColumnFilter: false,
      },
      {
        header: SubmittedBy,
        accessorKey: "submittedBy.name",
        enableColumnFilter: false,
      },
      {
        header: VendorName,
        accessorKey: "vendor.vendor_name",
        enableColumnFilter: false,
      },
      {
        header: Status,
        accessorKey: "approved_status",
        enableColumnFilter: false,
      },
      {
        header: Action,
        accessorKey: "action",
        enableSorting: true,
        cell: (cell) => {
          return (
            <div className="d-flex justify-content-center icon">
              <span>
                <RiCheckLine
                  className={`fs-5 text-primary mx-2 ${
                    cell?.row?.original?.approved_status !== "Pending"
                      ? `icon-disabled`
                      : ``
                  }`}
                  title={ApproveBillText}
                  onClick={() => {
                    toggleApprove(cell?.row?.original?.id);
                  }}
                />
              </span>
              <span>
                <RiCloseLine
                  className={`fs-5 text-danger mx-2 ${
                    cell?.row?.original?.approved_status !== "Pending"
                      ? `icon-disabled`
                      : ``
                  }`}
                  title={RejectBillText}
                  onClick={() => {
                    toggleReject(cell?.row?.original?.id);
                  }}
                />
              </span>
              <span>
                <RiEyeFill
                  className="fs-5 text-success mx-2"
                  onClick={() => toggle(cell?.row?.original?.id)}
                  title={ViewBillText}
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

  const billForm = useFormik({
    initialValues: {
      remarks: "",
    },
    validationSchema: yup.object({
      remarks: yup.string().required(validationMessages.required(Remarks)),
    }),
    onSubmit: async (values) => {
      setBtnLoader(true);
      const payload = {
        approvedStatus: approveId !== null ? true : false,
        reason: values.remarks,
      };

      if (approveId !== null) {
        changeStatusApi(approveId, payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              fetchData();
              toast.success(resp?.message);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
          })
          .finally(() => {
            setBtnLoader(false);
            setApproveId(null);
            toggleApprove();
            billForm.resetForm();
          });
      } else {
        changeStatusApi(rejectId, payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              fetchData();
              toast.success(resp?.message);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
          })
          .finally(() => {
            setBtnLoader(false);
            setApproveId(null);
            setRejectId(null);
            toggleReject();
            billForm.resetForm();
          });
      }
    },
  });

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, customPageSize, sortOrder, columnName]);

  return (
    <div className="container-fluid default-dash">
      <BaseModal
        isOpen={modalApprove}
        title="Approve Bill"
        toggler={toggleApprove}
        submit={() => billForm.handleSubmit()}
        submitText="Approve"
        disabled={btnLoader}
        loader={btnLoader}
      >
        <p>{ApproveBillMsg}</p>
        <BaseInput
          name="remarks"
          label={Remarks}
          placeholder={PlaceHolderFormat(Remarks)}
          type="textarea"
          value={billForm.values.remarks}
          touched={billForm.touched.remarks}
          error={billForm.errors.remarks}
          handleBlur={billForm.handleBlur}
          handleChange={billForm.handleChange}
        />
      </BaseModal>
      <BaseModal
        isOpen={modalReject}
        title="Reject Bill"
        toggler={toggleReject}
        submit={() => billForm.handleSubmit()}
        submitText="Reject"
        disabled={btnLoader}
        loader={btnLoader}
      >
        <p>{RejectBillMsg}</p>
        <BaseInput
          name="remarks"
          label={Remarks}
          placeholder={PlaceHolderFormat(Remarks)}
          type="textarea"
          value={billForm.values.remarks}
          touched={billForm.touched.remarks}
          error={billForm.errors.remarks}
          handleBlur={billForm.handleBlur}
          handleChange={billForm.handleChange}
        />
      </BaseModal>
      <BaseModal
        isOpen={modal}
        title="View Bill"
        hasSubmitButton={false}
        toggler={() => toggle(null)}
      >
        {modalLoader ? (
          Loading
        ) : (
          <>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{Service}:</span>
              <span class="col-6">{viewBill?.service_name}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{ApproveBy}:</span>
              <span class="col-6">{viewBill?.approved_by_name}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{Amount}:</span>
              <span class="col-6">{viewBill?.amount}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{SubmittedBy}:</span>
              <span class="col-6">{viewBill?.submitted_by_name}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{VendorName}:</span>
              <span class="col-6">{viewBill?.vendor_name}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{DepartementLevelStatus}:</span>
              <span class="col-6">{viewBill?.approved_status}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{CEOStatus}:</span>
              <span class="col-6">
                {viewBill?.CEO_approved ? "Completed" : "Pending"}
              </span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{Remarks}:</span>
              <span class="col-6">{viewBill?.remarks || "--"}</span>
            </div>
            <div class="row my-2">
              <span class="col-6">{BillText}:</span>
              <span class="col-6" title="Click to Open File">
                {viewBill?.upload_bill?.length > 0 && (
                  <span className="fw-normal text-dark">
                    <Link
                      target="_blank"
                      className="text-dark"
                      to={`${BaseImageURL}${viewBill?.upload_bill}`}
                    >
                      {ViewBillText}
                    </Link>
                  </span>
                )}
              </span>
            </div>
          </>
        )}
      </BaseModal>
      <div className="px-3">
        <h5 className="f-w-600">{BillApprovalText}</h5>
      </div>
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {!loader && billList?.length > 0 && (
            <TableContainer
              columns={columns}
              customPageSize={customPageSize}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              fetchData={handleFetchData}
              isGlobalFilter={true}
              setCustomPageSize={setCustomPageSize}
              SearchPlaceholder={Search}
              tableClass="table table-bordered"
              data={billList || []}
              manualPagination={true}
              fetchSortingData={handleFetchSorting}
            />
          )}
          {!loader && !billList && (
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

export default BillApproval;
