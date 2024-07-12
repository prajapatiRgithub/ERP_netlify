import React, { useEffect, useMemo, useState } from "react";
import {
  listOfStaffApi,
  viewStaffApi,
  addStaffApi,
  editStaffApi,
  deleteStaffApi,
} from "../../Api/StaffApi";
import TableContainer from "../../BaseComponents/BaseTable";
import { Action, Loading, Submit, Update, notFound } from "../../Constant";
import Spinner from "../../BaseComponents/BaseLoader";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseSelect from "../../BaseComponents/BaseSelect";
import {
  SelectPlaceHolder,
  digitRegex,
  numberRegex,
  validationMessages,
} from "../../Constant/validation";
import BaseButton from "../../BaseComponents/BaseButton";
import { RiEditFill, RiEyeLine, RiDeleteBin7Fill, RiSearchLine } from "react-icons/ri";
import { qualificationApi } from "../../Api/common";
import { listOfPositionApi } from "../../Api/positionApi";
import { Qualification } from "../../Constant/Inquiry/Inquiry";
import { StatusCodes } from "http-status-codes";
import { useFormik } from "formik";
import * as yup from "yup";
import { staffEnums } from "../../Constant/Staff/staff";
import BaseModal from "../../BaseComponents/BaseModal";
import { toast } from "react-toastify";
import { DeleteMessage } from "../../Constant/Center";
import { handleEditClick } from "../../Constant/common";
import { staffTitle } from "../../Constant/title";

