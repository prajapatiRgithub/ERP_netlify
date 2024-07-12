import React, { useEffect, useMemo, useState } from "react";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseModal from "../../BaseComponents/BaseModal";
import BaseButton from "../../BaseComponents/BaseButton/index";
import TableContainer from "../../BaseComponents/BaseTable";
import { RiEditFill, RiEyeFill, RiSearchLine } from "react-icons/ri";
import { Action, Loading, Search, Submit, notFound } from "../../Constant";
import Spinner from "../../BaseComponents/BaseLoader/index";
import * as yup from "yup";
import { useFormik } from "formik";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import { SrNo } from "../../Constant/Center";
import {
  bankNumberRegex,
  emailRegex,
  GSTINRegex,
  numberRegex,
  validationMessages,
} from "../../Constant/validation";
import { vendorLable, vendorViewLable } from "../../Constant/Vendor/vendor";
import {
  addVendorApi,
  editVendor,
  listOfVendor,
  viewVendor,
} from "../../Api/VendorApi";
import { handleEditClick } from "../../Constant/common";
import { vendorTitle } from "../../Constant/title";
const Vendor = () => {
  document.title = vendorTitle;
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [vendorData, setVendorData] = useState();
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  const editVendorData = (id) => {
    setEditId(id);
    fetchData(id);
  };
  const viewVendorData = (id) => {
    if (id) {
      fetchVendorData(id);
    }
    setModalOpen(!modalOpen);
  };

  const fetchVendorData = (id) => {
    setLoader(true);
    viewVendor(id)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setSelectedVendor(resp?.data);
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

  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  const fetchData = async (id) => {
    setLoader(true);
    const payload = {
      order: [columnName, sortOrder],
      condition: {
        id: id,
      },
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    const vdrPayload = {
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    listOfVendor(id !== null ? payload : vdrPayload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          if (id !== null) {
            setEditData(resp?.data?.listOfVendor[0]);
          } else {
            setVendorData(resp?.data?.listOfVendor);
            setTotalRecords(resp.data.totalRecordsCount);
            setTotalPages(resp?.data?.totalPages);
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

  const vendorForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      vendor_name: editId !== null ? editData?.vendor_name : "",
      mobile_no: editId !== null ? editData?.contact_no : "",
      email_id: editId !== null ? editData?.email : "",
      bank_name: editId !== null ? editData?.bank_name : "",
      bank_branch_name: editId !== null ? editData?.bank_branch : "",
      bank_ifsc_code: editId !== null ? editData?.IFSC_code : "",
      bank_account_number: editId !== null ? editData?.account_no : "",
      gstin: editId !== null ? editData?.GSTIN_no : "",
    },
    validationSchema: yup.object({
      vendor_name: yup
        .string()
        .required(validationMessages.required(vendorLable.vendorName)),
      mobile_no: yup
        .string()
        .required(validationMessages.required(vendorLable.mobileNoValidation))
        .matches(
          numberRegex,
          validationMessages.contactLength(vendorLable.mobileNoValidation, 10)
        ),
      email_id: yup
        .string()
        .required(validationMessages.required(vendorLable.email))
        .matches(
          emailRegex,
          validationMessages.format(vendorLable.emailValidation)
        ),
      bank_name: yup
        .string()
        .required(validationMessages.required(vendorLable.bankName)),
      bank_branch_name: yup
        .string()
        .required(validationMessages.required(vendorLable.bankBranchName)),
      bank_ifsc_code: yup
        .string()
        .required(validationMessages.required(vendorLable.bankIfscCode)),
      bank_account_number: yup
        .string()
        .required(validationMessages.required(vendorLable.bankAccountNumber))
        .min(8, validationMessages.minLength(vendorLable.bankAccountNumber, 8))
        .max(
          17,
          validationMessages.maxLength(vendorLable.bankAccountNumber, 17)
        )
        .matches(
          bankNumberRegex,
          validationMessages.format(vendorLable.bankAccountNumberValidation)
        ),
      gstin: yup
        .string()
        .matches(
          GSTINRegex,
          validationMessages.format(vendorLable.GSTINNumberValidation)
        ),
    }),
    onSubmit: (values) => {
      setBtnLoader(true);
      const payload = {
        vendor_name: values.vendor_name,
        contact_no: values.mobile_no,
        email: values.email_id,
        GSTIN_no: values.gstin,
        account_no: values.bank_account_number,
        IFSC_code: values.bank_ifsc_code,
        bank_branch: values.bank_branch_name,
        bank_name: values.bank_name,
      };

      if (editId !== null) {
        editVendor(editId, payload)
          .then((resp) => {
            if (
              resp.statusCode === StatusCodes.ACCEPTED ||
              resp.statusCode === StatusCodes.OK ||
              resp.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp.message);
              fetchData(null);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
          })
          .finally(() => {
            setEditId(null);
            setBtnLoader(false);
            vendorForm.resetForm();
          });
      } else {
        addVendorApi(payload)
          .then((resp) => {
            if (
              resp.statusCode === StatusCodes.ACCEPTED ||
              resp.statusCode === StatusCodes.OK ||
              resp.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp?.message);
              fetchData(null);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
          })
          .finally(() => {
            setBtnLoader(false);
            vendorForm.resetForm();
          });
      }
    },
  });

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
        header: vendorLable.vendorName,
        accessorKey: "vendor_name",
        enableColumnFilter: false,
      },
      {
        header: vendorLable.mobileNo,
        accessorKey: "contact_no",
        enableColumnFilter: false,
      },
      {
        header: vendorLable.bankName,
        accessorKey: "bank_name",
        enableColumnFilter: false,
      },
      {
        header: vendorLable.bankBranchName,
        accessorKey: "bank_branch",
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
                  editVendorData(cell?.row?.original?.id);
                  handleEditClick();
                }}
                title="Edit"
              />
            </span>
            <span>
              <RiEyeFill
                className="fs-5 text-success mx-2"
                onClick={() => viewVendorData(cell?.row?.original?.id)}
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

  useEffect(() => {
    fetchData(null);
  }, [currentPage, customPageSize, columnName, sortOrder]);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="px-3">
        <h5 className="f-w-600">{vendorLable.vendor}</h5>
      </div>
      <div className="card p-4 rounded mb-0 mx-3">
        <form onSubmit={vendorForm.handleSubmit}>
          <div className="row">
            <div className="col-lg-12 row">
              <div className="col-lg-3">
                <BaseInput
                  name="vendor_name"
                  type="text"
                  label={vendorLable.vendorName}
                  placeholder={PlaceHolderFormat(vendorLable.vendorName)}
                  value={vendorForm.values.vendor_name}
                  touched={vendorForm.touched.vendor_name}
                  error={vendorForm.errors.vendor_name}
                  handleBlur={vendorForm.handleBlur}
                  handleChange={vendorForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="mobile_no"
                  type="text"
                  label={vendorLable.mobileNo}
                  placeholder={PlaceHolderFormat(vendorLable.mobileNo)}
                  value={vendorForm.values.mobile_no}
                  touched={vendorForm.touched.mobile_no}
                  error={vendorForm.errors.mobile_no}
                  handleBlur={vendorForm.handleBlur}
                  handleChange={(e) => {
                    if (
                      e?.target?.value?.length <= 10 &&
                      /^\d*$/.test(e.target.value)
                    ) {
                      vendorForm.handleChange(e);
                    }
                  }}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="email_id"
                  type="text"
                  label={vendorLable.email}
                  placeholder={PlaceHolderFormat(vendorLable.email)}
                  value={vendorForm.values.email_id}
                  touched={vendorForm.touched.email_id}
                  error={vendorForm.errors.email_id}
                  handleBlur={vendorForm.handleBlur}
                  handleChange={vendorForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="bank_name"
                  type="text"
                  label={vendorLable.bankName}
                  placeholder={PlaceHolderFormat(vendorLable.bankName)}
                  value={vendorForm.values.bank_name}
                  touched={vendorForm.touched.bank_name}
                  error={vendorForm.errors.bank_name}
                  handleBlur={vendorForm.handleBlur}
                  handleChange={vendorForm.handleChange}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 row">
              <div className="col-lg-3">
                <BaseInput
                  type="text"
                  name="bank_branch_name"
                  label={vendorLable.bankBranchName}
                  rows={2}
                  placeholder={PlaceHolderFormat(vendorLable.bankBranchName)}
                  value={vendorForm.values.bank_branch_name}
                  touched={vendorForm.touched.bank_branch_name}
                  error={vendorForm.errors.bank_branch_name}
                  handleBlur={vendorForm.handleBlur}
                  handleChange={vendorForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="bank_ifsc_code"
                  type="text"
                  label={vendorLable.bankIfscCode}
                  placeholder={PlaceHolderFormat(vendorLable.bankIfscCode)}
                  value={vendorForm.values.bank_ifsc_code}
                  touched={vendorForm.touched.bank_ifsc_code}
                  error={vendorForm.errors.bank_ifsc_code}
                  handleBlur={vendorForm.handleBlur}
                  handleChange={vendorForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="bank_account_number"
                  type="text"
                  label={vendorLable.bankAccountNumber}
                  placeholder={PlaceHolderFormat(vendorLable.bankAccountNumber)}
                  value={vendorForm.values.bank_account_number}
                  touched={vendorForm.touched.bank_account_number}
                  error={vendorForm.errors.bank_account_number}
                  handleBlur={vendorForm.handleBlur}
                  handleChange={vendorForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="gstin"
                  type="text"
                  label={vendorLable.GSTINNumber}
                  placeholder={PlaceHolderFormat(vendorLable.GSTINNumber)}
                  value={vendorForm.values.gstin}
                  touched={vendorForm.touched.gstin}
                  error={vendorForm.errors.gstin}
                  handleBlur={vendorForm.handleBlur}
                  handleChange={vendorForm.handleChange}
                />
              </div>
              <div className="col-lg-12 mt-3 d-flex justify-content-end align-items-end">
                <div className="">
                  <BaseButton
                    className="btn btn-pill"
                    type="submit"
                    disabled={btnLoader}
                    loader={btnLoader}
                    children={btnLoader ? Loading : Submit}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="col-6 py-2 px-3">
        <h5 className="f-w-600">{vendorLable.vendorList}</h5>
      </div>
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {vendorData && vendorData?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              fetchData={handleFetchData}
              columns={columns}
              data={searchValue ? [] : vendorData || []}
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
          {!loader && !vendorData && (
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
      {modalOpen && selectedVendor && (
        <BaseModal
          isOpen={modalOpen}
          title={vendorViewLable.details}
          hasSubmitButton={false}
          toggler={handleCloseModal}
        >
          <div className="list-group-flush">
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{vendorViewLable.vendorName}</span>
              <span class="col-6">{selectedVendor.vendor_name}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{vendorViewLable.BankName}</span>
              <span class="col-6">{selectedVendor.bank_name}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{vendorViewLable.bankAccountNumber}</span>
              <span class="col-6">{selectedVendor.account_no}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{vendorViewLable.bankBranchName}</span>
              <span class="col-6">{selectedVendor.bank_branch}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{vendorViewLable.bankIFSCCode}</span>
              <span class="col-6">{selectedVendor.IFSC_code}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{vendorViewLable.contactNumber}</span>
              <span class="col-6">{selectedVendor.contact_no}</span>
            </div>
            <div class="row my-2 pb-1 border-bottom">
              <span class="col-6">{vendorViewLable.emailAddress}</span>
              <span class="col-6">{selectedVendor.email || "--"}</span>
            </div>
            <div class="row my-2">
              <span class="col-6">{vendorViewLable.GSTINNo}</span>
              <span class="col-6">{selectedVendor.GSTIN_no || "--"}</span>
            </div>
          </div>
        </BaseModal>
      )}
    </>
  );
};

export default Vendor;
