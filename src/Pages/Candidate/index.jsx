import React, { useEffect, useMemo, useState } from "react";
import TableContainer from "../../BaseComponents/BaseTable/index";
import { RiCheckboxCircleLine, RiEyeFill, RiSearchLine } from "react-icons/ri";
import {
  Action,
  ClearFilter,
  ContactNumber,
  Name,
  Search,
  Status,
  notFound,
} from "../../Constant";
import * as yup from "yup";
import {
  SelectPlaceHolder,
  validationMessages,
} from "../../Constant/validation";
import BaseModal from "../../BaseComponents/BaseModal";
import { changeStatusApi, listCandidateApi } from "../../Api/CandidateApi";
import { toast } from "react-toastify";
import {
  StatusOptions,
  reference,
  validationMsg,
} from "../../Constant/Inquiry/Inquiry";
import { useFormik } from "formik";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import BaseSelect from "../../BaseComponents/BaseSelect";
import {
  centerApi,
  centerWiseCourse,
  fileUploadApi,
  viewBatch,
} from "../../Api/common";
import { StatusCodes } from "http-status-codes";
import { batch, center, courseName } from "../../Constant/Inquiry/Inquiry";
import Spinner from "../../BaseComponents/BaseLoader";
import { SrNo } from "../../Constant/Center";
import BaseButton from "../../BaseComponents/BaseButton";
import { useNavigate } from "react-router-dom";
import BaseInput from "../../BaseComponents/BaseInput";
import { CandidateLabel } from "../../Constant/Candidate/candidate";
import { candidateTitle } from "../../Constant/title";

