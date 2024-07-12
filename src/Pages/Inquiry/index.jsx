import React, { useEffect, useMemo, useState } from "react";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseButton from "../../BaseComponents/BaseButton/index";
import BaseSelect from "../../BaseComponents/BaseSelect";
import TableContainer from "../../BaseComponents/BaseTable";
import { RiEditFill, RiAddBoxFill, RiSearchLine } from "react-icons/ri";
import {
  ACCESSOR_KEYS,
  EndoreMessage,
  Source,
  center,
  course,
  errorMessageEndorse,
  inquiry,
  reference,
} from "../../Constant/Inquiry/Inquiry";
import {
  Action,
  Address,
  CandidateName,
  ContactNumber,
  Loading,
  Search,
  Status,
  Submit,
  notFound,
} from "../../Constant";
import Spinner from "../../BaseComponents/BaseLoader/index";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  SelectPlaceHolder,
  digitRegex,
  numberRegex,
  validationMessages,
} from "../../Constant/validation";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import { centerApi, centerWiseCourse } from "../../Api/common";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import { addInquiry, endorseApi, listInquiryApi } from "../../Api/Inquiry";
import { useNavigate } from "react-router-dom";
import BaseModal from "../../BaseComponents/BaseModal";
import { SrNo } from "../../Constant/Center";
import { inquiryTitle } from "../../Constant/title";

