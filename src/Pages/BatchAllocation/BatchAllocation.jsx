import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, FormGroup, Form } from "reactstrap";
import BaseButton from "../../BaseComponents/BaseButton";
import BaseInput from "../../BaseComponents/BaseInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  InputPlaceHolder,
  SelectPlaceHolder,
  validationMessages,
} from "../../Constant/validation";
import TableContainer from "../../BaseComponents/BaseTable";
import {
  batchallocationLabel,
  batchallocationValidation,
  editBatchLable,
} from "../../Constant/BatchAllocation/batchallocation";
import BaseCheckbox from "../../BaseComponents/BaseCheckbox";
import {
  AddBatch,
  courseCodeList,
  courseCodeQPList,
  ListOfCandidate,
} from "../../Api/BatchApi";
import { toast } from "react-toastify";
import { StatusCodes } from "http-status-codes";
import BaseSelect from "../../BaseComponents/BaseSelect";
import Spinner from "../../BaseComponents/BaseLoader";
import { useNavigate } from "react-router-dom";
import BaseModal from "../../BaseComponents/BaseModal";
import { centerApi } from "../../Api/common";
import { RiSearchLine } from "react-icons/ri";
import { notFound } from "../../Constant";

const BatchAllocation = () => {
  document.title = batchallocationLabel.title;
  const [courseData, setCourseData] = useState();
  const [candidateData, setCandidateData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [storQpCode, setStoreQpCode] = useState(null);
  const [loader, setLoader] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const history = useNavigate();
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [btnLoader, setBtnLoader] = useState(false);
  const [centerData, setCenterData] = useState();
  const [selectedCenter, setSelectedCenter] = useState("");
  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckItem = (id) => {
    const isAlreadyChecked = checkedItems?.includes(id);
    const updatedCheckedItems = isAlreadyChecked
      ? checkedItems?.filter((itemId) => itemId !== id)
      : [...checkedItems, id];
    setCheckedItems(updatedCheckedItems);

    // Update isCheckedAll based on the updatedCheckedItems length
    setIsCheckedAll(updatedCheckedItems?.length === candidateData?.length);
  };

  useEffect(() => {
    if (isCheckedAll && candidateData?.length > 0) {
      const allCandidateIds = candidateData?.map((item) => item.id);
      setCheckedItems(allCandidateIds);
    }
  }, [isCheckedAll, candidateData]);

  // Function to handle checking or unchecking all checkboxes
  const handleCheckAll = () => {
    setIsCheckedAll(!isCheckedAll);
    const updatedCheckedItems = isCheckedAll
      ? []
      : candidateData?.map((item) => item.id);
    setCheckedItems(updatedCheckedItems);
  };

  let isCreateButtonDisabled = checkedItems?.length === 0;

  const fetchData = () => {
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
              qpCode: item?.qp_code,
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
    centerApi()
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          let data = resp?.data;
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
  const handleCenterChange = (field, value) => {
    if (value !== selectedCenter) {
      setCandidateData([]);
      setSelectedCourse("");
    }
    setIsCheckedAll(false);
    setCheckedItems([]);
    setSelectedCenter(value);
    fetchCoursesByCenter(value);
  };

  const fetchCoursesByCenter = (centerId) => {
    setIsCheckedAll(false);
    setCheckedItems([]);
    setLoader(true);
    const payload = {
      condition: {
        id: centerId,
      },
    };
    courseCodeQPList(payload)
      .then((res) => {
        if (
          res.statusCode === StatusCodes.ACCEPTED ||
          res.statusCode === StatusCodes.OK ||
          res.statusCode === StatusCodes.CREATED
        ) {
          let data = res?.data[0].centerCourse;
          setCourseData(
            data?.map((item) => ({
              value: item?.course?.id,
              label: item?.course?.course_name,
              qpCode: item?.course?.qp_code,
              id: item?.course?.id,
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

  useEffect(() => {
    handleCourseChange(
      selectedCourse,
      customPageSize,
      currentPage,
      sortOrder,
      columnName
    );
  }, [selectedCourse, customPageSize, currentPage, sortOrder, columnName]);

  const handleCourseChange = (selectedOption) => {
    setLoader(true);
    const selectedCourseObject = courseData?.find(
      (course) => course?.value === selectedOption
    );
    setStoreQpCode(selectedCourseObject?.qpCode);
    setSelectedCourse(selectedOption);
    if (selectedOption) {
      const courseId = selectedOption;
      const payload = {
        order: [columnName, sortOrder],
        courseId: courseId,
        centerId: selectedCenter,
        is_batch_assign: false,
        pageNumber: currentPage,
        pageSize: customPageSize,
      };
      ListOfCandidate(payload)
        .then((res) => {
          if (
            res.statusCode === StatusCodes.ACCEPTED ||
            res.statusCode === StatusCodes.OK ||
            res.statusCode === StatusCodes.CREATED
          ) {
            const candidates = res?.data?.candidate || [];
            setCandidateData(candidates);
            setTotalPages(res?.data?.totalPages);
            setTotalRecords(res?.data?.totalRecordsCount);
            setTotalNumberOfRows(res?.data?.numberOfRows);
            setCurrentPage(res?.data?.currentPage);
          } else {
            toast.error(res?.message);
          }
        })
        .catch((err) => {
          setCandidateData([]);
          return err;
        })
        .finally(() => {
          setLoader(false);
        });
    }
  };

  const columns = useMemo(
    () => [
      {
        header: (
          <BaseCheckbox
            id="checkBoxAll"
            checked={isCheckedAll}
            onChange={() => handleCheckAll()}
            className="custom-checkbox-class d-flex justify-content-center"
            labelClassName="custom-label-class"
          />
        ),
        cell: (cell) => (
          <BaseCheckbox
            id={`checkbox${cell.row.original.id}`}
            checked={
              checkedItems.includes(cell.row.original.id) || isCheckedAll
            }
            onChange={() => handleCheckItem(cell.row.original.id)}
            className="custom-checkbox-class d-flex justify-content-center taskCheckBox"
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      batchName: "",
      startDate: "",
      endDate: "",
      no_of_student: "",
      duration: "",
      startTime: "",
      endTime: "",
      qp_code: storQpCode || "",
    },
    validationSchema: Yup.object().shape({
      batchName: Yup.string().required(
        validationMessages.required(
          batchallocationValidation.batchNameValidation
        )
      ),
      startDate: Yup.string().required(
        validationMessages.required(
          batchallocationValidation.startDateValidation
        )
      ),
      endDate: Yup.string()
        .required(
          validationMessages.required(
            batchallocationValidation.endDateValidation
          )
        )
        .when("startDate", (startDate, schema) => {
          return schema.test({
            name: "endDate",
            exclusive: false,
            message: editBatchLable.dateValidation,
            test: function (value) {
              if (!value || !startDate) return true;
              return new Date(value) > new Date(startDate);
            },
          });
        }),
      startTime: Yup.string().required(
        validationMessages.required(
          batchallocationValidation.startTimeValidation
        )
      ),
      endTime: Yup.string()
      .required(validationMessages.required(batchallocationValidation.endTimeValidation))
      .test('is-greater', batchallocationValidation.endTime, function(value) {
        const { startTime } = this.parent;
        return !startTime || !value || new Date(`1970-01-01T${value}`) > new Date(`1970-01-01T${startTime}`);
      }),
  
      duration: Yup.string().required(
        validationMessages.required(
          batchallocationValidation.durationValidation
        )
      ),
      no_of_student: Yup.string().required(
        validationMessages.required(
          batchallocationValidation.noOfCandidateValidation
        )
      ),
      qp_code: Yup.string().required(
        validationMessages.required(batchallocationLabel.qpCode)
      ),
    }),
    onSubmit: (values, { resetForm }) => {
      setBtnLoader(true);
      const payload = {
        course_id: selectedCourse,
        center_id: selectedCenter,
        batch_id: values.batchName,
        start_date: values.startDate,
        end_date: values.endDate,
        candidate_id: checkedItems,
        no_of_student: values.no_of_student,
        batch_duration: values.duration,
        batch_start_time: values.startTime,
        batch_end_time: values.endTime,
        qp_code: storQpCode,
      };
      AddBatch(payload)
        .then((resp) => {
          setLoader(true);
          if (
            resp.statusCode === StatusCodes.ACCEPTED ||
            resp.statusCode === StatusCodes.OK ||
            resp.statusCode === StatusCodes.CREATED
          ) {
            setCandidateData(resp?.data);
            toast.success(resp?.message);
            setModalOpen(false);
            setCheckedItems([]);
            setIsCheckedAll(false);
            isCreateButtonDisabled = false;
            resetForm();
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
          setBtnLoader(false);
          formik.resetForm();
          setCheckedItems([]);
          setIsCheckedAll(false);
          isCreateButtonDisabled = false;
        });
    },
  });

  const toggleModal = () => {
    if (!modalOpen) {
      formik.resetForm();
    }
    setModalOpen(!modalOpen);
  };

  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };
  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <Form>
        <div className="py-2 px-3">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          <h5>{batchallocationLabel.title}</h5>
        </div>
        <Card>
          <CardBody className="mb-0 pb-0">
            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                  <div className="col-md-2">
                    <div className="align-items-center">
                      <BaseSelect
                        name="center"
                        label="Select Center"
                        className="select-border"
                        options={centerData}
                        placeholder={SelectPlaceHolder("center")}
                        handleChange={handleCenterChange}
                        value={selectedCenter}
                        isDisabled={false}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="align-items-center">
                      <BaseSelect
                        name="course"
                        label={batchallocationLabel.selectCourse}
                        className="select-border"
                        options={courseData}
                        placeholder={SelectPlaceHolder(
                          batchallocationLabel.course
                        )}
                        handleChange={(field, value) => {
                          handleCourseChange(value);
                        }}
                        value={selectedCourse}
                        isDisabled={false}
                      />
                    </div>
                  </div>
                  <div className="col-md-8  mb-2 d-flex justify-content-md-end align-items-center">
                    <BaseButton
                      onClick={toggleModal}
                      disabled={isCreateButtonDisabled}
                    >
                      {batchallocationLabel.createBtach}
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        <div className="px-3">
          <h5 className="f-w-600">{batchallocationLabel.candidateList}</h5>
        </div>
        <Card>
          <CardBody className="mb-0 pb-0">
            <div className="pt-0">
              {loader ? (
                <Spinner attrSpinner={{ className: "loader-2" }} />
              ) : (
                <div className="card-body pt-0">
                  <div>
                    {candidateData?.length > 0 ? (
                      <TableContainer
                        totalPages={totalPages}
                        totalRecords={totalRecords}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                        fetchData={(page) => handleFetchData(page)}
                        totalNumberOfRows={totalNumberOfRows}
                        columns={columns}
                        data={searchValue ? [] : candidateData || []}
                        isGlobalFilter={true}
                        customPageSize={customPageSize}
                        setCustomPageSize={setCustomPageSize}
                        onSearch={handleSearchValueChange}
                        fetchSortingData={handleFetchSorting}
                        manualPagination={true}
                        tableClass="table table-bordered text-center"
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
                </div>
              )}
            </div>
            <BaseModal
              isOpen={modalOpen}
              toggler={toggleModal}
              title="Create Batch"
              submit={formik.handleSubmit}
              submitText="Create"
              loader={btnLoader}
              disabled={btnLoader}
            >
              <div className="row">
                <div className="col-6">
                  <BaseInput
                    label={batchallocationLabel.batchName}
                    name="batchName"
                    type="text"
                    placeholder={InputPlaceHolder(
                      batchallocationLabel.batchName
                    )}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    value={formik.values.batchName}
                    touched={formik.touched.batchName}
                    error={formik.errors.batchName}
                    passwordToggle={false}
                  />
                </div>
                <FormGroup className="col-6">
                  <BaseInput
                    label={batchallocationLabel.qpCode}
                    name="qp_code"
                    type="text"
                    readOnly
                    disabled={true}
                    value={storQpCode || ""}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    touched={formik.touched.qp_code}
                    error={formik.errors.qp_code}
                  />
                </FormGroup>
              </div>
              <div className="row">
                <FormGroup className="col-6">
                  <BaseInput
                    label={batchallocationLabel.startDate}
                    name="startDate"
                    type="date"
                    value={formik.values.startDate}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    touched={formik.touched.startDate}
                    error={formik.errors.startDate}
                  />
                </FormGroup>
                <FormGroup className="col-6">
                  <BaseInput
                    label={batchallocationLabel.endDate}
                    name="endDate"
                    type="date"
                    value={formik.values.endDate}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    touched={formik.touched.endDate}
                    error={formik.errors.endDate}
                  />
                </FormGroup>
              </div>
              <div className="row">
                <FormGroup className="col-6">
                  <BaseInput
                    label={batchallocationLabel.startTime}
                    name="startTime"
                    type="time"
                    step="0"
                    value={formik.values.startTime}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    touched={formik.touched.startTime}
                    error={formik.errors.startTime}
                  />
                </FormGroup>
                <FormGroup className="col-6">
                  <BaseInput
                    label={batchallocationLabel.endTime}
                    name="endTime"
                    type="time"
                    step="0"
                    value={formik.values.endTime}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    touched={formik.touched.endTime}
                    error={formik.errors.endTime}
                  />
                </FormGroup>
              </div>
              <div className="row">
                <FormGroup className="col-6">
                  <BaseInput
                    label={batchallocationLabel.duration}
                    name="duration"
                    type="number"
                    placeholder={InputPlaceHolder(
                      batchallocationLabel.durationKey
                    )}
                    value={formik.values.duration}
                    handleChange={formik.handleChange}
                    error={formik.errors.duration}
                    touched={formik.touched.duration}
                    handleBlur={formik.handleBlur}
                  />
                </FormGroup>
                <FormGroup className="col-6">
                  <BaseInput
                    label={batchallocationLabel.noOfStudent}
                    name="no_of_student"
                    type="number"
                    placeholder={InputPlaceHolder(
                      batchallocationLabel.noOfStudent
                    )}
                    value={formik.values.no_of_student}
                    error={formik.errors.no_of_student}
                    touched={formik.touched.no_of_student}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                  />
                </FormGroup>
              </div>
            </BaseModal>
          </CardBody>
        </Card>
      </Form>
    </div>
  );
};

export default BatchAllocation;
