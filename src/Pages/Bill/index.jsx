import React, { useEffect, useMemo, useRef, useState } from "react";
import BaseSelect from "../../BaseComponents/BaseSelect/index";
import BaseInput from "../../BaseComponents/BaseInput/index";
import BaseButton from "../../BaseComponents/BaseButton/index";
import BaseModal from "../../BaseComponents/BaseModal/index";
import {
  SelectPlaceHolder,
  validationMessages,
} from "../../Constant/validation";
import {
  RiSearchLine,
  RiEyeFill,
  RiEditFill,
  RiCloseCircleLine,
} from "react-icons/ri";
import {
  addBillApi,
  editBillApi,
  listBillApi,
  listServiceApi,
  listUsersApi,
  listVendorNameApi,
  viewBillApi,
  viewVendorNameApi,
} from "../../Api/BillApi";
import { fileUploadApi } from "../../Api/common";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import {
  Amount,
  ApproveBy,
  BillAllowed,
  BillList,
  BillText,
  BillTitle,
  CEOStatus,
  DepartementLevelStatus,
  EditBillText,
  Service,
  SubmittedBy,
  UploadBill,
  VendorDetails,
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
  Submit,
  Update,
  notFound,
} from "../../Constant/index";
import Spinner from "../../BaseComponents/BaseLoader";
import TableContainer from "../../BaseComponents/BaseTable";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { vendorLable } from "../../Constant/Vendor/vendor";
import { BaseImageURL } from "../../Api/Service";
import { billTitle } from "../../Constant/title";