const Candidate = () => {
  document.title = candidateTitle;
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [statusId, setStatusId] = useState();
  const [centerData, setCenterData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [clearFilter, setClearFilter] = useState(false);
  const [candidateData, setCandidateData] = useState();
  const [modalStatus, setModalStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [selectedStatus, setSelectedStatus] = useState("");
  const history = useNavigate();
  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };
  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  const ViewCandidate = (candidateId) => {
    history(`/viewCandidate/${candidateId}`);
  };

  const toggleStatus = (id) => {
    setStatusId(id);
    setModalStatus(!modalStatus);
    setSelectedStatus("");
    statusForm.resetForm();
  };

  const columns = useMemo(
    () => [
      {
        header: SrNo,
        accessorKey: "serial_number",
        cell: (cell) => cell.row.index + 1,
        enableColumnFilter: false,
      },
      {
        header: Name,
        accessorKey: "candidate_name",
        enableColumnFilter: false,
      },
      {
        header: ContactNumber,
        accessorKey: "contact_no",
        enableColumnFilter: false,
      },
      {
        header: courseName,
        accessorKey: "course.course_name",
        enableColumnFilter: false,
      },
      {
        header: batch,
        accessorKey: "batchAssign.batch.batch_id",
        enableColumnFilter: false,
      },
      {
        header: center,
        accessorKey: "center.center_name",
        enableColumnFilter: false,
      },
      {
        header: Status,
        accessorKey: "batchAssign.status",
        enableColumnFilter: false,
      },
      {
        header: reference,
        accessorKey: "reference",
        enableColumnFilter: false,
      },
      {
        header: Action,
        accessorKey: "action",
        enableSorting: true,
        cell: (cell) => {
          return (
            <div className="d-flex justify-content-center icon">
              <span title="Change Status">
                <RiCheckboxCircleLine
                  className={`fs-5 text-primary mx-2 ${
                    cell?.row?.original?.batchAssign === null && "icon-disabled"
                  }`}
                  onClick={() => toggleStatus(cell?.row?.original?.id)}
                />
              </span>
              <span title="View">
                <RiEyeFill
                  className="fs-5 text-success"
                  onClick={() => ViewCandidate(cell?.row?.original?.id)}
                />
              </span>
            </div>
          );
        },
        enableColumnFilter: false,
      },
    ],
    []
  );

  const statusForm = useFormik({
    initialValues: {
      Status: "",
      certificate: null,
      assessmentDate: null,
    },
    validationSchema: yup.object({
      Status: yup.string().required(validationMessages.required(Status)),
      ...(selectedStatus === CandidateLabel.certified && {
        certificate: yup
          .string()
          .required(validationMessages.required(CandidateLabel.certificate)),
      }),
      ...(selectedStatus === CandidateLabel.assessment && {
        assessmentDate: yup
          .string()
          .required(
            validationMessages.required(CandidateLabel.assessmentDateValidation)
          ),
      }),
    }),
    onSubmit: async (values) => {
      setBtnLoader(true);
      let payload = {
        status: values.Status,
      };
      if (values.Status === CandidateLabel.certified && values.certificate) {
        payload.certificate = values.certificate;
      } else if (
        values.Status === CandidateLabel.assessment &&
        values.assessmentDate
      ) {
        payload.assessment_date = values.assessmentDate;
      }
      await changeStatusApi(statusId, payload)
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
          toggleStatus();
          statusForm.resetForm();
          statusForm.setFieldValue("Status", "");
        });
      statusForm.resetForm();
    },
  });

  const filterForm = useFormik({
    initialValues: {
      center: "",
      course: "",
      batch: "",
      status: "",
    },
  });

  const fetchData = async () => {
    setLoader(true);
    const payload = {
      center_id: filterForm?.values?.center || null,
      course_id: filterForm?.values?.course || null,
      batch_id: filterForm?.values?.batch || null,
      status: filterForm?.values?.status || null,
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    listCandidateApi(payload)
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
        setCandidateData([]);
        return err;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const fetchList = async () => {
    let data;
    const payload = {};
    centerApi(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setCenterData(
            data?.map((item) => ({
              value: item?.id,
              label: item?.center_name,
              id: item?.id,
            }))
          );
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        return err;
      });
  };

  const fetchCourse = async (id) => {
    let data;
    const payload = {
      condition: {
        id: parseInt(id),
      },
    };

    await centerWiseCourse(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data[0]?.centerCourse;
          setCourseData(
            data?.map((item) => ({
              value: item?.course?.id,
              label: item?.course?.course_name,
              id: item?.course?.id,
            }))
          );
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        return err;
      });
  };

  const fetchBatch = async (id) => {
    let data;
    const payload = {
      condition: {
        course_id: id,
      },
    };
    await viewBatch(payload)
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
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        return err;
      });
  };

  useEffect(() => {
    const hasAnyValue = Object.values(filterForm.values).some((value) => value);
    setClearFilter(hasAnyValue);
  }, [filterForm.values]);

  const handleClearFilter = () => {
    filterForm.resetForm();
    setCandidateData([]);
    setBatchData([]);
    setCourseData([]);
    setColumnName("id");
    setSortOrder("DESC");
  };

  useEffect(() => {
    if (filterForm.values.center !== "") {
      fetchData();
    } else {
      setCandidateData([]);
    }
  }, [
    filterForm.values.center,
    filterForm.values.course,
    filterForm.values.status,
    filterForm.values.batch,
    currentPage,
    customPageSize,
    sortOrder,
    columnName,
  ]);

  useEffect(() => {
    fetchList();
  }, []);

  const handleStatusChange = (field, value) => {
    setSelectedStatus(value);
    statusForm.setFieldValue(field, value);
  };
  let fileName;
  let file;
  const fileUploads = () => {
    setLoader(true);
    const formData = new FormData();
    formData.append("files", file);
    fileUploadApi(formData)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          statusForm.setFieldValue(fileName, resp?.data[0]);
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
  const handleFileChange = (e, name) => {
    fileName = name;
    file = e?.target?.files[0];
    if (file && file.size > 1024 * 1024) {
      toast.error(validationMsg);
      return;
    } else {
      fileUploads();
    }
  };

  return (
    <div className="page-body">
      {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
      <BaseModal
        size="sm"
        isOpen={modalStatus}
        title="Change Status"
        toggler={toggleStatus}
        submitText="Submit"
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
              handleStatusChange(field, value);
            }}
            handleBlur={statusForm.handleBlur}
            value={statusForm.values.Status}
            touched={statusForm.touched.Status}
            error={statusForm.errors.Status}
          />
          {selectedStatus === CandidateLabel.certified && (
            <>
              <BaseInput
                label={CandidateLabel.uploadCertificate}
                name="certificate"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className="form-control"
                handleChange={(e) => handleFileChange(e, e.target.name)}
                value={statusForm.values.certificate}
                touched={statusForm.touched.certificate}
                error={statusForm.errors.certificate}
              />
            </>
          )}

          {selectedStatus === CandidateLabel.assessment && (
            <>
              <BaseInput
                label={CandidateLabel.assessmentDate}
                name="assessmentDate"
                type="date"
                className="form-control"
                handleChange={(event) => {
                  statusForm.setFieldValue(
                    "assessmentDate",
                    event.target.value
                  );
                }}
                value={statusForm.values.assessmentDate}
                touched={statusForm.touched.assessmentDate}
                error={statusForm.errors.assessmentDate}
              />
            </>
          )}
        </>
      </BaseModal>

      <div className="card mb-2">
        <div className="container-fluid">
          <div className="row d-flex align-items-center px-2">
            <div className="d-flex justify-content-start pt-2">
              <h6>Filters</h6>
            </div>
            <div className="col-12 d-md-flex justify-content-between">
              <div className="col-12 col-md-3">
                <BaseSelect
                  name="center"
                  label={center}
                  className="select-border"
                  options={centerData}
                  placeholder={SelectPlaceHolder(center)}
                  handleChange={(field, value) => {
                    filterForm.setFieldValue(field, value);
                    fetchCourse(value);
                    setCourseData([]);
                    setBatchData([]);
                  }}
                  value={filterForm.values.center}
                />
              </div>
              <div className="col-12 col-md-2">
                <BaseSelect
                  name="course"
                  label={courseName}
                  className="select-border"
                  options={courseData}
                  placeholder={SelectPlaceHolder(courseName)}
                  handleChange={(field, value) => {
                    filterForm.setFieldValue(field, value);
                    fetchBatch(value);
                  }}
                  value={filterForm.values.course}
                />
              </div>
              <div className="col-12 col-md-3">
                <BaseSelect
                  name="batch"
                  label={batch}
                  className="select-border"
                  options={batchData}
                  placeholder={SelectPlaceHolder(batch)}
                  handleChange={(field, value) => {
                    filterForm.setFieldValue(field, value);
                  }}
                  value={filterForm.values.batch}
                />
              </div>
              <div className="col-12 col-md-3">
                <BaseSelect
                  name="status"
                  label={Status}
                  className="select-border"
                  options={StatusOptions}
                  placeholder={SelectPlaceHolder(Status)}
                  handleChange={(field, value) => {
                    filterForm.setFieldValue(field, value);
                  }}
                  value={filterForm.values.status}
                />
              </div>
            </div>
            <div className="d-flex justify-content-end pb-2">
              {clearFilter && (
                <BaseButton
                  onClick={handleClearFilter}
                  children={ClearFilter}
                  color="danger"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="py-0 px-3">
        <h5 className="f-w-600">Candidate List</h5>
      </div>
      <div className="card">
        <div className="card-body py-2 px-3">
          {candidateData && candidateData?.length > 0 && (
            <div className="table-responsive">
              <TableContainer
                isGlobalFilter={true}
                totalPages={totalPages}
                totalRecords={totalRecords}
                totalNumberOfRows={totalNumberOfRows}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                fetchData={handleFetchData}
                fetchSortingData={handleFetchSorting}
                customPageSize={customPageSize}
                setCustomPageSize={setCustomPageSize}
                data={candidateData || []}
                columns={columns}
                manualPagination={true}
                tableClass="table table-bordered text-center"
                SearchPlaceholder={Search}
              />
            </div>
          )}
          {!loader && candidateData?.length === 0 && (
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

export default Candidate;
