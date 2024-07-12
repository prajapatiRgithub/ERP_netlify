import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Form } from "reactstrap";
import TableContainer from "../../BaseComponents/BaseTable";
import {
  AddCandidate,
  batchallocationLabel,
} from "../../Constant/BatchAllocation/batchallocation";
import BaseCheckbox from "../../BaseComponents/BaseCheckbox";
import Spinner from "../../BaseComponents/BaseLoader";
import { getCourseIdFromSessionStorage } from "../../Constant/common";
import { editBatch, ListOfCandidate } from "../../Api/BatchApi";
import { useNavigate, useParams } from "react-router-dom";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import BaseButton from "../../BaseComponents/BaseButton";
import { RiSearchLine } from "react-icons/ri";
import { notFound } from "../../Constant";

const AddMoreCandidate = () => {
  document.title = AddCandidate;
  const [candidateData, setCandidateData] = useState([]);
  const [loader, setLoader] = useState(true);
  const { batchId } = useParams();
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalNumberOfRows, setTotalNumberOfRows] = useState();

  const history = useNavigate();
  const courseId = getCourseIdFromSessionStorage();


  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };

  // Function to handle checking or unchecking all checkboxes
  const handleCheckAll = () => {
    setIsCheckedAll(!isCheckedAll);
    const updatedCheckedItems = isCheckedAll
      ? []
      : candidateData?.map((item) => item.id);
    setCheckedItems(updatedCheckedItems);
  };

  const handleCheckItem = (id) => {
    const isAlreadyChecked = checkedItems?.includes(id);
    const updatedCheckedItems = isAlreadyChecked
      ? checkedItems?.filter((itemId) => itemId !== id)
      : [...checkedItems, id];
    setCheckedItems(updatedCheckedItems);
    setIsCheckedAll(updatedCheckedItems?.length === candidateData?.length);
  };

  useEffect(() => {
    if (isCheckedAll && candidateData?.length > 0) {
      const allCandidateIds = candidateData?.map((item) => item.id);
      setCheckedItems(allCandidateIds);
    }
  }, [isCheckedAll, candidateData]);

  const columns = useMemo(
    () => [
      {
        header: (
          <BaseCheckbox
            id="checkBoxAll"
            checked={isCheckedAll}
            onChange={() => handleCheckAll()}
            className="custom-checkbox-class d-felx justify-content-center"
            labelClassName="custom-label-class"
          />
        ),
        enableSorting: true,
        cell: (cell) => (
          <BaseCheckbox
            id={`checkbox${cell.row.original.id}`}
            checked={
              checkedItems.includes(cell.row.original.id) || isCheckedAll
            }
            onChange={() => handleCheckItem(cell.row.original.id)}
            className="custom-checkbox-class taskCheckBox"
            labelClassName="custom-label-class"
          />
        ),
        id: "#id",
        accessorKey: "id",
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: batchallocationLabel.candidateLable,
        accessorKey: batchallocationLabel.candidateKey,
        enableColumnFilter: false,
      },
      {
        header: batchallocationLabel.mobileNo,
        accessorKey: batchallocationLabel.conatactKey,
        enableColumnFilter: false,
      },
    ],
    [checkedItems, isCheckedAll]
  );

  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  const fetchData = () => {
    setLoader(true);
    const payload = {
      courseId: parseInt(courseId),
      is_batch_assign: false,
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    ListOfCandidate(payload)
      .then((response) => {
        if (
          response.statusCode === StatusCodes.ACCEPTED ||
          response.statusCode === StatusCodes.OK ||
          response.statusCode === StatusCodes.CREATED
        ) {
          setCandidateData(response?.data?.candidate);
          setTotalPages(response?.data?.totalPages);
          setTotalRecords(response?.data?.totalRecordsCount);
          setTotalNumberOfRows(response?.data?.numberOfRows);
          setCurrentPage(response?.data?.currentPage);
        } else {
          toast.error(response?.message);
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
  }, [currentPage, customPageSize, columnName, sortOrder]);

  const handleAddMoreCandidatedidate = () => {
    setLoader(true);
    const payload = {
      candidate_id: checkedItems,
    };
    editBatch(batchId, payload)
      .then((resp) => {
        if (
          resp.statusCode === StatusCodes.ACCEPTED ||
          resp.statusCode === StatusCodes.OK ||
          resp.statusCode === StatusCodes.CREATED
        ) {
          toast.success(resp?.message);
          setCheckedItems([]);
          setIsCheckedAll(false);
          history(`/batchlist`);
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
      })
      .finally(() => {
        setLoader(false);
        setCheckedItems([]);
        setIsCheckedAll(false);
      });
  };
  const isCreateButtonDisabled = checkedItems.length === 0;

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Form>
        <div className="py-2 px-3">
          <h5 className="f-w-600">{batchallocationLabel.candidateList}</h5>
        </div>
        <Card>
          <CardBody className="mb-0 pb-0">
            <div className="d-flex mb-3 justify-content-end">
              <BaseButton
                color="primary"
                onClick={() => handleAddMoreCandidatedidate()}
                disabled={isCreateButtonDisabled}
              >
                {batchallocationLabel.addSelecte}
              </BaseButton>
            </div>

            <div className="pt-0">
              {loader ? (
                <Spinner attrSpinner={{ className: "loader-2" }} />
              ) : (
                <div className="pt-0">
                  <div>
                    {candidateData?.length > 0 ? (
                      <TableContainer
                        columns={columns}
                        totalPages={totalPages}
                        totalRecords={totalRecords}
                        manualPagination={true}
                        totalNumberOfRows={totalNumberOfRows}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        fetchData={handleFetchData}
                        data={searchValue ? [] : candidateData || []}
                        isGlobalFilter={true}
                        setCustomPageSize={setCustomPageSize}
                        customPageSize={customPageSize}
                        theadClass="table-light text-muted"
                        SearchPlaceholder={batchallocationLabel.searchBar}
                        onSearch={handleSearchValueChange}
                        fetchSortingData={handleFetchSorting}
                      />
                    ) : (
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
              )}
            </div>
          </CardBody>
        </Card>
      </Form>
    </div>
  );
};

export default AddMoreCandidate;
