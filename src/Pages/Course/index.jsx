import React, { useEffect, useMemo, useRef, useState } from "react";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseButton from "../../BaseComponents/BaseButton/index";
import TableContainer from "../../BaseComponents/BaseTable";
import { center, courseName } from "../../Constant/Inquiry/Inquiry";
import { RiEditFill, RiDeleteBin7Fill, RiSearchLine } from "react-icons/ri";
import {
  positiveNumberRegex,
  SelectPlaceHolder,
  validationMessages,
} from "../../Constant/validation";
import {
  Action,
  Duration,
  DurationHr,
  Loading,
  Search,
  Submit,
  Update,
  notFound,
} from "../../Constant";
import Spinner from "../../BaseComponents/BaseLoader/index";
import * as yup from "yup";
import { useFormik } from "formik";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import BaseModal from "../../BaseComponents/BaseModal";
import { DeleteMessage, SrNo } from "../../Constant/Center";
import { centerApi, fileUploadApi } from "../../Api/common";
import {
  addCourseApi,
  deleteCourseApi,
  editCourseApi,
  listCourseApi,
  viewCourseApi,
} from "../../Api/CourseApi";
import {
  CourseDetail,
  CourseDetailUrl,
  CourseHours,
  CourseImage,
  CourseList,
  Rate,
  RateHurs,
  Seat,
  ViewImage,
  qp_code,
} from "../../Constant/Course";
import MultiSelect from "../../BaseComponents/BaseSelect/MultiSelect";
import { BaseImageURL } from "../../Api/Service";
import { Link } from "react-router-dom";
import { Label } from "reactstrap";
import { handleEditClick } from "../../Constant/common";
import { courseTitle } from "../../Constant/title";

