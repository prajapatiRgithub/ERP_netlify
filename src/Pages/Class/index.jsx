import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import TableContainer from "../../BaseComponents/BaseTable";
import { RiEditFill, RiSearchLine } from "react-icons/ri";
import { classEnums } from "../../Constant/Class/class";
import { Search, notFound } from "../../Constant";
import { exportClass, listOfClassApi } from "../../Api/ClassApi";
import { StatusCodes } from "http-status-codes";
import Spinner from "../../BaseComponents/BaseLoader";
import {
  setClassIdInSessionStorage,
  setBatchIdInSessionStorage,
} from "../../Constant/common";
import { toast } from "react-toastify";
import { BaseImageURL } from "../../Api/Service";
import BaseButton from "../../BaseComponents/BaseButton";
import { classTitle } from "../../Constant/title";

const Class = () => {
  document.title = classTitle;
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [classData, setClassData] = useState(null);

  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };

  const handleEdit = (classId, batchId) => {
    setClassIdInSessionStorage(classId);
    setBatchIdInSessionStorage(batchId);
    navigate(`/classDetails/${classId}`);
  };

  useEffect(() => {
    fetchClassData();
  }, [currentPage, customPageSize, columnName, sortOrder]);

  const fetchClassData = async () => {
    setLoader(true);
    const classPayload = {
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    listOfClassApi(classPayload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setClassData(resp?.data?.uniqueListOfClass);
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

  const classColumns = useMemo(
    () => [
      {
        header: classEnums.SR_NO,
        accessorKey: "serial_number",
        cell: (cell) => cell.row.index + 1,
        enableColumnFilter: false,
      },
      {
        header: classEnums.BATCH_ID,
        accessorKey: "batch_id",
        enableColumnFilter: false,
      },
      {
        header: classEnums.BATCH_START_DATE,
        accessorKey: "batch.start_date",
        enableColumnFilter: false,
      },
      {
        header: classEnums.BATCH_END_DATE,
        accessorKey: "batch.end_date",
        enableColumnFilter: false,
      },
      {
        header: classEnums.COURSE_NAME,
        accessorKey: "batch.course.course_name",
        enableColumnFilter: false,
      },
      {
        header: classEnums.COURSE_HOURS,
        accessorKey: "batch.course.course_hours",
        enableColumnFilter: false,
      },
      {
        header: classEnums.RATE_PER_HOUR,
        accessorKey: "batch.course.course_rate",
        enableColumnFilter: false,
      },
      {
        header: classEnums.ACTION,
        accessorKey: "action",
        enableColumnFilter: false,
        cell: (cell) => (
          <div className="d-flex justify-content-center icon">
            <RiEditFill
              className="fs-5 mx-2 text-success"
              onClick={() =>
                handleEdit(cell?.row?.original?.id, cell?.row?.original?.batch_id)
              }
              title={classEnums.EDIT}
            />
          </div>
        ),
      },
    ],
    [navigate]
  );
  const handleExportClass = () => {
    setLoader(true);
    exportClass()
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
          toast.success(resp?.success);
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
  return (
    <div>
      <div className="px-3 d-flex justify-content-between ">
        <h5 className="f-w-600">{classEnums.CLASS}</h5>
        <div className="col-sm-auto col-md-auto mb-2">
          <BaseButton onClick={() => handleExportClass()} color="success">
            {classEnums.exportClass}
          </BaseButton>
        </div>
      </div>{" "}
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {classData && classData?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              fetchData={handleFetchData}
              customPageSize={customPageSize}
              setCustomPageSize={setCustomPageSize}
              fetchSortingData={handleFetchSorting}
              columns={classColumns}
              data={searchValue ? [] : classData || []}
              manualPagination={true}
              SearchPlaceholder={Search}
              onSearch={handleSearchValueChange}
              isGlobalFilter={true}
              tableClass="table table-bordered text-center"
            />
          )}
          {!loader && !classData && (
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

export default Class;
