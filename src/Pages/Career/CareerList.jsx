import React, { useEffect, useMemo, useState } from "react";
import Spinner from "../../BaseComponents/BaseLoader";
import TableContainer from "../../BaseComponents/BaseTable";
import { Action, notFound, Remarks, Status, Submit } from "../../Constant";
import { editCareerStatus, listOfCreer } from "../../Api/common";
import { careerLable, StatusOption } from "../../Constant/Career/Career";
import { RiEyeFill, RiCheckboxCircleLine, RiSearchLine } from "react-icons/ri";
import BaseModal from "../../BaseComponents/BaseModal";
import { BaseImageURL } from "../../Api/Service";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import BaseSelect from "../../BaseComponents/BaseSelect";
import * as yup from "yup";
import BaseInput from "../../BaseComponents/BaseInput";
import { StatusCodes } from "http-status-codes";
import { handleResponse } from "../../Constant/common";
import { careerTitle } from "../../Constant/title";
import { validationMessages } from "../../Constant/validation";

const CareerList = () => {
  document.title = careerTitle;
  const [careerList, setCareerList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalNumberOfRows, setTotalNumberOfRows] = useState(0);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedCareerId, setSelectedCareerId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);

  const statusForm = useFormik({
    initialValues: {
      status: "",
      remarks: "",
    },
    validationSchema: yup.object({
      status: yup.string().required(validationMessages.required(Status)),
    }),
    onSubmit: async (values) => {
      setBtnLoader(true);
      const payload = {
        status: values.status,
        remarks: values.remarks,
      };
      editCareerStatus(selectedCareerId, payload)
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
          }
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || err?.message);
        })
        .finally(() => {
          setBtnLoader(false);
          fetchData();
          setShowModal(false);
          statusForm.resetForm();
        });
    },
  });

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };

  const fetchData = () => {
    setLoader(true);
    const payload = {
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    listOfCreer(payload)
      .then((res) => {
        if (
          res.statusCode === StatusCodes.ACCEPTED ||
          res.statusCode === StatusCodes.OK ||
          res.statusCode === StatusCodes.CREATED
        ) {
          setCareerList(res?.data?.listOfCareer);
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

  const viewCareerDetails = (id) => {
    const selected = careerList?.find((career) => career?.id === id);
    setSelectedCareer(selected);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCareer(null);
  };
  const handleCareerStatus = (id) => {
    setSelectedCareerId(id);
    setShowModal(!showModal);
    statusForm.resetForm();
  };
  useEffect(() => {
    fetchData();
  }, [currentPage, customPageSize, columnName, sortOrder]);

  const columns = useMemo(
    () => [
      {
        header: careerLable.candidateName,
        accessorKey: careerLable.candidateNameKey,
        enableColumnFilter: false,
      },
      {
        header: careerLable.contactNo,
        accessorKey: careerLable.contactNoKey,
        enableColumnFilter: false,
      },
      {
        header: careerLable.remarks,
        accessorKey: careerLable.remarksKey,
        enableColumnFilter: false,
      },
      {
        header: Status,
        accessorKey: "status",
        enableColumnFilter: false,
      },
      {
        header: careerLable.center,
        accessorKey: careerLable.centerKey,
        enableColumnFilter: false,
      },
      {
        header: Action,
        accessorKey: "action",
        enableSorting: true,
        cell: (cell) => (
          <div className="d-flex justify-content-center icon">
            <span>
              <RiCheckboxCircleLine
                className="fs-5 text-primary mx-2"
                onClick={() => handleCareerStatus(cell?.row?.original?.id)}
                title="Status"
              />
            </span>
            <span>
              <RiEyeFill
                className="fs-5 text-success mx-2"
                onClick={() => viewCareerDetails(cell?.row?.original?.id)}
                title="View"
              />
            </span>
          </div>
        ),
        enableColumnFilter: false,
      },
    ],
    [careerList]
  );

  return (
    <div>
      <div className="px-3">
        <h5 className="f-w-600">{careerLable.careerList}</h5>
      </div>
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {careerList && careerList?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              currentPage={currentPage}
              fetchData={handleFetchData}
              setCurrentPage={setCurrentPage}
              customPageSize={customPageSize}
              setCustomPageSize={setCustomPageSize}
              fetchSortingData={handleFetchSorting}
              manualPagination={true}
              columns={columns}
              data={careerList || []}
              isGlobalFilter={true}
              SearchPlaceholder="Search"
              tableClass="table table-bordered text-center"
            />
          )}
          {!loader && careerList?.length === 0 && (
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
      {modalOpen && selectedCareer && (
        <BaseModal
          isOpen={modalOpen}
          title={"Career Details"}
          hasSubmitButton={false}
          toggler={closeModal}
        >
          <div className="list-group-flush">
            <div className="row my-2 pb-1 border-bottom">
              <span className="col-6">{careerLable.candidateName}</span>
              <span className="col-6">{selectedCareer?.candidate_name}</span>
            </div>
            <div className="row my-2 pb-1 border-bottom">
              <span className="col-6">{careerLable.contactNo}</span>
              <span className="col-6">{selectedCareer?.contact_no}</span>
            </div>
            <div className="row my-2 pb-1 border-bottom">
              <span className="col-6">{careerLable.email}</span>
              <span className="col-6">
                {selectedCareer?.email || handleResponse.nullData}
              </span>
            </div>
            <div className="row my-2 pb-1 border-bottom">
              <span className="col-6">{careerLable.center}</span>
              <span className="col-6">
                {selectedCareer?.center?.center_name}
              </span>
            </div>
            <div className="row my-2 pb-1 border-bottom">
              <span className="col-6">{careerLable.position}</span>
              <span className="col-6">
                {selectedCareer?.position?.position_name}
              </span>
            </div>

            <div className="row my-2 pb-1 border-bottom">
              <span className="col-6">{careerLable.address}</span>
              <span className="col-6">{selectedCareer?.address}</span>
            </div>
            <div className="row my-2 pb-1 border-bottom">
              <span className="col-6">{Status}</span>
              <span className="col-6">
                {selectedCareer?.status || handleResponse.nullData}
              </span>
            </div>
            <div className="row my-2 pb-1 border-bottom">
              <span className="col-6">{careerLable.remarks}</span>
              <span className="col-6">
                {selectedCareer?.remarks || handleResponse.nullData}
              </span>
            </div>

            <div className="row my-2 pb-1 border-bottom">
              <span className="col-6">{careerLable.resume}</span>
              <span className="col-6">
                <a
                  target="_blank"
                  className="text-decoration-underline"
                  href={`${BaseImageURL}${selectedCareer.resume}`}
                  rel="noreferrer"
                >
                  {careerLable.viewResume}
                </a>
              </span>
            </div>
          </div>
        </BaseModal>
      )}
      <BaseModal
        isOpen={showModal}
        toggler={handleCareerStatus}
        title={careerLable.careerStatus}
        submitText={Submit}
        submit={statusForm.handleSubmit}
        disabled={btnLoader}
        loader={btnLoader}
      >
        <>
          <BaseSelect
            name="status"
            label={Status}
            className="select-border"
            options={StatusOption}
            placeholder={PlaceHolderFormat(Status)}
            handleChange={(field, value) => {
              statusForm.setFieldValue(field, value);
            }}
            handleBlur={() => statusForm.setFieldTouched(Status, true)}
            value={statusForm.values.status}
            touched={statusForm.touched.status}
            error={statusForm.errors.status}
          />
          <BaseInput
            type="textarea"
            name="remarks"
            label={Remarks}
            rows={2}
            className="form-control"
            placeholder={PlaceHolderFormat(Remarks)}
            value={statusForm.values.remarks}
            touched={statusForm.touched.remarks}
            error={statusForm.errors.remarks}
            handleBlur={statusForm.handleBlur}
            handleChange={statusForm.handleChange}
          />
        </>
      </BaseModal>
    </div>
  );
};

export default CareerList;
