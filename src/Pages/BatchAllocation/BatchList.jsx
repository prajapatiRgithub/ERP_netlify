import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody } from "reactstrap";
import { RiEditFill, RiCheckboxCircleLine, RiSearchLine } from "react-icons/ri";
import {
  SelectPlaceHolder,
  validationMessages,
} from "../../Constant/validation";
import TableContainer from "../../BaseComponents/BaseTable";
import {
  batchallocationLabel,
  batchallocationValidation,
  BatchListTitle,
  editBatchLable,
  StatusOptions,
} from "../../Constant/BatchAllocation/batchallocation";
import {
  candidateSatuts,
  courseCodeList,
  listOfBatch,
} from "../../Api/BatchApi";
import BaseSelect from "../../BaseComponents/BaseSelect";
import { useNavigate } from "react-router-dom";
import Spinner from "../../BaseComponents/BaseLoader";
import BaseModal from "../../BaseComponents/BaseModal";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Completed, notFound, Status } from "../../Constant";
import { StatusCodes } from "http-status-codes";
import BaseButton from "../../BaseComponents/BaseButton";
import { exportBatchList } from "../../Api/exportBtn";
import { BaseImageURL } from "../../Api/Service";

const BatchList = () => {
  document.title = BatchListTitle;
  const [batchList, setBatchList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const [loader, setLoader] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [btnLoader, setBtnLoader] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const history = useNavigate();

  const fetchCourse = () => {
    courseCodeList({})
      .then((res) => {
        if (
          res.statusCode === StatusCodes.ACCEPTED ||
          res.statusCode === StatusCodes.OK ||
          res.statusCode === StatusCodes.CREATED
        ) {
          setCourseData(
            res?.data?.map((item) => ({
              value: item?.id,
              label: item?.course_code,
              id: item?.id,
            }))
          );
        } else {
          toast.error(res?.message);
        }
      })
      .catch((error) => {
        return error;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };

  const statusForm = useFormik({
    initialValues: {
      Status: "",
    },
    validationSchema: yup.object({
      Status: yup.string().required(validationMessages.required("Status")),
    }),
    onSubmit: async (values) => {
      setBtnLoader(true);
      const payload = {
        status: values.Status,
      };
      await candidateSatuts(selectedBatchId, payload)
        .then((resp) => {
          if (
            resp.statusCode === StatusCodes.ACCEPTED ||
            resp.statusCode === StatusCodes.OK ||
            resp.statusCode === StatusCodes.CREATED
          ) {
            toast.success(resp?.message);
            fetchData();
          } else {
            toast.error(resp?.message);
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || err?.message);
        })
        .finally(() => {
          setBtnLoader(false);
          handleBatchStatus();
        });
      statusForm.resetForm();
    },
  });

  const fetchData = () => {
    setLoader(true);
    const payload = {
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    listOfBatch(payload)
      .then((res) => {
        if (
          res.statusCode === StatusCodes.ACCEPTED ||
          res.statusCode === StatusCodes.OK ||
          res.statusCode === StatusCodes.CREATED
        ) {
          setBatchList(res?.data?.listOfBatch);
          setTotalPages(res?.data?.totalPages);
          setTotalRecords(res?.data?.totalRecordsCount);
          setTotalNumberOfRows(res?.data?.numberOfRows);
          setCurrentPage(res?.data?.currentPage);
        } else {
          toast.error(res?.message);
        }
      })
      .catch((error) => {
        return error;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  useEffect(() => {
    handleCourseChange(selectedCourse);
  }, [currentPage, customPageSize, columnName, sortOrder]);

  const columns = useMemo(() => [
    {
      header: batchallocationValidation.batchNameValidation,
      accessorKey: batchallocationLabel.bacthNameKey,
      enableColumnFilter: false,
    },
    {
      header: batchallocationLabel.courseName,
      accessorKey: batchallocationLabel.courseNameKey,
      enableColumnFilter: false,
    },
    {
      header: batchallocationLabel.centerName,
      accessorKey: batchallocationLabel.centerKey,
      enableColumnFilter: false,
    },
    {
      header: batchallocationLabel.totalEnrolled,
      accessorKey: batchallocationLabel.totalEnrolledKey,
      enableColumnFilter: false,
    },
    {
      header: batchallocationLabel.totalCandidate,
      accessorKey: batchallocationLabel.totalCandidateKey,
      enableColumnFilter: false,
    },
    {
      header: Status,
      accessorKey: batchallocationLabel.status,
      enableColumnFilter: false,
    },
    {
      header: batchallocationLabel.action,
      accessorKey: batchallocationLabel.actionKey,
      enableSorting: true,
      cell: (cell) => (
        <div>
          <span>
            <RiCheckboxCircleLine
              className="fs-5 text-primary mx-2"
              onClick={() => handleBatchStatus(cell?.row?.original?.id)}
              title="Status"
            />
          </span>
          <span>
            <RiEditFill
              className={`fs-5 text-success mx-2 ${
                cell?.row?.original?.status === Completed ? `icon-disabled` : ``
              }`}
              onClick={() => handleEditBatch(cell?.row?.original?.id)}
              title="Edit"
              disabled={
                cell?.row?.original?.status === Completed ? true : false
              }
            />
          </span>
        </div>
      ),
      enableColumnFilter: false,
    },
  ]);

  const handleExportBatchList = () => {
    setLoader(true);
    exportBatchList(1)
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
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleEditBatch = (batchId) => {
    history(`/editbatch/${batchId}`);
  };
  const handleBatchStatus = (batchId) => {
    setSelectedBatchId(batchId);
    setShowModal(!showModal);
    statusForm.resetForm();
  };

  const handleCourseChange = (selectedOption) => {
    setLoader(true);
    setSelectedCourse(selectedOption);
    if (selectedOption) {
      const course_id = selectedOption;
      const payload = {
        order: [columnName, sortOrder],
        pageNumber: currentPage,
        pageSize: customPageSize,
        condition: {
          course_id: course_id,
        },
      };
      listOfBatch(payload)
        .then((res) => {
          if (
            res?.statusCode === StatusCodes.ACCEPTED ||
            res?.statusCode === StatusCodes.OK ||
            res?.statusCode === StatusCodes.CREATED
          ) {
            const filteredBatches = res?.data?.listOfBatch || [];
            setBatchList(filteredBatches);
            setTotalPages(res?.data?.totalPages);
            setTotalRecords(res?.data?.totalRecordsCount);
            setTotalNumberOfRows(res?.data?.numberOfRows);
            setCurrentPage(1);
          } else {
            setBatchList([]);
          }
        })
        .catch((error) => {
          setBatchList([]);
          return error;
        })
        .finally(() => {
          setLoader(false);
        });
    } else {
      setBatchList([]);
    }
  };

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  return (
    <div>
      {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
      <div className="d-flex justify-content-between align-items-center px-3">
        <h5 className="f-w-600">{batchallocationLabel.batchList}</h5>
        <div className="col-sm-auto col-md-auto mb-2">
          <BaseButton color="success" onClick={handleExportBatchList}>
            {editBatchLable.export} {batchallocationLabel.batchList}
          </BaseButton>
        </div>
      </div>
      <Card>
        <div className="row">
          <div className="col-md-2 px-3 py-2">
            <div className="align-items-center">
              <BaseSelect
                label={batchallocationLabel.selectCourse}
                name="course"
                className="select-border"
                options={courseData}
                placeholder={SelectPlaceHolder(batchallocationLabel.course)}
                handleChange={(field, value) => handleCourseChange(value)}
                value={selectedCourse}
                isDisabled={false}
              />
            </div>
          </div>
        </div>
      </Card>
      <Card>
        <CardBody>
          <div className="pt-0">
            <div className="pt-0">
              {loader ? (
                <Spinner attrSpinner={{ className: "loader-2" }} />
              ) : (
                <div>
                  {batchList?.length > 0 ? (
                    <TableContainer
                      totalPages={totalPages}
                      totalRecords={totalRecords}
                      setCurrentPage={setCurrentPage}
                      currentPage={currentPage}
                      fetchData={handleFetchData}
                      totalNumberOfRows={totalNumberOfRows}
                      columns={columns}
                      data={searchValue ? [] : batchList || []}
                      isGlobalFilter={true}
                      customPageSize={customPageSize}
                      setCustomPageSize={setCustomPageSize}
                      fetchSortingData={handleFetchSorting}
                      manualPagination={true}
                      tableClass="table table-bordered text-center"
                      onSearch={handleSearchValueChange}
                      SearchPlaceholder={batchallocationLabel.searchBar}
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
              )}
            </div>
          </div>
        </CardBody>
      </Card>
      <BaseModal
        isOpen={showModal}
        toggler={handleBatchStatus}
        title={batchallocationLabel.statusUpdateTitle}
        submitText={batchallocationLabel.submit}
        submit={statusForm.handleSubmit}
        disabled={btnLoader}
        loader={btnLoader}
      >
        <>
          <BaseSelect
            name="Status"
            label={Status}
            className="select-border"
            options={StatusOptions}
            placeholder={PlaceHolderFormat(Status)}
            handleChange={(field, value) => {
              statusForm.setFieldValue(field, value);
            }}
            handleBlur={() => statusForm.setFieldTouched(Status, true)}
            value={statusForm.values.Status}
            touched={statusForm.touched.Status}
            error={statusForm.errors.Status}
          />
        </>
      </BaseModal>
    </div>
  );
};

export default BatchList;