const Staff = () => {
  document.title = staffTitle;
  const [staffData, setStaffData] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [totalNumberOfRows, setTotalNumberOfRows] = useState();
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [qualificationData, setQualificationData] = useState();
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [editId, setEditId] = useState(null);
  const [positionData, setPositionData] = useState();
  const [formStep, setFormStep] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [staffDetails, setStaffDetails] = useState(null);
  const [staffId, setStaffId] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [editData, setEditData] = useState(null);


  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  const handleFetchData = (page) => {
    setCurrentPage(page);
    setBtnLoader(false);
  };

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };

  const fetchStaffData = async (id) => {
    setLoader(true);
    const payload = {
      condition: {
        role: staffEnums.ROLE_PAYLOAD,
        id: id,
      },
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    const staffPayload = {
      condition: {
        role: staffEnums.ROLE_PAYLOAD,
      },
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    listOfStaffApi(id !== null ? payload : staffPayload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          if (id !== null) {
            setEditData(resp?.data?.listOfStaff[0]);
          } else {
            setStaffData(resp?.data?.listOfStaff);
            setTotalPages(resp?.data?.totalPages);
            setTotalRecords(resp?.data?.totalRecordsCount);
            setTotalNumberOfRows(resp?.data?.numberOfRows);
            setCurrentPage(resp?.data?.currentPage);
          }
        }
      })
      .catch((error) => {
        return error;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const fetchData = () => {
    qualificationApi()
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          let data = resp?.data;
          setQualificationData(
            data?.map((item) => ({
              value: item?.id,
              label: item?.name,
              id: item?.id,
            }))
          );
        }
      })
      .catch((err) => {
        return err;
      });

    const payload = {
      order: [columnName],
    };
    listOfPositionApi(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          let data = resp?.data?.listOfPosition;
          setPositionData(
            data?.map((item) => ({
              value: item?.id,
              label: item?.position_name,
              id: item?.id,
            }))
          );
        }
      })
      .catch((err) => {
        return err;
      });
  };

  useEffect(() => {
    fetchData();
    fetchStaffData(null);
  }, [currentPage, customPageSize, columnName, sortOrder]);

  const staffForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editData ? editData?.name : "",
      contact_no: editData ? editData?.contact_no : "",
      email: editData ? editData?.email : "",
      role: editData ? editData?.role || "" : "",
      position: editData ? editData?.authUserDetail?.position?.id || "" : "",
      experience: editData ? editData?.authUserDetail?.experience || "" : "",
      salary: editData ? editData?.authUserDetail?.salary || "" : "",
      joining_date: editData
        ? editData?.authUserDetail?.joining_date || ""
        : "",
      left_date: editData ? editData?.authUserDetail?.left_date || "" : "",
      address: editData ? editData?.authUserDetail?.address || "" : "",
      qualification: editData
        ? editData?.authUserDetail?.qualification?.id || ""
        : "",
    },
    validationSchema: yup.object({
      name: yup.string().required(validationMessages.required(staffEnums.NAME)),
      contact_no: yup
        .string()
        .matches(
          numberRegex,
          validationMessages.contactLength(staffEnums.CONTACT_NO, 10)
        )
        .required(validationMessages.required(staffEnums.CONTACT_NO)),
      email: yup
        .string()
        .email("Invalid email")
        .required(validationMessages.required(staffEnums.EMAIL)),
      role: yup.string().required(validationMessages.required(staffEnums.ROLE)),
      position: yup
        .string()
        .required(validationMessages.required(staffEnums.POSITION)),
      experience: yup
        .string()
        .required(validationMessages.required(staffEnums.EXPERIENCE)),
      salary: yup
        .string()
        .required(validationMessages.required(staffEnums.SALARY)),
      joining_date: yup
        .date()
        .required(validationMessages.required(staffEnums.JOINING_DATE)),
      left_date: yup.string().when("joining_date", (joining_date, schema) => {
        return schema.test({
          name: "left_date",
          exclusive: false,
          message: staffEnums.LEFT_DATE_VALIDATION,
          test: function (value) {
            if (!value || !joining_date) return true;
            return new Date(value) > new Date(joining_date);
          },
        });
      }),
      address: yup
        .string()
        .required(validationMessages.required(staffEnums.ADDRESS)),
      qualification: yup
        .string()
        .required(validationMessages.required(staffEnums.QUALIFICATION)),
    }),
    onSubmit: (values, { resetForm }) => {
      setBtnLoader(true);
      const payload = {
        name: values.name,
        email: values.email,
        contact_no: String(values.contact_no),
        role: values.role,
        qualification_id: values.qualification,
        experience: Number(values.experience),
        position_id: values.position,
        salary: String(values.salary),
        joining_date: values.joining_date,
        left_date: values.left_date,
        address: values.address,
      };
      if (editId !== null) {
        editStaffApi(editId, payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp?.message);
              setFormStep(1);
              fetchStaffData(null);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
            return err;
          })
          .finally(() => {
            setBtnLoader(false);
            setEditData(null);
            setEditId(null);
            staffForm.resetForm();
            resetForm();
          });
      } else {
        setEditId(null);
        addStaffApi(payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp?.message);
              setFormStep(1);
              fetchStaffData(null);
            } else {
              toast.error(resp?.message);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
            return err;
          })
          .finally(() => {
            setBtnLoader(false);
            staffForm.resetForm();
          });
      }
    },
  });

  const editStaff = (id) => {
    setEditId(id);
    fetchStaffData(id);
  };

  const viewStaffDetails = (id) => {
    if (id) {
      fetchStaffDetails(id);
    }
    setModalOpen(!modalOpen);
  };

  const fetchStaffDetails = (id) => {
    setLoader(true);
    viewStaffApi(id)
      .then((response) => {
        if (
          response?.statusCode === StatusCodes.ACCEPTED ||
          response?.statusCode === StatusCodes.OK ||
          response?.statusCode === StatusCodes.CREATED
        ) {
          setStaffDetails(response?.data);
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error?.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const deleteStaff = async () => {
    setDeleteLoader(true);
    await deleteStaffApi(staffId)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          toast.success(resp?.message);
          fetchStaffData(null);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
        return err;
      })
      .finally(() => {
        setDeleteLoader(false);
        setModalDelete(false);
        setLoader(false);
      });
  };

  const toggleDelete = (id) => {
    setStaffId(id);
    setModalDelete(!modalDelete);
  };

  const columns = useMemo(() => [
    {
      header: staffEnums.NAME,
      accessorKey: "name",
      enableColumnFilter: false,
    },
    {
      header: staffEnums.CONTACT_NO,
      accessorKey: "contact_no",
      enableColumnFilter: false,
    },
    {
      header: staffEnums.ROLE,
      accessorKey: "role",
      enableColumnFilter: false,
    },
    {
      header: staffEnums.POSITION,
      accessorKey: "authUserDetail.position.position_name",
      enableColumnFilter: false,
    },
    {
      header: staffEnums.QUALIFICATION,
      accessorKey: "authUserDetail.qualification.name",
      enableColumnFilter: false,
    },
    {
      header: staffEnums.JOINING_DATE,
      accessorKey: "authUserDetail.joining_date",
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
                editStaff(cell?.row?.original?.id);
                handleEditClick();
              }}
              title="Edit"
            />
          </span>
          <span>
            <RiEyeLine
              className={`fs-5 mx-2 text-success ${
                cell?.row?.original?.status === "Pending" ? `icon-disabled` : ``
              }`}
              onClick={() => viewStaffDetails(cell?.row?.original?.id)}
              title="Delete"
            />
          </span>
          <span>
            <RiDeleteBin7Fill
              className={`fs-5 mx-2 text-danger ${
                cell?.row?.original?.status === "Pending" ? `icon-disabled` : ``
              }`}
              onClick={() => toggleDelete(cell?.row?.original?.id)}
              title="Delete"
            />
          </span>
        </div>
      ),
      enableColumnFilter: false,
    },
  ]);

  const nextStep = () => {
    if (formStep === 1) {
      staffForm.validateForm().then((errors) => {
        if (
          Object.keys(errors)?.filter(
            (key) =>
              key !== "joining_date" && key !== "left_date" && key !== "address"
          ).length === 0
        ) {
          setFormStep(2);
        } else {
          staffForm.setTouched({
            name: true,
            contact_no: true,
            email: true,
            position: true,
            role: true,
            qualification: true,
            position_id: true,
            experience: true,
            salary: true,
          });
        }
      });
    }
  };

  const prevStep = () => {
    setFormStep(1);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h5 className="f-w-600">{staffEnums.STAFF}</h5>
      </div>
      <BaseModal
        isOpen={modalDelete}
        title="Delete"
        toggler={toggleDelete}
        submit={() => deleteStaff()}
        submitText="Delete"
        disabled={deleteLoader}
        loader={deleteLoader}
      >
        {DeleteMessage}
      </BaseModal>
      <BaseModal
        isOpen={modalOpen}
        title="View Staff"
        toggler={handleCloseModal}
        size="lg"
        submitText="Close"
        children={
          staffDetails ? (
            <div>
              <div className="mb-3">
                <div className="row p-2">
                  <div className="col-12 bg-light mb-2">
                    <h6 className="col-12 text-dark fw-bold pt-3 pb-2">
                      {staffEnums.PERSONAL_DETAILS}
                    </h6>
                  </div>
                  <div className="col-6">
                    <h6>
                      <span className="fw-bold">{staffEnums.NAME}:</span>{" "}
                      {staffDetails.name}
                    </h6>
                    <h6>
                      <span className="fw-bold">{staffEnums.CONTACT_NO}:</span>{" "}
                      {staffDetails.contact_no}
                    </h6>
                  </div>
                  <div className="col-6">
                    <h6>
                      <span className="fw-bold">{staffEnums.EMAIL}:</span>{" "}
                      {staffDetails.email}
                    </h6>
                    <h6>
                      <span className="fw-bold">{staffEnums.ROLE}:</span>{" "}
                      {staffDetails.role}
                    </h6>
                  </div>
                  <div className="col-6">
                    <h6>
                      <span className="fw-bold">{staffEnums.POSITION}:</span>{" "}
                      {staffDetails.authUserDetail?.position?.position_name}
                    </h6>
                  </div>
                </div>
                <div className="row p-2">
                  <div className="col-12 bg-light mb-2">
                    <h6 className="col-12 text-dark fw-bold pt-3 pb-2">
                      {staffEnums.OTHER_DETAILS}
                    </h6>
                  </div>
                  <div className="col-6">
                    <h6>
                      <span className="fw-bold">{staffEnums.EXPERIENCE}:</span>{" "}
                      {staffDetails?.authUserDetail?.experience} Years
                    </h6>
                    <h6>
                      <span className="fw-bold">{staffEnums.SALARY}:</span>{" "}
                      {staffDetails?.authUserDetail?.salary}
                    </h6>
                    <h6>
                      <span className="fw-bold">
                        {staffEnums.QUALIFICATION}:
                      </span>{" "}
                      {staffDetails?.authUserDetail?.qualification?.name}
                    </h6>
                  </div>
                  <div className="col-6">
                    <h6>
                      <span className="fw-bold">
                        {staffEnums.JOINING_DATE}:
                      </span>{" "}
                      {staffDetails?.authUserDetail?.joining_date}
                    </h6>
                    <h6>
                      <span className="fw-bold">{staffEnums.LEFT_DATE}:</span>{" "}
                      {staffDetails?.authUserDetail?.left_date}
                    </h6>
                    <h6>
                      <span className="fw-bold">{staffEnums.ADDRESS}:</span>{" "}
                      {staffDetails?.authUserDetail?.address}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Spinner />
          )
        }
        hasSubmitButton={false}
      ></BaseModal>

      <div className="card p-4 rounded mb-0 mx-3">
        <div className="">
          <form onSubmit={staffForm.handleSubmit}>
            <div className="row justify-content-center">
              <div className="col-lg-12 row">
                {formStep === 1 && (
                  <>
                    <h5 className="my-2 sub-title">
                      {staffEnums.PERSONAL_DETAILS}
                    </h5>
                    <div className="col-lg-3">
                      <BaseInput
                        label={staffEnums.NAME}
                        name="name"
                        type="text"
                        placeholder={PlaceHolderFormat(staffEnums.NAME)}
                        value={staffForm.values.name}
                        touched={staffForm.touched.name}
                        error={staffForm.errors.name}
                        handleBlur={staffForm.handleBlur}
                        handleChange={staffForm.handleChange}
                      />
                    </div>
                    <div className="col-lg-3">
                      <BaseInput
                        name="email"
                        type="text"
                        label={staffEnums.EMAIL}
                        placeholder={PlaceHolderFormat(staffEnums.EMAIL)}
                        value={staffForm.values.email}
                        touched={staffForm.touched.email}
                        error={staffForm.errors.email}
                        handleBlur={staffForm.handleBlur}
                        handleChange={staffForm.handleChange}
                      />
                    </div>
                    <div className="col-lg-3">
                      <BaseInput
                        name="contact_no"
                        type="text"
                        label={staffEnums.CONTACT_NO}
                        placeholder={PlaceHolderFormat(staffEnums.CONTACT_NO)}
                        value={staffForm.values.contact_no}
                        touched={staffForm.touched.contact_no}
                        error={staffForm.errors.contact_no}
                        handleBlur={staffForm.handleBlur}
                        handleChange={(e) => {
                          if (
                            e?.target?.value?.length <= 10 &&
                            digitRegex.test(e.target.value)
                          ) {
                            staffForm.handleChange(e);
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <BaseSelect
                        name="qualification"
                        label={staffEnums.QUALIFICATION}
                        className="select-border"
                        options={qualificationData}
                        placeholder={SelectPlaceHolder(
                          staffEnums.QUALIFICATION
                        )}
                        handleChange={(field, value) => {
                          staffForm.setFieldValue(field, value);
                        }}
                        handleBlur={() =>
                          staffForm.setFieldTouched(Qualification, true)
                        }
                        value={staffForm.values.qualification}
                        touched={staffForm.touched.qualification}
                        error={staffForm.errors.qualification}
                      />
                    </div>
                    <div className="col-lg-3">
                      <BaseSelect
                        name="position"
                        label={staffEnums.POSITION}
                        className="select-border"
                        options={positionData}
                        placeholder={SelectPlaceHolder(staffEnums.POSITION)}
                        handleChange={(field, value) => {
                          staffForm.setFieldValue(field, value);
                        }}
                        handleBlur={() =>
                          staffForm.setFieldTouched(staffEnums.POSITION, true)
                        }
                        value={staffForm.values.position}
                        touched={staffForm.touched.position}
                        error={staffForm.errors.position}
                      />
                    </div>
                    <div className="col-lg-3">
                      <BaseSelect
                        name="role"
                        label={staffEnums.ROLE}
                        className="select-border"
                        options={staffEnums.ROLE_OPTIONS}
                        placeholder={SelectPlaceHolder(staffEnums.ROLE)}
                        handleChange={(field, value) => {
                          staffForm.setFieldValue(field, value);
                        }}
                        handleBlur={() =>
                          staffForm.setFieldTouched(staffEnums.ROLE, true)
                        }
                        value={staffForm.values.role}
                        touched={staffForm.touched.role}
                        error={staffForm.errors.role}
                      />
                    </div>
                    <div className="col-lg-3">
                      <BaseInput
                        name="experience"
                        type="text"
                        label={staffEnums.EXPERIENCE}
                        placeholder={PlaceHolderFormat(staffEnums.EXPERIENCE)}
                        value={staffForm.values.experience}
                        touched={staffForm.touched.experience}
                        error={staffForm.errors.experience}
                        handleBlur={staffForm.handleBlur}
                        handleChange={(e) => {
                          if (
                            e.target.value.length <= 2 &&
                            digitRegex.test(e.target.value)
                          ) {
                            staffForm.handleChange(e);
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <BaseInput
                        name="salary"
                        type="text"
                        label={staffEnums.SALARY}
                        placeholder={PlaceHolderFormat(staffEnums.SALARY)}
                        value={staffForm.values.salary}
                        touched={staffForm.touched.salary}
                        error={staffForm.errors.salary}
                        handleBlur={staffForm.handleBlur}
                        handleChange={(e) => {
                          if (digitRegex.test(e.target.value)) {
                            staffForm.handleChange(e);
                          }
                        }}
                      />
                    </div>
                    <div className="row">
                      <div className="col-lg-12 d-flex justify-content-end align-items-end">
                        <div className="mt-4 mt-lg-0">
                          <BaseButton
                            className="btn btn-pill"
                            color="primary"
                            type="button"
                            onClick={nextStep}
                            children="Next"
                          ></BaseButton>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {formStep === 2 && (
                  <>
                    <h5 className="my-4 sub-title">
                      {staffEnums.OTHER_DETAILS}
                    </h5>
                    <div className="col-lg-3">
                      <BaseInput
                        name="joining_date"
                        type="date"
                        label={staffEnums.JOINING_DATE}
                        placeholder={PlaceHolderFormat(staffEnums.JOINING_DATE)}
                        value={staffForm.values.joining_date}
                        touched={staffForm.touched.joining_date}
                        error={staffForm.errors.joining_date}
                        handleBlur={staffForm.handleBlur}
                        handleChange={staffForm.handleChange}
                      />
                    </div>
                    <div className="col-lg-3">
                      <BaseInput
                        name="left_date"
                        type="date"
                        label={staffEnums.LEFT_DATE}
                        placeholder={PlaceHolderFormat(staffEnums.LEFT_DATE)}
                        value={staffForm.values.left_date}
                        touched={staffForm.touched.left_date}
                        error={staffForm.errors.left_date}
                        handleBlur={staffForm.handleBlur}
                        handleChange={staffForm.handleChange}
                      />
                    </div>
                    <div className="col-lg-6">
                      <BaseInput
                        type="textarea"
                        name="address"
                        label={staffEnums.ADDRESS}
                        rows={2}
                        className={`form-control ${
                          staffForm.touched.address && staffForm.errors.address
                            ? "is-invalid"
                            : ""
                        }`}
                        placeholder={PlaceHolderFormat(staffEnums.ADDRESS)}
                        value={staffForm.values.address}
                        touched={staffForm.touched.address}
                        error={staffForm.errors.address}
                        handleBlur={staffForm.handleBlur}
                        handleChange={staffForm.handleChange}
                      />
                    </div>
                    <div className="mt-4 col-lg-12 d-flex justify-content-end">
                      <BaseButton
                        className="mx-2"
                        color="danger"
                        type="button"
                        onClick={prevStep}
                        children="Back"
                      ></BaseButton>
                      <BaseButton
                        className="mx-2"
                        color="primary"
                        type="submit"
                        disabled={btnLoader}
                        loader={btnLoader}
                        children={
                          editId !== null
                            ? btnLoader
                              ? Loading
                              : Update
                            : Submit
                        }
                      ></BaseButton>
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="col-6 py-2 px-3">
        <h5 className="f-w-600">{staffEnums.STAFF_LIST}</h5>
      </div>
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {staffData && staffData?.length > 0 && (
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
              manualPagination={true}
              columns={columns}
              data={searchValue ? [] : staffData || []}
              isGlobalFilter={true}
              SearchPlaceholder="Search"
              onSearch={handleSearchValueChange}
              tableClass="table table-bordered text-center"
            />
          )}
          {!loader && !staffData && (
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

export default Staff;
