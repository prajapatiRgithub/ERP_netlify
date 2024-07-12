import React, { useState, useEffect, useMemo } from "react";
import TableContainer from "../../BaseComponents/BaseTable";
import { RiEditFill, RiDeleteBin7Fill, RiSearchLine } from "react-icons/ri";
import { Action, Search, notFound } from "../../Constant";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import BaseModal from "../../BaseComponents/BaseModal";
import * as yup from "yup";
import {
  addPositionApi,
  listOfPositionApi,
  editPositionApi,
  deletePositionApi,
} from "../../Api/positionApi";
import {
  SrNo,
  DeleteMessage,
  Position,
} from "../../Constant/Position/position";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseButton from "../../BaseComponents/BaseButton";
import Spinner from "../../BaseComponents/BaseLoader";
import { useFormik } from "formik";
import { positionTitle } from "../../Constant/title";
import { validationMessages } from "../../Constant/validation";

const PositionList = () => {
  document.title = positionTitle;
  const [addEditModal, setAddEditModal] = useState(false);
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [totalNumberOfRows, setTotalNumberOfRows] = useState();
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [positionId, setPositionId] = useState();
  const [modal, setModal] = useState(false);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editId, setEditId] = useState(null);
  const [positionList, setPositionList] = useState([]);
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
    setPositionId(id);
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

  const fetchPositions = () => {
    setLoader(true);
    const emptyPayload = {
      order: [columnName, sortOrder],
      pageSize: customPageSize,
      pageNumber: currentPage,
    };
    listOfPositionApi(emptyPayload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setPositionList(resp?.data?.listOfPosition);
          setTotalPages(resp?.data?.totalPages);
          setTotalRecords(resp?.data?.totalRecordsCount);
          setTotalNumberOfRows(resp?.data?.numberOfRows);
          setCurrentPage(resp?.data?.currentPage);
        } else {
          toast.error(resp?.message);
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const fetchEditData = (id) => {
    const position = positionList?.find((item) => item.id === id);
    setEditData(position);
    setAddEditModal(true);
  };

  const deletePosition = async () => {
    setDeleteLoader(true);
    await deletePositionApi(positionId)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          toast.success(resp.message);
          fetchPositions();
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
      position_name: editId ? editData?.position_name : "",
    },
    validationSchema: yup.object({
      position_name: yup
        .string()
        .required(validationMessages.required(Position)),
    }),
    onSubmit: (values) => {
      setBtnLoader(true);
      const payload = { position_name: values?.position_name };
      const apiCall = editId
        ? editPositionApi(editId, payload)
        : addPositionApi(payload);

      apiCall
        .then((resp) => {
          if (
            resp?.statusCode === StatusCodes.ACCEPTED ||
            resp?.statusCode === StatusCodes.OK ||
            resp?.statusCode === StatusCodes.CREATED
          ) {
            toast.success(resp.message);
            fetchPositions();
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
    fetchPositions();
  }, [currentPage, customPageSize, columnName, sortOrder]);

  useEffect(() => {
    if (editId && !editData) {
      fetchEditData(editId);
    }
  }, [editId]);

  const columns = useMemo(
    () => [
      {
        header: SrNo,
        accessorKey: "id",
        cell: (cell) => cell.row.index + 1,
        enableColumnFilter: false,
      },
      {
        header: Position,
        accessorKey: "position_name",
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
                title="Edit"
              />
            </span>
            <span>
              <RiDeleteBin7Fill
                className={`fs-5 text-danger`}
                onClick={() => toggle(cell.row.original.id)}
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

  return (
    <>
      <div className="d-flex justify-content-between align-items-center w-full px-3">
        <h5 className="f-w-600">{Position}</h5>
        <div className="col-sm-auto col-md-auto mb-2">
          <BaseButton
            className="btn btn-pill"
            type="submit"
            children="Add Position"
            onClick={() => toggleAddEditModal(null)}
          />
        </div>
      </div>

      <BaseModal
        isOpen={modal}
        title="Delete"
        toggler={toggle}
        submit={deletePosition}
        submitText="Delete"
        disabled={deleteLoader}
        loader={deleteLoader}
      >
        {DeleteMessage}
      </BaseModal>
      <BaseModal
        isOpen={addEditModal}
        title={editId ? "Edit Position" : "Add Position"}
        toggler={() => toggleAddEditModal(null)}
        submit={formik.handleSubmit}
        submitText={editId ? "Update" : "Add"}
        disabled={btnLoader}
        loader={btnLoader}
      >
        <form onSubmit={formik.handleSubmit}>
          <BaseInput
            label="Position Name"
            name="position_name"
            type="text"
            placeholder="Enter position name"
            value={formik.values.position_name}
            touched={formik.touched.position_name}
            error={formik.errors.position_name}
            handleBlur={formik.handleBlur}
            handleChange={formik.handleChange}
          />
        </form>
      </BaseModal>

      <div className="col-6 py-2 px-3">
        <h5 className="f-w-600">{PositionList}</h5>
      </div>
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {positionList && positionList?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              fetchData={handleFetchData}
              columns={columns}
              data={positionList || []}
              isGlobalFilter={true}
              customPageSize={customPageSize}
              setCustomPageSize={setCustomPageSize}
              manualPagination={true}
              tableClass="table table-bordered text-center"
              fetchSortingData={handleFetchSorting}
              SearchPlaceholder={Search}
            />
          )}
          
          {!positionList && (
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

export default PositionList;
