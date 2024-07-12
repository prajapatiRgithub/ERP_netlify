import React, { useState, useEffect, useMemo } from "react";
import TableContainer from "../../BaseComponents/BaseTable";
import { RiEditFill, RiDeleteBin7Fill, RiSearchLine } from "react-icons/ri";
import { Action, Search, notFound } from "../../Constant";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import BaseModal from "../../BaseComponents/BaseModal";
import * as yup from "yup";
import { stockEnums } from "../../Constant/Stock/stock";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseButton from "../../BaseComponents/BaseButton";
import Spinner from "../../BaseComponents/BaseLoader";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import { useFormik } from "formik";
import { addStock, deleteStock, editStock, listStock } from "../../Api/Stock";
import { stockTitle } from "../../Constant/title";
import { validationMessages } from "../../Constant/validation";

const StockList = () => {
  document.title = stockTitle;
  const [addEditModal, setAddEditModal] = useState(false);
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [totalNumberOfRows, setTotalNumberOfRows] = useState();
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [stockId, setStockId] = useState();
  const [modal, setModal] = useState(false);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [stockList, setStockList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [editData, setEditData] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [columnName, setColumnName] = useState("id");

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  const toggle = (id) => {
    setStockId(id);
    setModal(!modal);
  };

  const toggleAddEditModal = (id) => {
    setEditId(id);
    setAddEditModal(!addEditModal);
    if (id) {
      fetchEditData(id);
    } else {
      setEditData(null);
    }
  };

  const fetchStocks = () => {
    setLoader(true);
    const emptyPayload = {
      order: [columnName, sortOrder],
      pageSize: customPageSize,
      pageNumber: currentPage,
    };
    listStock(emptyPayload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setStockList(resp?.data?.listOfStockType);
          setTotalPages(resp?.data?.totalPages);
          setTotalRecords(resp?.data?.totalRecordsCount);
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

  const fetchEditData = (id) => {
    const stock = stockList?.find((item) => item.id === id);
    setEditData(stock);
    setAddEditModal(true);
  };

  const stockDelete = () => {
    setDeleteLoader(true);
    deleteStock(stockId)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          toast.success(resp?.message);
          fetchStocks();
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || err.message);
      })
      .finally(() => {
        setDeleteLoader(false);
        toggle();
      });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      stock_type: editId ? editData?.stock_type : "",
    },
    validationSchema: yup.object({
      stock_type: yup
        .string()
        .required(validationMessages.required(stockEnums.STOCK)),
    }),
    onSubmit: (values) => {
      setBtnLoader(true);
      const payload = { stock_type: values?.stock_type };
      const apiCall = editId ? editStock(editId, payload) : addStock(payload);

      apiCall
        .then((resp) => {
          if (
            resp?.statusCode === StatusCodes.ACCEPTED ||
            resp?.statusCode === StatusCodes.OK ||
            resp?.statusCode === StatusCodes.CREATED
          ) {
            toast.success(resp?.message);
            fetchStocks();
          } else {
            toast.error(resp?.message);
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || err.message);
        })
        .finally(() => {
          setBtnLoader(false);
          formik.resetForm();
          toggleAddEditModal(null);
        });
    },
  });

  useEffect(() => {
    fetchStocks();
  }, [currentPage, customPageSize, columnName, sortOrder]);

  useEffect(() => {
    if (editId && !editData) {
      fetchEditData(editId);
    }
  }, [editId]);

  const columns = useMemo(
    () => [
      {
        header: stockEnums.SrNo,
        accessorKey: "id",
        cell: (cell) => cell.row.index + 1,
        enableColumnFilter: false,
      },
      {
        header: stockEnums.STOCK,
        accessorKey: "stock_type",
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
                onClick={() => toggleAddEditModal(cell.row.original.id)}
                title={stockEnums.EDIT}
              />
            </span>
            <span>
              <RiDeleteBin7Fill
                className={`fs-5 text-danger`}
                onClick={() => toggle(cell.row.original.id)}
                title={stockEnums.DELETE}
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
        <h5 className="f-w-600">{stockEnums.STOCK}</h5>
        <div className="col-sm-auto col-md-auto mb-2">
          <BaseButton
            className="btn btn-pill"
            type="submit"
            children={stockEnums.ADD_STOCK}
            onClick={() => toggleAddEditModal(null)}
          />
        </div>
      </div>

      <BaseModal
        isOpen={modal}
        title={stockEnums.DELETE}
        toggler={toggle}
        submit={stockDelete}
        submitText={stockEnums.DELETE}
        disabled={deleteLoader}
        loader={deleteLoader}
      >
        {stockEnums.DELETE_MESSAGE}
      </BaseModal>
      <BaseModal
        isOpen={addEditModal}
        title={editId ? stockEnums.EDIT_STOCK : stockEnums.ADD_STOCK}
        toggler={() => toggleAddEditModal(null)}
        submit={formik.handleSubmit}
        submitText={editId ? stockEnums.UPDATE : stockEnums.ADD}
        disabled={btnLoader}
        loader={btnLoader}
      >
        <form onSubmit={formik.handleSubmit}>
          <BaseInput
            label={stockEnums.STOCK_TYPE}
            name="stock_type"
            type="text"
            placeholder={PlaceHolderFormat(stockEnums.STOCK_TYPE)}
            value={formik.values.stock_type}
            touched={formik.touched.stock_type}
            error={formik.errors.stock_type}
            handleBlur={formik.handleBlur}
            handleChange={formik.handleChange}
          />
        </form>
      </BaseModal>

      <div className="col-6 py-2 px-3"></div>
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {stockList && stockList?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              fetchData={handleFetchData}
              columns={columns}
              data={stockList || []}
              isGlobalFilter={true}
              customPageSize={customPageSize}
              setCustomPageSize={setCustomPageSize}
              manualPagination={true}
              tableClass="table table-bordered text-center"
              fetchSortingData={handleFetchSorting}
              SearchPlaceholder={Search}
            />
          )}
          {!stockList && (
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
    </>
  );
};

export default StockList;