const Inquiry = () => {
  document.title = inquiryTitle;
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [endorseLoader, setEndorseLoader] = useState(false);
  const [inquiryList, setInquiryList] = useState();
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [centerData, setCenterData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [endorseId, setEndorseId] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [modal, setModal] = useState(false);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [error, setError] = useState([]);
  const [errorModal, setErrorModal] = useState(false);

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };
  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  const toggle = (id) => {
    setEndorseId(id);
    setModal(!modal);
  };

  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  const fetchData = async () => {
    setLoader(true);
    const payload = {
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    let data;

    await centerApi({})
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
        }
      })
      .catch((err) => {
        return err;
      });

    await listInquiryApi(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setInquiryList(resp?.data?.listOfInquiry);
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

  const endorse = async () => {
    setEndorseLoader(true);
    await endorseApi(endorseId)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          toast.success(resp?.message);
          fetchData();
        } else {
          toast.error(resp?.message);
          setError(resp?.message);
          setErrorModal(true);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
      })
      .finally(() => {
        setEndorseLoader(false);
        toggle();
        fetchData();
      });
  };

  const fetchCourse = (id) => {
    setLoader(true);
    const payload = {
      condition: {
        id: id,
      },
    };
    centerWiseCourse(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          const data = resp?.data;
          const courses = data?.flatMap((center) =>
            center?.centerCourse?.map((item) => ({
              value: item.course.id,
              label: item.course.course_name,
              id: item.course.id,
            }))
          );
          setCourseData(courses);
        }
      })
      .catch((err) => {
        return err;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const inquiryForm = useFormik({
    initialValues: {
      candidate_name: "",
      contact_no: "",
      address: "",
      center: "",
      course: "",
      reference: "",
    },
    validationSchema: yup.object({
      candidate_name: yup
        .string()
        .required(validationMessages.required(CandidateName)),
      contact_no: yup
        .string()
        .required(validationMessages.required(ContactNumber))
        .matches(
          numberRegex,
          validationMessages.contactLength(ContactNumber, 10)
        ),
      address: yup.string().required(validationMessages.required(Address)),
      center: yup.string().required(validationMessages.required(center)),
      course: yup.string().required(validationMessages.required(course)),
    }),
    onSubmit: (values) => {
      setBtnLoader(true);
      const payload = {
        candidate_name: values.candidate_name,
        contact_no: `${values.contact_no}`,
        address: values.address,
        center_id: values.center,
        course_id: values.course,
        reference: values.reference,
      };

      addInquiry(payload)
        .then((resp) => {
          if (
            resp?.statusCode === StatusCodes.ACCEPTED ||
            resp?.statusCode === StatusCodes.OK ||
            resp?.statusCode === StatusCodes.CREATED
          ) {
            toast.success(resp.message);
            fetchData();
            inquiryForm.resetForm();
          } else {
            toast.error(resp?.message);
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || err?.message);
        })
        .finally(() => {
          setBtnLoader(false);
        });
    },
  });

  const columns = useMemo(
    () => [
      {
        header: SrNo,
        accessorKey: ACCESSOR_KEYS.SERIAL_NUMBER,
        cell: (cell) => cell.row.index + 1,
        enableColumnFilter: false,
      },
      {
        header: CandidateName,
        accessorKey: ACCESSOR_KEYS.CANDIDATE_NAME,
        enableColumnFilter: false,
      },
      {
        header: ContactNumber,
        accessorKey: ACCESSOR_KEYS.CONTACT_NO,
        enableColumnFilter: false,
      },
      {
        header: center,
        accessorKey: ACCESSOR_KEYS.CENTER_NAME,
        enableColumnFilter: false,
      },
      {
        header: course,
        accessorKey: ACCESSOR_KEYS.COURSE_NAME,
        enableColumnFilter: false,
      },
      {
        header: Source,
        accessorKey: ACCESSOR_KEYS.SOURCE,
        enableColumnFilter: false,
      },
      {
        header: reference,
        accessorKey: ACCESSOR_KEYS.REFERENCE,
        enableColumnFilter: false,
      },
      {
        header: Status,
        accessorKey: ACCESSOR_KEYS.STATUS,
        enableColumnFilter: false,
      },
      {
        header: Action,
        accessorKey: ACCESSOR_KEYS.ACTION,
        cell: (cell) => (
          <div className="d-flex justify-content-center icon">
            <span>
              <RiEditFill
                className="fs-5 text-primary mx-2"
                onClick={() => {
                  navigate(`/editinquiry/${cell?.row?.original?.id}`);
                }}
                title="Edit Inquiry"
              />
            </span>
            <span>
              <RiAddBoxFill
                className={`fs-5 text-success ${
                  cell?.row?.original?.status === "Pending"
                    ? `icon-disabled`
                    : ``
                }`}
                onClick={() => toggle(cell?.row?.original?.id)}
                title="Endorse"
                disabled={
                  cell?.row?.original?.status === "Pending" ? true : false
                }
              />
            </span>
          </div>
        ),
        enableColumnFilter: false,
      },
    ],
    []
  );

  useEffect(() => {
    fetchData();
  }, [currentPage, customPageSize, sortOrder, columnName]);

  return (
    <>
      <div className="px-3">
        <h5 className="f-w-600">{inquiry}</h5>
      </div>
      <BaseModal
        isOpen={modal}
        title="Endorse"
        toggler={toggle}
        submit={() => endorse()}
        submitText="Endorse"
        disabled={endorseLoader}
        loader={endorseLoader}
      >
        {EndoreMessage}
      </BaseModal>
      <div className="card p-4 rounded mb-0 mx-3">
        <form onSubmit={inquiryForm.handleSubmit}>
          <div className="row">
            <div className="col-lg-12 row">
              <div className="col-lg-3">
                <BaseInput
                  name="candidate_name"
                  type="text"
                  label={CandidateName}
                  placeholder={PlaceHolderFormat(CandidateName)}
                  value={inquiryForm.values.candidate_name}
                  touched={inquiryForm.touched.candidate_name}
                  error={inquiryForm.errors.candidate_name}
                  handleBlur={inquiryForm.handleBlur}
                  handleChange={inquiryForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="contact_no"
                  type="number"
                  label={ContactNumber}
                  placeholder={PlaceHolderFormat(ContactNumber)}
                  value={inquiryForm.values.contact_no}
                  touched={inquiryForm.touched.contact_no}
                  error={inquiryForm.errors.contact_no}
                  handleBlur={inquiryForm.handleBlur}
                  handleChange={(e) => {
                    if (
                      e?.target?.value?.length <= 10 &&
                      digitRegex.test(e.target.value)
                    ) {
                      inquiryForm.handleChange(e);
                    }
                  }}
                />
              </div>
              <div className="col-lg-3">
                <BaseSelect
                  name="center"
                  label={center}
                  className="select-border"
                  options={centerData}
                  placeholder={SelectPlaceHolder(center)}
                  handleChange={(field, value) => {
                    inquiryForm.setFieldValue(field, value);
                    fetchCourse(value);
                  }}
                  handleBlur={() => inquiryForm.setFieldTouched(center, true)}
                  value={inquiryForm.values.center}
                  touched={inquiryForm.touched.center}
                  error={inquiryForm.errors.center}
                />
              </div>
              <div className="col-lg-3">
                <BaseSelect
                  name="course"
                  label={course}
                  className="select-border"
                  options={courseData}
                  placeholder={SelectPlaceHolder(course)}
                  handleChange={(field, value) => {
                    inquiryForm.setFieldValue(field, value);
                  }}
                  handleBlur={() => inquiryForm.setFieldTouched(course, true)}
                  value={inquiryForm.values.course}
                  touched={inquiryForm.touched.course}
                  error={inquiryForm.errors.course}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 row">
              <div className="col-lg-3">
                <BaseInput
                  name="address"
                  type="textarea"
                  label={Address}
                  placeholder={PlaceHolderFormat(Address)}
                  value={inquiryForm.values.address}
                  touched={inquiryForm.touched.address}
                  error={inquiryForm.errors.address}
                  handleBlur={inquiryForm.handleBlur}
                  handleChange={inquiryForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="reference"
                  type="text"
                  label={reference}
                  placeholder={PlaceHolderFormat(reference)}
                  value={inquiryForm.values.reference}
                  touched={inquiryForm.touched.reference}
                  error={inquiryForm.errors.reference}
                  handleBlur={inquiryForm.handleBlur}
                  handleChange={inquiryForm.handleChange}
                />
              </div>

              <div className="col-lg-12 d-flex justify-content-end align-items-end mt-2">
                <div className="">
                  <BaseButton
                    className="btn btn-pill"
                    type="submit"
                    disabled={btnLoader}
                    loader={btnLoader}
                    children={btnLoader ? Loading : Submit}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="col-6 py-2 px-3">
        <h5 className="f-w-600">{inquiry} List</h5>
      </div>
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {inquiryList && inquiryList?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              fetchData={handleFetchData}
              customPageSize={customPageSize}
              setCustomPageSize={setCustomPageSize}
              columns={columns}
              tableClass="table table-bordered"
              data={searchValue ? [] : inquiryList || []}
              isGlobalFilter={true}
              manualPagination={true}
              onSearch={handleSearchValueChange}
              fetchSortingData={handleFetchSorting}
              SearchPlaceholder={Search}
            />
          )}
          {!loader && !inquiryList && (
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
        <BaseModal
          isOpen={errorModal}
          toggler={() => setErrorModal(false)}
          title={errorMessageEndorse}
          submitText="Submit"
          hasSubmitButton={false}
          bodyClass="endorse-error-modal"
        >
          <ul className="list-group list-group-flush">
            {error?.map((errorMessage, index) => (
              <li key={index} className="list-group-item text-danger">
                {index + 1}. {errorMessage}
              </li>
            ))}
          </ul>
        </BaseModal>
      </div>
    </>
  );
};

export default Inquiry;
