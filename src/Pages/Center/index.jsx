import React, { useEffect, useMemo, useState } from "react";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseButton from "../../BaseComponents/BaseButton/index";
import BaseSelect from "../../BaseComponents/BaseSelect";
import TableContainer from "../../BaseComponents/BaseTable";
import { center } from "../../Constant/Inquiry/Inquiry";
import { RiEditFill, RiDeleteBin7Fill, RiSearchLine } from "react-icons/ri";
import {
  Action,
  Address,
  City,
  Description,
  Loading,
  Location,
  Search,
  State,
  Submit,
  Update,
  notFound,
} from "../../Constant";
import Spinner from "../../BaseComponents/BaseLoader/index";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  SelectPlaceHolder,
  validationMessages,
  zipcodeRegex,
} from "../../Constant/validation";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import BaseModal from "../../BaseComponents/BaseModal";
import {
  Center,
  CenterList,
  DeleteMessage,
  District,
  SrNo,
  centerLabel,
  pinCode,
} from "../../Constant/Center";
import {
  addCenterApi,
  deleteCenterApi,
  editCenterApi,
  listCenterApi,
} from "../../Api/Center";
import { listOfCity, listOfDistrict, listOfState } from "../../Api/common";
import BaseRadioGroup from "../../BaseComponents/BaseRadio";
import { radioOptions1 } from "../../Constant/Hostel/hostel";
import { handleEditClick } from "../../Constant/common";
import { centerTitle } from "../../Constant/title";

