import React, { useState, useEffect, useMemo } from "react";
import TableContainer from "../../BaseComponents/BaseTable";
import { RiEditFill, RiEyeFill } from "react-icons/ri";
import { Action, Loading, Search, notFound } from "../../Constant";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import BaseModal from "../../BaseComponents/BaseModal";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseButton from "../../BaseComponents/BaseButton";
import Spinner from "../../BaseComponents/BaseLoader";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import { useFormik } from "formik";
import { ACCESSORS_KEYS, invEnums } from "../../Constant/Inventory/inventory";
import BaseSelect from "../../BaseComponents/BaseSelect";
import {
  SelectPlaceHolder,
  digitRegex,
  validationMessages,
} from "../../Constant/validation";
import { setInventoryIdInSessionStorage } from "../../Constant/common";
import { centerApi } from "../../Api/common";
import {
  inventoryAdd,
  inventoryEdit,
  listofInventory,
  listofStocktype,
} from "../../Api/inventory";
import { inventoryTitle } from "../../Constant/title";

const Inventory = () => {
  document.title = inventoryTitle;
  const navigate = useNavigate();
  const [btnLoader, setBtnLoader] = useState(false);
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [totalNumberOfRows, setTotalNumberOfRows] = useState();
  const [modal, setModal] = useState(false);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [inventoryList, setInventoryList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [centerList, setCenterList] = useState();
  const [stockList, setStockList] = useState();
  const [sortOrder, setSortOrder] = useState("desc");
  const [columnName, setColumnName] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const [center, setCenter] = useState("");
  const [stock, setStock] = useState();

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

  const toggle = (id) => {
    setModal(!modal);
  };

  const viewInventory = (invId) => {
    setInventoryIdInSessionStorage(invId);
    navigate(`/viewInventory/${invId}`);
  };
  const toggleAddEditModal = (row) => {
    setModal(!modal);
    setCenter(row?.center?.center_name);
    setStock(row?.stock?.stock_type);
    setEditId(row?.id);
  };

  const fetchInventory = () => {
    setLoader(true);
    const emptyPayload = {
      order: [columnName, sortOrder],
      pageSize: customPageSize,
      pageNumber: currentPage,
    };
    listofInventory(emptyPayload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setInventoryList(resp?.data?.listOfInventory);
          setTotalPages(resp?.data?.totalPages);
          setTotalRecords(resp?.data?.totalRecordsCount);
          setTotalNumberOfRows(resp?.data?.numberOfRows);
          setCurrentPage(resp?.data?.currentPage);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  useEffect(() => {
    fetchData(null);
    fetchStockData(null);
  }, [currentPage, customPageSize, columnName, sortOrder]);

  const fetchData = async (id) => {
    setLoader(true);
    let data;

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
  const fetchStockData = async () => {
    setLoader(true);
    let data;
    listofStocktype({})
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data.listOfStockType;
          setStockList(
            data?.map((item) => ({
              value: item?.id,
              label: item?.stock_type,
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

  const EditinventoryForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      center_name: center,
      stock_type: stock,
      damaged_quantity: "",
      remarks: "",
    },
    validationSchema: yup.object({
      center_name: yup
        .string()
        .required(validationMessages.required(invEnums.CENTER_NAME)),
      stock_type: yup
        .string()
        .required(validationMessages.required(invEnums.STOCK_TYPE)),
      damaged_quantity: yup
        .string()
        .matches(digitRegex, invEnums.INVALIDQUANTITY)
        .required(validationMessages.required(invEnums.QUANTITY)),
      remarks: yup
        .string()
        .required(validationMessages.required(invEnums.REMARKS)),
    }),
    onSubmit: (values) => {
      setBtnLoader(true);
      const payload = {
        damage_stock: parseInt(values.damaged_quantity),
        remarks: values.remarks,
      };
      inventoryEdit(editId, payload)
        .then((resp) => {
          if (
            resp?.statusCode === StatusCodes.ACCEPTED ||
            resp?.statusCode === StatusCodes.OK ||
            resp?.statusCode === StatusCodes.CREATED
          ) {
            toast.success(resp?.message);
            fetchInventory();
          } else {
            toast.error(resp?.message);
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || err.message);
        })
        .finally(() => {
          setBtnLoader(false);
          inventoryForm.resetForm();
          toggleAddEditModal(null);
        });
    },
  });

  const inventoryForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      center_name: "",
      stock_type: "",
      quantity: "",
      remarks: "",
    },
    validationSchema: yup.object({
      center_name: yup
        .string()
        .required(validationMessages.required(invEnums.CENTER_NAME)),
      stock_type: yup
        .string()
        .required(validationMessages.required(invEnums.STOCK_TYPE)),
      quantity: yup
        .string()
        .matches(digitRegex, invEnums.INVALIDQUANTITY)
        .required(validationMessages.required(invEnums.QUANTITY)),
      remarks: yup
        .string()
        .required(validationMessages.required(invEnums.REMARKS)),
    }),
    onSubmit: (values) => {
      setBtnLoader(true);
      const payload = {
        center_id: values?.center_name,
        stock_id: values?.stock_type,
        total_quantity: parseInt(values?.quantity),
        remarks: values?.remarks,
      };
      const apiCall = inventoryAdd(payload);
      apiCall
        .then((resp) => {
          if (
            resp?.statusCode === StatusCodes.ACCEPTED ||
            resp?.statusCode === StatusCodes.OK ||
            resp?.statusCode === StatusCodes.CREATED
          ) {
            toast.success(resp.message);
            fetchInventory();
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || err.message);
        })
        .finally(() => {
          setBtnLoader(false);
          inventoryForm.resetForm();
        });
    },
  });

  useEffect(() => {
    fetchInventory();
  }, [currentPage, customPageSize, columnName, sortOrder]);

  const columns = useMemo(
    () => [
      {
        header: invEnums.SR_NO,
        accessorKey: "id",
        cell: (cell) => cell.row.index + 1,
        enableColumnFilter: false,
      },
      {
        header: invEnums.CENTER_NAME,
        accessorKey: ACCESSORS_KEYS.CENTER_NAME,
        enableColumnFilter: false,
      },
      {
        header: invEnums.STOCK_TYPE,
        accessorKey: ACCESSORS_KEYS.STOCK_TYPE,
        enableColumnFilter: false,
      },
      {
        header: invEnums.TOTAL_QUANTITY,
        accessorKey: ACCESSORS_KEYS.TOTAL_QUANTITY,
        enableColumnFilter: false,
      },
      {
        header: invEnums.DAMAGED_QUANTITY,
        accessorKey: ACCESSORS_KEYS.DAMAGED_QUANTITY,
        enableColumnFilter: false,
      },
      {
        header: invEnums.REMAINING_QUNATITY,
        accessorKey: ACCESSORS_KEYS.REMAININGS_QUANTITY,
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
                onClick={() => toggleAddEditModal(cell.row.original)}
                title="Edit"
              />
            </span>
            <span>
              <RiEyeFill
                className="fs-5 text-success mx-2"
                onClick={() => viewInventory(cell?.row?.original?.id)}
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

  return (
    <>
      <div className="d-flex justify-content-between align-items-center w-full px-3">
        <h5 className="f-w-600">{invEnums.INVENTORY}</h5>
      </div>

      <BaseModal
        isOpen={modal}
        title={invEnums.MODEL_TITLE}
        toggler={toggle}
        size="md"
        submitText={invEnums.Add}
        submit={EditinventoryForm.handleSubmit}
        loader={btnLoader}
        disabled={btnLoader}
      >
        <div className="row">
          <div className="col-6">
            <BaseInput
              name="center_name"
              label={invEnums.CENTER_NAME}
              className="select-border"
              disabled={true}
              readOnly
              placeholder={SelectPlaceHolder(invEnums.CENTER_NAME)}
              handleChange={EditinventoryForm.handleChange}
              handleBlur={() =>
                EditinventoryForm.setFieldTouched(invEnums.CENTER_NAME, true)
              }
              value={EditinventoryForm.values?.center_name}
              touched={EditinventoryForm.touched?.center_name}
              error={EditinventoryForm.errors?.center_name}
            />
          </div>
          <div className="col-6">
            <BaseInput
              name="stock_type"
              label={invEnums.STOCK_TYPE}
              className="select-border"
              readOnly
              disabled={true}
              placeholder={SelectPlaceHolder(invEnums.STOCK_TYPE)}
              handleChange={EditinventoryForm.handleChange}
              handleBlur={EditinventoryForm.handleChange}
              value={EditinventoryForm.values.stock_type}
              touched={EditinventoryForm.touched.stock_type}
              error={EditinventoryForm.errors.stock_type}
            />
          </div>
          <div className="col-6">
            <BaseInput
              name="damaged_quantity"
              type="number"
              label={invEnums.DAMAGED_QUANTITY}
              placeholder={PlaceHolderFormat(invEnums.DAMAGED_QUANTITY)}
              value={EditinventoryForm.values.damaged_quantity}
              touched={EditinventoryForm.touched.damaged_quantity}
              error={EditinventoryForm.errors.damaged_quantity}
              handleBlur={EditinventoryForm.handleBlur}
              handleChange={EditinventoryForm.handleChange}
            />
          </div>
          <div className="col-6">
            <BaseInput
              name="remarks"
              type="textarea"
              label={invEnums.REMARKS}
              placeholder={PlaceHolderFormat(invEnums.REMARKS)}
              value={EditinventoryForm.values.remarks}
              touched={EditinventoryForm.touched.remarks}
              error={EditinventoryForm.errors.remarks}
              handleBlur={EditinventoryForm.handleBlur}
              handleChange={EditinventoryForm.handleChange}
            />
          </div>
        </div>
      </BaseModal>

      <div className="card p-4 rounded mb-0 mx-3">
        <form onSubmit={inventoryForm.handleSubmit}>
          <div className="row">
            <div className="col-lg-12 row">
              <div className="col-lg-3">
                <BaseSelect
                  name="center_name"
                  label={invEnums.CENTER_NAME}
                  className="select-border"
                  options={centerList}
                  placeholder={SelectPlaceHolder(invEnums.CENTER_NAME)}
                  handleChange={(field, value) => {
                    inventoryForm.setFieldValue(field, value);
                  }}
                  handleBlur={() =>
                    inventoryForm.setFieldTouched(invEnums.CENTER_NAME, true)
                  }
                  value={inventoryForm.values.center_name}
                  touched={inventoryForm.touched.center_name}
                  error={inventoryForm.errors.center_name}
                />
              </div>
              <div className="col-lg-3">
                <BaseSelect
                  name="stock_type"
                  label={invEnums.STOCK_TYPE}
                  className="select-border"
                  options={stockList}
                  placeholder={SelectPlaceHolder(invEnums.STOCK_TYPE)}
                  handleChange={(field, value) => {
                    inventoryForm.setFieldValue(field, value);
                  }}
                  handleBlur={() =>
                    inventoryForm.setFieldTouched(invEnums.STOCK_TYPE, true)
                  }
                  value={inventoryForm.values.stock_type}
                  touched={inventoryForm.touched.stock_type}
                  error={inventoryForm.errors.stock_type}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="quantity"
                  type="text"
                  label={invEnums.QUANTITY}
                  placeholder={PlaceHolderFormat(invEnums.QUANTITY)}
                  value={inventoryForm.values.quantity}
                  touched={inventoryForm.touched.quantity}
                  error={inventoryForm.errors.quantity}
                  handleBlur={inventoryForm.handleBlur}
                  handleChange={(e) => {
                    if (
                      e.target.value.length <= 10 &&
                      digitRegex.test(e.target.value)
                    ) {
                      inventoryForm.handleChange(e);
                    }
                  }}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="remarks"
                  type="textarea"
                  label={invEnums.REMARKS}
                  placeholder={PlaceHolderFormat(invEnums.REMARKS)}
                  value={inventoryForm.values.remarks}
                  touched={inventoryForm.touched.remarks}
                  error={inventoryForm.errors.remarks}
                  handleBlur={inventoryForm.handleBlur}
                  handleChange={inventoryForm.handleChange}
                />
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col text-end">
              <BaseButton
                className="btn btn-pill"
                type="submit"
                children={btnLoader ? Loading : invEnums.Add}
                loader={btnLoader}
                disabled={btnLoader}
              />
            </div>
          </div>
        </form>
      </div>
      <div className="col-6 py-2 px-3">
        <h5 className="f-w-600">{invEnums.INVENTORY_LIST}</h5>
      </div>
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {inventoryList && inventoryList?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              fetchData={handleFetchData}
              columns={columns}
              data={searchValue ? [] : inventoryList || []}
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
          {!loader && !inventoryList && (
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
  );
};

export default Inventory;
