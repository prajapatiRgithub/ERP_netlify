import React, { useEffect, useMemo, useState } from "react";
import TableContainer from "../../BaseComponents/BaseTable";
import { RiAddLine, RiEyeFill } from "react-icons/ri";
import { Action, notFound } from "../../Constant";
import { useNavigate } from "react-router-dom";
import { listOfPlacementCandidate } from "../../Api/placement";
import { StatusCodes } from "http-status-codes";
import Spinner from "../../BaseComponents/BaseLoader";
import { placementLable } from "../../Constant/Placement/placement";
import { SrNo } from "../../Constant/Center";
import BaseButton from "../../BaseComponents/BaseButton";
import { editBatchLable } from "../../Constant/BatchAllocation/batchallocation";
import { exportPlacementList } from "../../Api/exportBtn";
import { BaseImageURL } from "../../Api/Service";
import { toast } from "react-toastify";
import { placementTitle } from "../../Constant/title";
import { RiSearchLine } from "react-icons/ri";

const Placement = () => {
  document.title = placementTitle;
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [searchValue, setSearchValue] = useState("");
  const history = useNavigate();
  const [candidateData, setCandidateData] = useState([]);
  const [loader, setLoader] = useState(false);

  const addPlacement = (can_id) => {
    history(`/addPlacement/${can_id}`);
  };
  const ViewCandidate = (candidateId) => {
    history(`/viewCandidate/${candidateId}`);
  };
  const fetchData = () => {
    setLoader(true);
    const payload = {
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    listOfPlacementCandidate(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setCandidateData(resp?.data?.listOfCandidate);
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
  }, [columnName, sortOrder, currentPage, customPageSize]);

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
        header: placementLable.candidateName,
        accessorKey: "candidate_name",
        enableColumnFilter: false,
      },
      {
        header: placementLable.contactNumber,
        accessorKey: "contact_no",
        enableColumnFilter: false,
      },
      {
        header: placementLable.courseName,
        accessorKey: "course.course_name",
        enableColumnFilter: false,
      },
      {
        header: placementLable.centerName,
        accessorKey: "center.center_name",
        enableColumnFilter: false,
      },
      {
        header: placementLable.batchId,
        accessorKey: "batchAssign.batch.batch_id",
        enableColumnFilter: false,
      },
      {
        header: placementLable.status,
        accessorKey: "batchAssign.status",
        enableColumnFilter: false,
      },
      {
        header: Action,
        accessorKey: "action",
        enableSorting: true,
        cell: (cell) => (
          <div className="d-flex justify-content-center icon">
            <span>
              <RiAddLine
                className="fs-5 text-primary mx-2"
                onClick={() => {
                  addPlacement(cell?.row?.original?.id);
                }}
                title="Add Placement"
              />
            </span>
            <span>
              <RiEyeFill
                className="fs-5 text-success mx-2"
                onClick={() => ViewCandidate(cell?.row?.original?.id)}
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

  const handleExportPlacement = () => {
    setLoader(true);
    exportPlacementList(1)
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

  return (
    <>
      <div className="py-2 px-3 d-flex justify-content-between align-items-center">
        <h5 className="f-w-600">{placementLable.placementList}</h5>
        <div className="col-sm-auto col-md-auto mb-2">
          <BaseButton color="success" onClick={handleExportPlacement}>
            {editBatchLable.export} {placementLable.placementList}
          </BaseButton>
        </div>
      </div>
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {candidateData && candidateData?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              fetchData={handleFetchData}
              columns={columns}
              data={searchValue ? [] : candidateData || []}
              isGlobalFilter={true}
              customPageSize={customPageSize}
              setCustomPageSize={setCustomPageSize}
              manualPagination={true}
              tableClass="table table-bordered text-center"
              onSearch={handleSearchValueChange}
              SearchPlaceholder="Search"
              fetchSortingData={handleFetchSorting}
            />
          )}
          {!loader && !candidateData && (
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

export default Placement;