const CoursePage = () => {
  document.title = courseTitle;
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [selectedMulti, setSelectedMulti] = useState();
  const [centerList, setCenterList] = useState();
  const [courseList, setCourseList] = useState();
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [editId, setEditId] = useState(null);
  const [courseId, setCourseId] = useState();
  const [editData, setEditData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [modal, setModal] = useState(false);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const ref = useRef();

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };
  const toggle = (id) => {
    setCourseId(id);
    setModal(!modal);
  };

  const editCourse = (id) => {
    setEditId(id);
    viewCourse(id);
  };

  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  const fetchData = async (id) => {
    setLoader(true);
    let data;
    const payload = {
      order: [columnName, sortOrder],
      condition: {
        id: id,
      },
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    const empyPayload = {
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    listCourseApi(id !== null ? payload : empyPayload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          if (id !== null) {
            setEditData(resp?.data?.listOfCenter[0]);
          } else {
            setCourseList(resp?.data?.listOfCourse);
            setTotalRecords(resp.data.totalRecordsCount);
            setTotalPages(resp?.data?.totalPages);
            setTotalNumberOfRows(resp?.data?.numberOfRows);
            toast.error(resp?.message);
          }
        }
      })
      .catch((err) => {
        return err;
      })
      .finally(() => {
        setLoader(false);
      });

    centerApi({})
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setCenterList(
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
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const deleteCourse = async () => {
    setDeleteLoader(true);
    await deleteCourseApi(courseId)
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
        fetchData(null);
      });
  };

  const viewCourse = async (id) => {
    setLoader(true);
    await viewCourseApi(id)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setEditData(resp?.data);
          let data = resp?.data?.centerCourse;
          let editCenter = data?.map((item) => ({
            value: item?.center_id,
            label: item?.center?.center_name,
            id: item?.center_id,
          }));
          handleMulti(editCenter);
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
      })
      .finally(() => {
        setLoader(false);
        fetchData(null);
      });
  };

  const courseForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      center_id:
        editId !== null
          ? editData?.centerCourse?.map((item) => item?.center_id)
          : null,
      course_name: editId !== null ? editData?.course_name : "",
      duration: editId !== null ? editData?.duration : "",
      qp_code: editId !== null ? editData?.qp_code : "",
      seat: editId !== null ? editData?.seat : "",
      course_detail: editId !== null ? editData?.course_detail : "",
      course_rate: editId !== null ? editData?.course_rate : "",
      course_hours: editId !== null ? editData?.course_hours : "",
      course_image: editId !== null ? editData?.course_image : "",
    },
    validationSchema: yup.object({
      center_id: yup.array().required(validationMessages.required(center)),
      course_name: yup
        .string()
        .required(validationMessages.required(courseName)),
      duration: yup.string().required(validationMessages.required(Duration)),
      qp_code: yup.string().required(validationMessages.required(qp_code)),
      seat: yup.string().required(validationMessages.required(Seat)),
      course_detail: yup
        .string()
        .url(validationMessages.url(CourseDetail))
        .required(validationMessages.required(CourseDetail)),
      course_image: yup
        .string()
        .required(validationMessages.required(CourseImage)),
      course_rate: yup
        .string()
        .required(validationMessages.required(Rate))
        .matches(positiveNumberRegex, validationMessages.positiveNumber(Rate)),
      course_hours: yup
        .string()
        .required(validationMessages.required(CourseHours))
        .matches(
          positiveNumberRegex,
          validationMessages.positiveNumber(CourseHours)
        ),
    }),
    onSubmit: (values) => {
      setBtnLoader(true);
      const payload = {
        center_id: values.center_id,
        course_name: values.course_name,
        duration: values.duration,
        qp_code: values.qp_code,
        seat: values.seat,
        course_detail: values.course_detail,
        course_rate: values.course_rate,
        course_hours: values.course_hours,
        course_image: values.course_image,
      };

      if (editId !== null) {
        editCourseApi(editId, payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp?.message);
              fetchData(null);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
          })
          .finally(() => {
            setEditId(null);
            setBtnLoader(false);
            handleMulti(null);
            handleFileChange(null);
            courseForm.resetForm();
            ref.current.value = "";
          });
      } else {
        addCourseApi(payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp?.message);
              fetchData(null);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
          })
          .finally(() => {
            setBtnLoader(false);
            handleMulti(null);
            handleFileChange(null);
            courseForm.resetForm();
            ref.current.value = "";
          });
      }
    },
  });

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
        header: courseName,
        accessorKey: "course_name",
        enableColumnFilter: false,
      },
      {
        header: qp_code,
        accessorKey: "qp_code",
        enableColumnFilter: false,
      },
      {
        header: DurationHr,
        accessorKey: "duration",
        enableColumnFilter: false,
      },
      {
        header: Seat,
        accessorKey: "seat",
        enableColumnFilter: false,
      },
      {
        header: CourseDetail,
        accessorKey: "course_detail",
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
                onClick={() => {
                  editCourse(cell?.row?.original?.id);
                  handleEditClick();
                }}
                title="Edit"
              />
            </span>
            <span>
              <RiDeleteBin7Fill
                className={`fs-5 text-danger ${
                  cell?.row?.original?.status === "Pending"
                    ? `icon-disabled`
                    : ``
                }`}
                onClick={() => toggle(cell?.row?.original?.id)}
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

  function handleMulti(selectedMulti) {
    const ids =
      selectedMulti?.length > 0
        ? selectedMulti?.map((item) => {
            return item.value;
          })
        : null;
    setSelectedMulti(selectedMulti);
    courseForm.setFieldValue("center_id", ids);
  }
  useEffect(() => {
    fetchData(null);
  }, [currentPage, customPageSize, columnName, sortOrder]);

  const fileupload = (file) => {
    setLoader(true);
    const payload = new FormData();
    payload.append("files", file);
    fileUploadApi(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          courseForm.setFieldValue("course_image", resp?.data[0]);
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

  const handleFileChange = (e) => {
    const file = e?.target?.files[0];
    if (file) {
      fileupload(file);
    }
  };
  return (
    <>
      <div className="px-3">
        <h5 className="f-w-600">{courseName}</h5>
      </div>
      <BaseModal
        isOpen={modal}
        title="Delete"
        toggler={toggle}
        submit={() => deleteCourse()}
        submitText="Delete"
        disabled={deleteLoader}
        loader={deleteLoader}
      >
        {DeleteMessage}
      </BaseModal>
      <div className="card p-4 rounded mb-0 mx-3">
        <form onSubmit={courseForm.handleSubmit}>
          <div className="row">
            <div className="col-lg-12 row">
              <div className="col-lg-3">
                <MultiSelect
                  label={center}
                  name="center_id"
                  className="select-border"
                  value={selectedMulti || null}
                  onChange={handleMulti}
                  placeholder={SelectPlaceHolder(center)}
                  options={centerList}
                  touched={courseForm.touched.center_id}
                  error={courseForm.errors.center_id}
                  handleBlur={courseForm.handleBlur}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="course_name"
                  type="text"
                  label={courseName}
                  placeholder={PlaceHolderFormat(courseName)}
                  value={courseForm.values.course_name}
                  touched={courseForm.touched.course_name}
                  error={courseForm.errors.course_name}
                  handleBlur={courseForm.handleBlur}
                  handleChange={courseForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="qp_code"
                  type="text"
                  label={qp_code}
                  placeholder={PlaceHolderFormat(qp_code)}
                  value={courseForm.values.qp_code}
                  touched={courseForm.touched.qp_code}
                  error={courseForm.errors.qp_code}
                  handleBlur={courseForm.handleBlur}
                  handleChange={courseForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="duration"
                  type="number"
                  label={DurationHr}
                  step="0.01"
                  placeholder={PlaceHolderFormat(Duration)}
                  value={courseForm.values.duration}
                  touched={courseForm.touched.duration}
                  error={courseForm.errors.duration}
                  handleBlur={courseForm.handleBlur}
                  handleChange={courseForm.handleChange}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 row">
              <div className="col-lg-3">
                <BaseInput
                  name="seat"
                  type="number"
                  label={Seat}
                  placeholder={PlaceHolderFormat(Seat)}
                  value={courseForm.values.seat}
                  touched={courseForm.touched.seat}
                  error={courseForm.errors.seat}
                  handleBlur={courseForm.handleBlur}
                  handleChange={courseForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="course_detail"
                  type="text"
                  label={CourseDetailUrl}
                  placeholder={PlaceHolderFormat(CourseDetail)}
                  value={courseForm.values.course_detail}
                  touched={courseForm.touched.course_detail}
                  error={courseForm.errors.course_detail}
                  handleBlur={courseForm.handleBlur}
                  handleChange={courseForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="course_rate"
                  type="number"
                  label={RateHurs}
                  placeholder={PlaceHolderFormat(Rate)}
                  value={courseForm.values.course_rate}
                  touched={courseForm.touched.course_rate}
                  error={courseForm.errors.course_rate}
                  handleBlur={courseForm.handleBlur}
                  handleChange={courseForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="course_hours"
                  type="number"
                  label={CourseHours}
                  placeholder={PlaceHolderFormat(CourseHours)}
                  value={courseForm.values.course_hours}
                  touched={courseForm.touched.course_hours}
                  error={courseForm.errors.course_hours}
                  handleBlur={courseForm.handleBlur}
                  handleChange={courseForm.handleChange}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3">
              {/* ReactStrap Input Is not Working so that's why i have use Input */}
              <Label className="d-block">{CourseImage}</Label>
              <input
                type="file"
                name="course_image"
                accept="image/*"
                ref={ref}
                onChange={handleFileChange}
              />
              {courseForm.errors.course_image && (
                <div className="text-danger">
                  {courseForm.errors.course_image}
                </div>
              )}
            </div>
            {courseForm.values.course_image?.length > 0 && (
              <span className="fw-normal">
                <Link
                  target="_blank"
                  className="text-dark"
                  to={`${BaseImageURL}${courseForm.values.course_image}`}
                >
                  {ViewImage}
                </Link>
              </span>
            )}
          </div>
          <div className="row col-lg-12">
            <div className="d-flex justify-content-end align-items-end mt-2">
              <BaseButton
                className="btn btn-pill"
                type="submit"
                disabled={btnLoader}
                loader={btnLoader}
                children={
                  editId !== null ? (btnLoader ? Loading : Update) : Submit
                }
              />
            </div>
          </div>
        </form>
      </div>
      <div className="col-6 py-2 px-3">
        <h5 className="f-w-600">{CourseList}</h5>
      </div>
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {courseList && courseList?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              fetchData={handleFetchData}
              fetchSortingData={handleFetchSorting}
              customPageSize={customPageSize}
              setCustomPageSize={setCustomPageSize}
              columns={columns}
              data={searchValue ? [] : courseList || []}
              isGlobalFilter={true}
              manualPagination={true}
              tableClass="table table-bordered text-center"
              onSearch={handleSearchValueChange}
              SearchPlaceholder={Search}
            />
          )}
          {!loader && !courseList && (
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

export default CoursePage;
