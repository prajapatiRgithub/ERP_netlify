import React, { useEffect, useMemo, useState } from "react";
import Spinner from "../../BaseComponents/BaseLoader";
import TableContainer from "../../BaseComponents/BaseTable";
import { Action, notFound } from "../../Constant";
import { RiAddLine, RiEyeFill, RiSearchLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { hostelLabel } from "../../Constant/Hostel/hostel";
import { exportHostelDetail, hostelAdd, listOfHostel } from "../../Api/hostel";
import { StatusCodes } from "http-status-codes";
import { BaseImageURL } from "../../Api/Service";
import { toast } from "react-toastify";
import BaseButton from "../../BaseComponents/BaseButton";
import { hostelTitle } from "../../Constant/title";

const Hostel = () => {
  document.title = hostelTitle;
  const [loader, setLoader] = useState(true);
  const [hostelData, setHostelData] = useState([]);
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [searchValue, setSearchValue] = useState("");
  const history = useNavigate();

  const ViewHostel = (hostelId) => {
    history(`/viewHostel/${hostelId}`);
  };

  const fetchData = () => {
    setLoader(true);
    const payload = {
      order: [[columnName, sortOrder]],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    listOfHostel(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setHostelData(resp?.data?.listOfHostel);
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

  useEffect(() => {
    fetchData();
  }, [customPageSize, currentPage, columnName, sortOrder]);

  const addHostel = (row) => {
    const payload = {
      center_id: row?.center?.id,
      course_id: row?.course?.id,
      batch_id: row?.id,
    };

    hostelAdd(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          let hostelId = resp?.data;
          history(`/viewHostel/${hostelId}`);
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
      });
  };

  const columns = useMemo(
    () => [
      {
        header: hostelLabel.center,
        accessorKey: "center.center_name",
        enableColumnFilter: false,
      },
      {
        header: hostelLabel.courseName,
        accessorKey: "course.course_name",
        enableColumnFilter: false,
      },
      {
        header: hostelLabel.batchId,
        accessorKey: "batch_id",
        enableColumnFilter: false,
      },
      {
        header: hostelLabel.batchStart,
        accessorKey: "start_date",
        enableColumnFilter: false,
      },
      {
        header: hostelLabel.endDate,
        accessorKey: "end_date",
        enableColumnFilter: false,
      },
      {
        header: "Total Day",
        accessorKey: "total_days",
        enableColumnFilter: false,
      },
      {
        header: Action,
        accessorKey: "action",
        enableSorting: false,
        cell: (cell) => {
          const { is_hostel } = cell.row.original;

          return (
            <div className="d-flex justify-content-center icon">
              {is_hostel ? (
                <span>
                  <RiEyeFill
                    className="fs-5 text-success mx-2"
                    onClick={() => ViewHostel(cell.row.original.hostel_id)}
                    title="View"
                  />
                </span>
              ) : (
                <span>
                  <RiAddLine
                    className="fs-5 text-primary mx-2"
                    onClick={() => addHostel(cell.row.original)}
                    title="Add"
                  />
                </span>
              )}
            </div>
          );
        },
        enableColumnFilter: false,
      },
    ],
    []
  );

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
  
  const handleExportHostel = () => {
    setLoader(true);
    exportHostelDetail()
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
          toast.success(resp.success);
        } else {
          toast.error(resp.message);
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
        <h5 className="f-w-600">{hostelLabel.hostelList}</h5>
        <div className="col-sm-auto col-md-auto mb-2">
          <BaseButton onClick={() => handleExportHostel()} color="success">
            {hostelLabel.exportHostel}
          </BaseButton>
        </div>
      </div>{" "}
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {hostelData && hostelData?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              fetchData={handleFetchData}
              columns={columns}
              data={searchValue ? [] : hostelData || []}
              isGlobalFilter={true}
              customPageSize={customPageSize}
              setCustomPageSize={setCustomPageSize}
              manualPagination={true}
              tableClass="table table-bordered text-center"
              onSearch={handleSearchValueChange}
              SearchPlaceholder={hostelLabel.search}
              fetchSortingData={handleFetchSorting}
            />
          )}
          {!loader && hostelData?.length === 0 && (
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

export default Hostel;
