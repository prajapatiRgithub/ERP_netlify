import React, { useEffect, useMemo, useRef, useState } from "react";
import { FormFeedback, Label } from "reactstrap";
import "flatpickr/dist/flatpickr.css";
import { RiSearchLine } from "react-icons/ri";
import BaseButton from "../../BaseComponents/BaseButton";
import BaseModal from "../../BaseComponents/BaseModal/index";
import BaseSelect from "../../BaseComponents/BaseSelect/index";
import {
  Designation,
  Duration,
  Filter,
  Filters,
  Import,
  Name,
  Search,
  Submit,
  notFound,
} from "../../Constant";
import Flatpickr from "react-flatpickr";
import { courseApi, viewBatch } from "../../Api/common";
import { SelectPlaceHolder } from "../../Constant/validation";
import { StatusCodes } from "http-status-codes";
import * as yup from "yup";
import {
  filterAttendanceData,
  importAttendanceData,
  listAttendanceData,
  listCandidateFilter,
} from "../../Api/BatchApi";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import TableContainer from "../../BaseComponents/BaseTable";
import Spinner from "../../BaseComponents/BaseLoader";
import moment from "moment";
import {
  AttendanceList,
  AttendanceText,
  BatchText,
  Candidate,
  ClearFilters,
  csvValidation,
  DataError,
  DivisionUnits,
  EMPID,
  EndDate,
  fileImport,
  fileType,
  fileValidation,
  InTime,
  Note,
  OfficeLocations,
  OutTime,
  sampleFile,
  StartDate,
  Title,
} from "../../Constant/Attendance";
import { Course } from "../../Constant/Course";