const Bill = () => {
  document.title = billTitle;
  let auth_id = sessionStorage.getItem("id");
  let ref = useRef();
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [modalLoader, setModalLoader] = useState(false);
  const [userList, setUserList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [billList, setBillList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [modal, setModal] = useState(false);
  const [viewBill, setViewBill] = useState(false);
  const [editBillData, setEditBillData] = useState(null);
  const [vendors, setVendors] = useState();
  const [editBillId, setEditBillId] = useState(null);
  const [viewVendorId, setViewVendorId] = useState(null);
  const [viewVendorState, setViewVendorState] = useState(false);
  const [viewVendor, setViewVendor] = useState(null);
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
  const editBill = (id) => {
    setEditBillId(id);
    setViewVendorId(id);
    setLoader(true);
    viewBillApi(id)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setEditBillData(resp?.data);
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

  const fetchService = () => {
    let data;
    setLoader(true);

    listServiceApi()
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data?.listOfService;
          setServiceList(
            data?.map((item) => ({
              value: item?.id,
              label: item?.service_name,
              id: item?.id,
            }))
          );
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

  const fetchVendor = () => {
    let data;
    setLoader(true);
    listVendorNameApi()
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setVendors(
            data?.map((item) => ({
              value: item?.id,
              label: item?.vendor_name,
              id: item?.id,
            }))
          );
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
  const fetchUsers = () => {
    let data;
    setLoader(true);
    listUsersApi()
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setUserList(
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
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  const fetchViewVendor = () => {
    setLoader(true);
    if (viewVendorId) {
      viewVendorNameApi(viewVendorId)
        .then((resp) => {
          if (
            resp?.statusCode === StatusCodes.ACCEPTED ||
            resp?.statusCode === StatusCodes.OK ||
            resp?.statusCode === StatusCodes.CREATED
          ) {
            setViewVendor(resp?.data);
            setViewVendorState(true);
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
    }
  };

  const toggle = (id) => {
    setModal(!modal);
    if (id !== null) {
      ViewBill(id);
    }
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
          cell.table.getSortedRowModel().flatRows.indexOf(cell.row) + 1,
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
        cell: (cell) => {
          return (
            <div className="d-flex justify-content-center icon">
              <span>
                <RiEditFill
                  className={`fs-5 text-primary mx-2 ${
                    cell?.row?.original?.approved_status === "Pending"
                      ? ""
                      : "icon-disabled"
                  } `}
                  onClick={() => {
                    editBill(cell?.row?.original?.id);
                  }}
                  title={EditBillText}
                />
              </span>
              <span>
                <RiEyeFill
                  className="fs-5 text-success"
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
    enableReinitialize: true,
    initialValues: {
      service: editBillId !== null ? editBillData?.service_id : "",
      approveBy: editBillId !== null ? editBillData?.approved_by_id : "",
      vendor: editBillId !== null ? editBillData?.vendor_id : "",
      amount: editBillId !== null ? editBillData?.amount : "",
      remarks: editBillId !== null ? editBillData?.remarks : "",
      bill: editBillId !== null ? editBillData?.upload_bill : "",
      submittedBy: editBillId !== null ? editBillData?.submitted_by_id : null,
    },
    validationSchema: yup.object({
      service: yup.string().required(validationMessages.required(Service)),
      approveBy: yup.string().required(validationMessages.required(ApproveBy)),
      vendor: yup.string().required(validationMessages.required(VendorName)),
      amount: yup.string().required(validationMessages.required(Amount)),
      bill: yup.string().required(validationMessages.required(UploadBill)),
      submittedBy: yup
        .string()
        .required(validationMessages.required(SubmittedBy)),
    }),
    onSubmit: async (values) => {
      setBtnLoader(true);
      const payload = {
        auth_id: parseInt(auth_id),
        service_id: values.service,
        amount: values.amount,
        approved_by_id: values.approveBy,
        submitted_by_id: values.submittedBy,
        vendor_id: values.vendor,
        remarks: values.remarks,
        upload_bill: values.bill,
      };

      if (editBillId !== null) {
        editBillApi(editBillId, payload)
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
            billForm.resetForm();
            setViewVendorState(false);
            handleChange(null);
            setEditBillId(null);
            setEditBillData(null);
          });
      } else {
        addBillApi(payload)
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
            billForm.resetForm();
            setViewVendorState(false);
            handleChange(null);
          });
      }
    },
  });

  const fileupload = (file) => {
    setLoader(true);
    const payload = new FormData();
    payload.append("files", file);
    fileUploadApi(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          billForm.setFieldValue("bill", resp?.data[0]);
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

  const handleChange = (e) => {
    const file = e?.target?.files[0];
    if (file) {
      fileupload(file);
    }
  };

  useEffect(() => {
    fetchData();
    fetchVendor();
    fetchService();
    fetchUsers();
    fetchViewVendor();
    billForm?.setFieldValue("submittedBy", parseInt(auth_id));
  }, [viewVendorId]);

  useEffect(() => {
    fetchData();
  }, [currentPage, customPageSize, columnName, sortOrder]);

  return (
    <div className="container-fluid default-dash">
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
      <div className="py-2">
        <h5 className="f-w-600">{BillTitle}</h5>
      </div>
      <div className="card p-4 rounded mb-0">
        <form onSubmit={billForm.handleSubmit}>
          <div className="row">
            <div className="d-flex justify-content-end">
              <span className="text-warning fw-normal">{BillAllowed}</span>
            </div>
            <div className="col-lg-12 row">
              <div className="col-lg-3">
                <BaseSelect
                  name="service"
                  label={Service}
                  options={serviceList}
                  placeholder={SelectPlaceHolder(Service)}
                  className="select-border"
                  handleChange={(field, value) => {
                    billForm.setFieldValue(field, value);
                  }}
                  handleBlur={() => billForm.setFieldTouched(Service, true)}
                  value={billForm.values.service}
                  touched={billForm.touched.service}
                  error={billForm.errors.service}
                />
              </div>
              <div className="col-lg-3">
                <BaseSelect
                  name="approveBy"
                  label={ApproveBy}
                  options={userList}
                  placeholder={SelectPlaceHolder(ApproveBy)}
                  className="select-border"
                  handleChange={(field, value) => {
                    billForm.setFieldValue(field, value);
                  }}
                  handleBlur={() => billForm.setFieldTouched(ApproveBy, true)}
                  value={billForm.values.approveBy}
                  touched={billForm.touched.approveBy}
                  error={billForm.errors.approveBy}
                />
              </div>
              <div className="col-lg-3">
                <BaseSelect
                  name="vendor"
                  label={VendorName}
                  options={vendors}
                  placeholder={SelectPlaceHolder(VendorName)}
                  className="select-border"
                  handleChange={(field, value) => {
                    billForm.setFieldValue(field, value);
                    setViewVendorId(value);
                  }}
                  handleBlur={() => billForm.setFieldTouched(VendorName, true)}
                  value={billForm.values.vendor}
                  touched={billForm.touched.vendor}
                  error={billForm.errors.vendor}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="amount"
                  label={Amount}
                  placeholder={PlaceHolderFormat(Amount)}
                  type="number"
                  value={billForm.values.amount}
                  touched={billForm.touched.amount}
                  error={billForm.errors.amount}
                  handleBlur={billForm.handleBlur}
                  handleChange={billForm.handleChange}
                />
              </div>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-lg-12 row">
              <div className="col-lg-3">
                <BaseInput
                  name="remarks"
                  label={Remarks}
                  placeholder={PlaceHolderFormat(Remarks)}
                  type="textarea"
                  value={billForm.values.remarks}
                  handleChange={billForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="bill"
                  label={UploadBill}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  ref={ref}
                  touched={billForm.touched.bill}
                  error={billForm.errors.bill}
                  handleChange={handleChange}
                />
                {billForm.values.bill?.length > 0 && (
                  <span className="fw-normal">
                    <Link
                      target="_blank"
                      className="text-dark"
                      to={`https://erp-be-dge5.onrender.com/uploads/${billForm.values.bill}`}
                    >
                      {ViewBillText}
                    </Link>
                  </span>
                )}
              </div>
              <div className="col-lg-3">
                <BaseSelect
                  name="submittedBy"
                  label={SubmittedBy}
                  options={userList}
                  placeholder={SelectPlaceHolder(SubmittedBy)}
                  className="select-border"
                  handleChange={(field, value) => {
                    billForm.setFieldValue(field, value);
                  }}
                  handleBlur={() => billForm.setFieldTouched(SubmittedBy, true)}
                  value={billForm.values.submittedBy}
                  touched={billForm.touched.submittedBy}
                  error={billForm.errors.submittedBy}
                />
              </div>
              <div className="col-lg-3 d-flex justify-content-end align-items-end">
                <div>
                  <BaseButton
                    className="btn btn-pill"
                    color="primary"
                    type="submit"
                    disabled={btnLoader}
                    children={
                      btnLoader
                        ? Loading
                        : editBillId !== null
                        ? Update
                        : Submit
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
        {viewVendorState && (
          <div className="d-block justify-content-between mt-4">
            <div className="d-flex justify-content-between">
              <h6 className="text-decoration-underline">{VendorDetails}</h6>
              <span
                onClick={() => setViewVendorState(false)}
                title="Close Vendor Details"
              >
                <RiCloseCircleLine className="fs-5" />
              </span>
            </div>
            <div className="card-body mx-4 px-4">
              <div class="row">
                <span class="col-6 col-md-2 border border-1 p-2">
                  {vendorLable?.vendorName}:
                </span>
                <span class="col-6 col-md-2 border border-1 p-2 fw-normal">
                  {viewVendor?.vendor_name}
                </span>
                <span class="col-6 col-md-2 border border-1 p-2">
                  {vendorLable?.mobileNo}:
                </span>
                <span class="col-6 col-md-2 border border-1 p-2 fw-normal">
                  {viewVendor?.contact_no}
                </span>
                <span class="col-6 col-md-2 border border-1 p-2">
                  {vendorLable?.bankName}:
                </span>
                <span class="col-6 col-md-2 border border-1 p-2 fw-normal">
                  {viewVendor?.bank_name}
                </span>
              </div>
              <div class="row">
                <span class="col-6 col-md-2 border border-1 p-2">
                  {vendorLable?.bankBranchName}:
                </span>
                <span class="col-6 col-md-2 border border-1 p-2 fw-normal">
                  {viewVendor?.bank_branch}
                </span>
                <span class="col-6 col-md-2 border border-1 p-2">
                  {vendorLable?.bankIfscCode}:
                </span>
                <span class="col-6 col-md-2 border border-1 p-2 fw-normal">
                  {viewVendor?.IFSC_code}
                </span>
                <span class="col-6 col-md-2 border border-1 p-2">
                  {vendorLable?.bankAccountNumber}:
                </span>
                <span class="col-6 col-md-2 border border-1 p-2 fw-normal">
                  {viewVendor?.account_no}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="py-2">
        <h5 className="f-w-600">{BillList}</h5>
      </div>
      <div className="card">
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
              tableClass="table table-bordered"
              data={billList || []}
              SearchPlaceholder={Search}
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

export default Bill;