const CenterPage = () => {
  document.title = centerTitle;
  let auth_id = sessionStorage.getItem("id");
  let auth_name = sessionStorage.getItem("name");
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [states, setStates] = useState();
  const [district, setDistrict] = useState();
  const [city, setCity] = useState();
  const [centerList, setCenterList] = useState();
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [editId, setEditId] = useState(null);
  const [centerId, setCenterId] = useState();
  const [editData, setEditData] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [modal, setModal] = useState(false);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [selectedRadio, setSelectedRadio] = useState("No");

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  const toggle = (id) => {
    setCenterId(id);
    setModal(!modal);
  };

  const editCenter = (row) => {
    setEditId(row?.id);
    setSelectedRadio(row.is_hostel);
    fetchData(row?.id);
  };

  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  const fetchData = async (id) => {
    setLoader(true);
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
    listCenterApi(id !== null ? payload : empyPayload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          if (id !== null) {
            setEditData(resp?.data?.listOfCenter[0]);
          } else {
            setCenterList(resp?.data?.listOfCenter);
            setTotalRecords(resp.data.totalRecordsCount);
            setTotalPages(resp?.data?.totalPages);
            setTotalNumberOfRows(resp?.data?.numberOfRows);
            setCurrentPage(resp?.data?.currentPage);
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
  };

  const fetchArea = () => {
    setLoader(true);
    let data;
    const payload = {};
    listOfState(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setStates(
            data?.map((item) => ({
              value: item?.id,
              label: item?.state_name,
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

  const fetchDistrict = (id) => {
    setLoader(true);
    let data;
    const payload = {
      condition: {
        state_id: id,
      },
    };
    listOfDistrict(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setDistrict(
            data?.map((item) => ({
              value: item?.id,
              label: item?.district_name,
              id: item?.id,
            }))
          );
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        setDistrict([]);
        fetchCity(null);
        return err;
      })
      .finally(() => {
        setLoader(false);
      });
  };
  const fetchCity = (id) => {
    setLoader(true);
    let data;
    const payload = {
      condition: {
        district_id: id,
      },
    };
    listOfCity(payload)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          data = resp?.data;
          setCity(
            data?.map((item) => ({
              value: item?.id,
              label: item?.city_name,
              id: item?.id,
            }))
          );
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        setCity([]);
        return err;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const deleteCenter = async () => {
    setDeleteLoader(true);
    await deleteCenterApi(centerId)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          toast.success(resp?.message);
          window.location.reload();
        } else {
          toast.error(resp?.message);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
      })
      .finally(() => {
        setDeleteLoader(false);
        toggle();
        fetchData(null);
      });
  };

  const centerForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      organization_id: auth_id,
      center_name: editId !== null ? editData?.center_name : "",
      location: editId !== null ? editData?.location : "",
      district: editId !== null ? editData?.district?.id : "",
      state_name: editId !== null ? editData?.state?.id : "",
      city: editId !== null ? editData?.city?.id : "",
      description: editId !== null ? editData?.description : "",
      address: editId !== null ? editData?.address : "",
      pin_code: editId !== null ? editData?.pin_code : "",
      hostel_facility: editId !== null ? editData?.is_hostel : "No",
      uniform_fees: editId !== null ? editData?.uniform_fees : "",
      per_day_hostel_fees: editId !== null ? editData?.per_day_hostel_fees : "",
    },
    validationSchema: yup.object({
      center_name: yup.string().required(validationMessages.required(center)),
      location: yup.string().required(validationMessages.required(Location)),
      district: yup.string().required(validationMessages.required(District)),
      state_name: yup.string().required(validationMessages.required(State)),
      city: yup.string().required(validationMessages.required(City)),
      address: yup.string().required(validationMessages.required(Address)),
      uniform_fees: yup
        .string()
        .required(validationMessages.required(centerLabel.uniformFees)),
      per_day_hostel_fees: yup
        .string()
        .required(validationMessages.required(centerLabel.fees)),
      pin_code: yup
        .string()
        .required(validationMessages.required(pinCode))
        .matches(zipcodeRegex, validationMessages.contactLength(pinCode, 6)),
    }),
    onSubmit: (values) => {
      setBtnLoader(true);
      const payload = {
        organization_id: parseInt(auth_id),
        organization_name: auth_name,
        center_name: values.center_name,
        location: values.location,
        district_id: values.district,
        state_id: values.state_name,
        city_id: values.city,
        description: values.description,
        address: values.address,
        pin_code: `${values.pin_code}`,
        uniform_fees: values.uniform_fees,
        per_day_hostel_fees: values.per_day_hostel_fees,
        is_hostel: values.hostel_facility,
      };

      if (editId !== null) {
        editCenterApi(editId, payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp.message);
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
            centerForm.resetForm();
            centerForm.setFieldValue("hostel_facility", "");
            setSelectedRadio("");
          });
      } else {
        addCenterApi(payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp.message);
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
            centerForm.resetForm();
            centerForm.setFieldValue("hostel_facility", "");
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
      },
      {
        header: center,
        accessorKey: "center_name",
        enableColumnFilter: false,
      },
      {
        header: Location,
        accessorKey: "location",
        enableColumnFilter: false,
      },
      {
        header: State,
        accessorKey: "state.state_name",
        enableColumnFilter: false,
      },
      {
        header: District,
        accessorKey: "district.district_name",
        enableColumnFilter: false,
      },
      {
        header: City,
        accessorKey: "city.city_name",
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
                  editCenter(cell?.row?.original);
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

  useEffect(() => {
    fetchData(null);
    fetchArea();
  }, [
    centerForm.values.state_name,
    centerForm.values.district,
    centerForm.values.city,
    currentPage,
    customPageSize,
    columnName,
    sortOrder,
  ]);

  useEffect(() => {
    fetchDistrict(editData?.state?.id);
    fetchCity(editData?.district?.id);
  }, [editData]);

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
    centerForm.setFieldValue("hostel_facility", event.target.value);
  };

  return (
    <>
      <div className="px-3">
        <h5 className="f-w-600">{Center}</h5>
      </div>
      <BaseModal
        isOpen={modal}
        title="Delete"
        toggler={toggle}
        submit={() => deleteCenter()}
        submitText="Delete"
        disabled={deleteLoader}
        loader={deleteLoader}
      >
        {DeleteMessage}
      </BaseModal>
      <div className="card p-4 rounded mb-0 mx-3">
        <form onSubmit={centerForm.handleSubmit}>
          <div className="row">
            <div className="col-lg-12 row">
              <div className="col-lg-3">
                <BaseInput
                  name="center_name"
                  type="text"
                  label={center}
                  placeholder={PlaceHolderFormat(center)}
                  value={centerForm.values.center_name}
                  touched={centerForm.touched.center_name}
                  error={centerForm.errors.center_name}
                  handleBlur={centerForm.handleBlur}
                  handleChange={centerForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseSelect
                  name="state_name"
                  options={states}
                  label={State}
                  placeholder={SelectPlaceHolder(State)}
                  value={centerForm.values.state_name}
                  touched={centerForm.touched.state_name}
                  error={centerForm.errors.state_name}
                  handleBlur={centerForm.handleBlur}
                  handleChange={(field, value) => {
                    centerForm.setFieldValue(field, value);
                    fetchDistrict(value);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <BaseSelect
                  name="district"
                  options={district}
                  label={District}
                  placeholder={SelectPlaceHolder(District)}
                  value={centerForm.values.district}
                  touched={centerForm.touched.district}
                  error={centerForm.errors.district}
                  handleBlur={centerForm.handleBlur}
                  handleChange={(field, value) => {
                    centerForm.setFieldValue(field, value);
                    fetchCity(value);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <BaseSelect
                  name="city"
                  label={City}
                  options={city}
                  placeholder={SelectPlaceHolder(City)}
                  value={centerForm.values.city}
                  touched={centerForm.touched.city}
                  error={centerForm.errors.city}
                  handleBlur={centerForm.handleBlur}
                  handleChange={(field, value) => {
                    centerForm.setFieldValue(field, value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 row">
              <div className="col-lg-3">
                <BaseInput
                  type="textarea"
                  name="address"
                  label={Address}
                  rows={2}
                  className={`form-control ${
                    centerForm.touched.address && centerForm.errors.address
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder={PlaceHolderFormat(Address)}
                  value={centerForm.values.address}
                  touched={centerForm.touched.address}
                  error={centerForm.errors.address}
                  handleBlur={centerForm.handleBlur}
                  handleChange={centerForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="pin_code"
                  type="number"
                  label={pinCode}
                  placeholder={PlaceHolderFormat(pinCode)}
                  value={centerForm.values.pin_code}
                  touched={centerForm.touched.pin_code}
                  error={centerForm.errors.pin_code}
                  handleBlur={centerForm.handleBlur}
                  handleChange={centerForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="location"
                  type="text"
                  label={Location}
                  placeholder={PlaceHolderFormat(Location)}
                  value={centerForm.values.location}
                  touched={centerForm.touched.location}
                  error={centerForm.errors.location}
                  handleBlur={centerForm.handleBlur}
                  handleChange={centerForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <label>{centerLabel.hostelFacility}</label>
                <BaseRadioGroup
                  name="hostel_facility"
                  options={radioOptions1}
                  selectedValue={selectedRadio}
                  onChange={handleRadioChange}
                  value={centerForm.values.hostel_facility}
                  touched={centerForm.touched.hostel_facility}
                  error={centerForm.errors.hostel_facility}
                  handleBlur={centerForm.handleBlur}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 row">
              <div className="col-lg-3">
                <BaseInput
                  name="description"
                  type="textarea"
                  label={Description}
                  placeholder={PlaceHolderFormat(Description)}
                  value={centerForm.values.description}
                  touched={centerForm.touched.description}
                  error={centerForm.errors.description}
                  handleBlur={centerForm.handleBlur}
                  handleChange={centerForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  type="number"
                  name="per_day_hostel_fees"
                  label={centerLabel.feesLabel}
                  placeholder={PlaceHolderFormat(centerLabel.fees)}
                  value={centerForm.values.per_day_hostel_fees}
                  touched={centerForm.touched.per_day_hostel_fees}
                  error={centerForm.errors.per_day_hostel_fees}
                  handleBlur={centerForm.handleBlur}
                  handleChange={centerForm.handleChange}
                />
              </div>
              <div className="col-lg-3">
                <BaseInput
                  name="uniform_fees"
                  type="number"
                  label={centerLabel.uniformFees}
                  placeholder={PlaceHolderFormat(centerLabel.uniformFees)}
                  value={centerForm.values.uniform_fees}
                  touched={centerForm.touched.uniform_fees}
                  error={centerForm.errors.uniform_fees}
                  handleBlur={centerForm.handleBlur}
                  handleChange={centerForm.handleChange}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 row d-flex justify-content-end align-items-end">
              <div className="col-lg-3 d-flex justify-content-end align-items-end">
                <div className="mt-4 mt-lg-0">
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
            </div>
          </div>
        </form>
      </div>
      <div className="col-6 py-2 px-3">
        <h5 className="f-w-600">{CenterList}</h5>
      </div>
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {centerList && centerList?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              fetchData={handleFetchData}
              columns={columns}
              data={searchValue ? [] : centerList || []}
              isGlobalFilter={true}
              customPageSize={customPageSize}
              setCustomPageSize={setCustomPageSize}
              manualPagination={true}
              tableClass="table table-bordered text-center"
              onSearch={handleSearchValueChange}
              fetchSortingData={handleFetchSorting}
              SearchPlaceholder={Search}
            />
          )}
          {!loader && !centerList && (
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

export default CenterPage;