const Attendance = () => {
  document.title = Title;
  const startDateRef = useRef();
  const endDateRef = useRef();
  const [btnLoader, setBtnLoader] = useState(false);
  const [loader, setLoader] = useState([]);
  const [showClearFilter, setShowClearFilter] = useState(false);
  const [enableFilter, setEnableFilter] = useState(true);
  const [attendanceList, setAttendanceList] = useState();
  const [courseData, setCourseData] = useState();
  const [batchData, setBatchData] = useState();
  const [candidateData, setCandidateData] = useState();
  const [importModal, setImportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(null);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [error, setError] = useState([]);
  const [errorModal, setErrorModal] = useState(false);

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };
  const filterForm = useFormik({
    initialValues: {
      start_date: null,
      end_date: null,
      course: null,
      batch: null,
      candidate: null,
    },
    onSubmit: (values) => {
      setShowClearFilter(true);
      setLoader(true);
      const payload = {
        startDate: values.start_date,
        endDate: values.end_date,
        course_id: values.course,
        batch_id: values.batch,
        candidate_id: values.candidate,
        order: [columnName, sortOrder],
        pageSize: customPageSize,
        pageNumber: currentPage,
      };
      filterAttendanceData(payload)
        .then((resp) => {
          if (
            resp?.statusCode === StatusCodes.ACCEPTED ||
            resp?.statusCode === StatusCodes.OK ||
            resp?.statusCode === StatusCodes.CREATED
          ) {
            setAttendanceList(resp?.data?.listOfCandidate);
            setTotalRecords(resp.data.totalRecordsCount);
            setTotalPages(resp?.data?.totalPages);
            setTotalNumberOfRows(resp?.data?.numberOfRows);
            setCurrentPage(resp?.data?.currentPage);
          } else {
            setAttendanceList(null);
          }
        })
        .catch((err) => {
          setAttendanceList(null);
          return err;
        })
        .finally(() => {
          setLoader(false);
        });
    },
  });

  const toggleImport = () => {
    setImportModal(!importModal);
  };

  const handleClearFilter = () => {
    setShowClearFilter(false);
    startDateRef.current.flatpickr.clear();
    endDateRef.current.flatpickr.clear();
    filterForm.resetForm();
    fetchData();
  };

  const handleDateChange = (date, field) => {
    let value = moment(date && date[0]).format("YYYY-MM-DD");
    filterForm.setFieldValue(field, value);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      importData: "",
    },
    validationSchema: yup.object({
      importData: yup
        .mixed()
        .required(fileValidation)
        .test(fileType, csvValidation, (value) => {
          if (value) {
            return value.type === "text/csv" || value.name.endsWith(".csv");
          }
          return false;
        }),
    }),
    onSubmit: (values, { resetForm }) => {
      setBtnLoader(true);
      const formData = new FormData();
      formData.append("file", values.importData);
      importAttendanceData(formData)
        .then((resp) => {
          if (
            resp?.statusCode === StatusCodes.ACCEPTED ||
            resp?.statusCode === StatusCodes.OK ||
            resp?.statusCode === StatusCodes.CREATED
          ) {
            toast.success(resp.message);
            formik.setFieldValue(resp?.data);
          } else {
            toast.error(resp?.message);
            setError(resp?.message);
            setErrorModal(true);
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || err?.message);
          setError(err?.response?.data?.message);
          setErrorModal(true);
        })
        .finally(() => {
          setBtnLoader(false);
          toggleImport();
          fetchData();
          resetForm();
        });
    },
  });

  const fetchList = async () => {
    setLoader(true);
    let data;
    const payload = {};
    await courseApi(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setCourseData(
            data?.map((item) => ({
              value: item?.id,
              label: item?.course_name,
              id: item?.id,
            }))
          );
        }
      })
      .catch((err) => {
        return err;
      });

    viewBatch({})
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setBatchData(
            data?.map((item) => ({
              value: item?.id,
              label: item?.batch_id,
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

    listCandidateFilter(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setCandidateData(
            data?.map((item) => ({
              value: item?.id,
              label: item?.candidate_name,
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
  const fetchData = async () => {
    setLoader(true);
    const payload = {
      order: [columnName, sortOrder],
      pageSize: customPageSize,
      pageNumber: currentPage,
    };
    listAttendanceData(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setAttendanceList(resp?.data?.listOfAttendance);
          setTotalRecords(resp.data.totalRecordsCount);
          setTotalPages(resp?.data?.totalPages);
          setTotalNumberOfRows(resp?.data?.numberOfRows);
          setCurrentPage(resp?.data?.currentPage);
        }
      })
      .catch((err) => {
        return err;
      })
      .finally(() => {
        setLoader(false);
      });
  };
  
  const columns = useMemo(
    () => [
      {
        header: EMPID,
        accessorKey: "emp_id",
        enableColumnFilter: false,
      },
      {
        header: Name,
        accessorKey: "name",
        enableColumnFilter: false,
      },
      {
        header: Designation,
        accessorKey: "users_designation",
        enableColumnFilter: false,
      },
      {
        header: DivisionUnits,
        accessorKey: "division",
        enableColumnFilter: false,
      },
      {
        header: OfficeLocations,
        accessorKey: "office_locations",
        enableColumnFilter: false,
      },
      {
        header: InTime,
        accessorKey: "in_time",
        enableColumnFilter: false,
      },
      {
        header: OutTime,
        accessorKey: "out_time",
        enableColumnFilter: false,
      },
      {
        header: Duration,
        accessorKey: "duration",
        enableColumnFilter: false,
      },
    ],
    []
  );

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const hasAnyValue = Object.values(filterForm.values).some((value) => value);
    setEnableFilter(!hasAnyValue);
  }, [filterForm.values]);

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    if (showClearFilter === true) {
      filterForm.handleSubmit();
    } else {
      fetchData();
    }
  }, [currentPage, customPageSize, sortOrder, columnName]);

  return (
    <div className="page-content">
      <BaseModal
        isOpen={importModal}
        toggler={toggleImport}
        title={fileImport}
        submitText={Submit}
        disabled={btnLoader}
        loader={btnLoader}
        submit={formik.handleSubmit}
      >
        <div className="row col-12 px-0">
          <div className="d-inline-flex align-items-center mb-3">
            {Note}:&nbsp;
            <a href="/Attendance Sample.csv" download="Attendance Sample.csv">
              {sampleFile}
            </a>
          </div>
          {/* ReactStrap Input Is not Working so that's why i have use Input */}
          <input
            name="importData"
            type="file"
            accept=".csv, application/vnd.ms-excel"
            onChange={(e) => {
              formik.setFieldValue("importData", e.currentTarget.files[0]);
            }}
            onBlur={formik.handleBlur}
            className={
              formik.touched.importData && formik.errors.importData
                ? "is-invalid border-0"
                : "border-0"
            }
          />
          {formik.touched.importData && formik.errors.importData ? (
            <div className="invalid-feedback">{formik.errors.importData}</div>
          ) : null}
        </div>
      </BaseModal>
      <div className="px-3 d-flex justify-content-between mb-3">
        <h5 className="f-w-600">{AttendanceText}</h5>
        <BaseButton
          className="btn btn-pill btn-warning text-white"
          onClick={toggleImport}
          children={Import || loader}
        />
      </div>
      <div className="card mb-2">
        <div className="container-fluid">
          <div className="row d-flex align-items-center px-2">
            <div className="d-flex justify-content-between pt-2">
              <h6>{Filters}</h6>
            </div>
            <div className="col-12 row d-flex justify-content-between">
              <div className="col-12 col-lg-2">
                <Label>{StartDate}</Label>
                <Flatpickr
                  name="start_date"
                  className="form-control clickable"
                  ref={startDateRef}
                  placeholder={SelectPlaceHolder("Start Date")}
                  onChange={(date) => handleDateChange(date, "start_date")}
                  options={{
                    dateFormat: "d-m-Y",
                    mode: "single",
                  }}
                />
                {filterForm.touched.start_date &&
                filterForm.errors.start_date ? (
                  <FormFeedback className="d-block">
                    {filterForm.errors.start_date}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="col-12 col-lg-2">
                <Label>{EndDate}</Label>
                <Flatpickr
                  name="end_date"
                  ref={endDateRef}
                  className="form-control clickable"
                  placeholder={SelectPlaceHolder("End Date")}
                  onChange={(date) => handleDateChange(date, "end_date")}
                  options={{
                    dateFormat: "d-m-Y",
                    mode: "single",
                  }}
                />
                {filterForm.touched.end_date && filterForm.errors.end_date ? (
                  <FormFeedback className="d-block">
                    {filterForm.errors.end_date}
                  </FormFeedback>
                ) : null}
              </div>
              <div className="col-12 col-lg-2">
                <BaseSelect
                  name="course"
                  label={Course}
                  className="select-border"
                  options={courseData}
                  placeholder={SelectPlaceHolder("Course")}
                  handleChange={(field, value) => {
                    filterForm.setFieldValue(field, value);
                  }}
                  value={filterForm.values.course}
                  handleBlur={() => filterForm.setFieldTouched(Course, true)}
                  touched={filterForm.touched.course}
                  error={filterForm.errors.course}
                />
              </div>
              <div className="col-12 col-lg-3">
                <BaseSelect
                  name="batch"
                  label={BatchText}
                  className="select-border"
                  options={batchData}
                  placeholder={SelectPlaceHolder("Batch")}
                  handleChange={(field, value) => {
                    filterForm.setFieldValue(field, value);
                  }}
                  value={filterForm.values.batch}
                  handleBlur={() => filterForm.setFieldTouched(BatchText, true)}
                  touched={filterForm.touched.batch}
                  error={filterForm.errors.batch}
                />
              </div>
              <div className="col-12 col-lg-3">
                <BaseSelect
                  name="candidate"
                  label={Candidate}
                  className="select-border"
                  options={candidateData}
                  placeholder={SelectPlaceHolder("Candidate")}
                  handleChange={(field, value) => {
                    filterForm.setFieldValue(field, value);
                  }}
                  value={filterForm.values.candidate}
                  handleBlur={() => filterForm.setFieldTouched(Candidate, true)}
                  touched={filterForm.touched.candidate}
                  error={filterForm.errors.candidate}
                />
              </div>
            </div>
            <div className="d-flex justify-content-end pb-2">
              {showClearFilter && (
                <BaseButton
                  onClick={handleClearFilter}
                  className="btn btn-danger mx-2"
                  children={ClearFilters}
                />
              )}
              <BaseButton
                onClick={filterForm.handleSubmit}
                disabled={enableFilter}
                children={Filter}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-3">
        <h5 className="f-w-600">{AttendanceList}</h5>
      </div>
      <div className="card">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {!loader && attendanceList?.length > 0 && (
            <div className="py-4 text-center">
              <TableContainer
                columns={columns}
                customPageSize={customPageSize}
                totalRecords={totalRecords}
                totalNumberOfRows={totalNumberOfRows}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                fetchData={handleFetchData}
                isGlobalFilter={true}
                setCustomPageSize={setCustomPageSize}
                fetchSortingData={handleFetchSorting}
                tableClass="table table-bordered"
                data={attendanceList || []}
                SearchPlaceholder={Search}
                manualPagination={true}
              />
              <i className="ri-search-line display-5 text-success"></i>
            </div>
          )}
          {!loader && !attendanceList && (
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
      <BaseModal
        isOpen={errorModal}
        toggler={() => setErrorModal(false)}
        title={DataError}
        hasSubmitButton={false}
      >
        <ul className="list-group list-group-flush">
          {error &&
            error?.map((errorMessage, index) => (
              <li key={index} className="list-group-item text-danger">
                {index + 1}. {errorMessage}
              </li>
            ))}
        </ul>
      </BaseModal>
    </div>
  );
};

export default Attendance;
