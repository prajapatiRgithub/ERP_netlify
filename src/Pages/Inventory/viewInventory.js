import React, { useState, useEffect, useMemo } from "react";
import TableContainer from "../../BaseComponents/BaseTable";
import { Action, Back, Search, notFound } from "../../Constant";
import { StatusCodes } from "http-status-codes";
import Spinner from "../../BaseComponents/BaseLoader";
import { ACCESSORS_KEYS, invEnums } from "../../Constant/Inventory/inventory";
import { Link, useParams } from "react-router-dom";
import { DeleteInventoryHistory, viewInventory } from "../../Api/inventory";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import BaseModal from "../../BaseComponents/BaseModal";

const ViewInventory = () => {
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [totalNumberOfRows, setTotalNumberOfRows] = useState();
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [inventoryList, setInventoryList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [columnName, setColumnName] = useState("id");
  const { invId } = useParams();
  const [searchValue, setSearchValue] = useState("");
  const [inventoryHistory, setInventoryHistory] = useState();
  const [modal, setModal] = useState(false);

  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };

  const toggle = (id) => {
    setInventoryHistory(id);
    setModal(!modal);
  };

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  const deleteInventoryHistory = async () => {
    setDeleteLoader(true);
    await DeleteInventoryHistory(inventoryHistory)
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
        fetchInventory(null);
      });
  };

  const fetchInventory = () => {
    setLoader(true);
    const emptyPayload = {
      order: [columnName, sortOrder],
      pageSize: customPageSize,
      pageNumber: currentPage,
    };
    viewInventory(invId, emptyPayload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setInventoryList(resp?.data?.viewInventory);
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
        accessorKey: ACCESSORS_KEYS.CENTER_NAMES,
        enableColumnFilter: false,
      },
      {
        header: invEnums.STOCK_TYPE,
        accessorKey: ACCESSORS_KEYS.STOCK_TYPES,
        enableColumnFilter: false,
      },
      {
        header: invEnums.STATUS,
        accessorKey: ACCESSORS_KEYS.STATUS,
        enableColumnFilter: false,
      },
      {
        header: invEnums.QUANTITYDAMADD,
        accessorKey: ACCESSORS_KEYS.BALANCE,
        enableColumnFilter: false,
      },
      {
        header: invEnums.REMAINING_QUNATITY,
        accessorKey: ACCESSORS_KEYS.REMAINING_QUANTITY,
        enableColumnFilter: false,
      },
      {
        header: invEnums.DATE,
        accessorKey: ACCESSORS_KEYS.CREATED_AT,
        cell: (cell) => new Date(cell.getValue()).toLocaleDateString(),
        enableColumnFilter: false,
      },

      {
        header: Action,
        accessorKey: ACCESSORS_KEYS.ACTION,
        enableSorting: true,
        cell: (cell) => (
          <div className="d-flex justify-content-center icon">
            <span>
              <RiDeleteBin7Fill
                className={`fs-5 text-danger ${
                  cell?.row?.original?.status === "Pending"
                    ? `icon-disabled`
                    : ``
                }`}
                onClick={() => toggle(cell?.row?.original?.id)}
                disabled={
                  cell?.row?.original?.status === "Damaged" ? true : false
                }
                title={invEnums.DELETE}
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
      <div className="container-fluid">
        <div className="page-header dash-breadcrumb py-3">
          <div className="row">
            <div className="col-6">
              <h5 className="f-w-600">{invEnums.INVENTORY_DETAILS}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <Link to="/inventory" className="btn btn-pill btn-primary mx-2">
                {Back}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <BaseModal
        isOpen={modal}
        title="Delete"
        toggler={toggle}
        submit={() => deleteInventoryHistory()}
        submitText="Delete"
        disabled={deleteLoader}
        loader={deleteLoader}
      >
        {invEnums.DELETEMSG}
      </BaseModal>
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
              fetchSortingData={handleFetchSorting}
              SearchPlaceholder={Search}
            />
          )}
          {!inventoryList && (
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

export default ViewInventory;
