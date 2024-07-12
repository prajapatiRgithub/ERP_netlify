import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  deleteBatch,
  exportBatchData,
  importBatchData,
  listOfBatch,
} from "../../Api/BatchApi";
import {
  batchallocationLabel,
  BatchEditTitle,
  DataError,
  editBatchLable,
} from "../../Constant/BatchAllocation/batchallocation";
import { setCourseIdInSessionStorage } from "../../Constant/common";
import Spinner from "../../BaseComponents/BaseLoader";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
import TableContainer from "../../BaseComponents/BaseTable";
import BaseCheckbox from "../../BaseComponents/BaseCheckbox";
import { StatusCodes } from "http-status-codes";
import BaseButton from "../../BaseComponents/BaseButton";
import BaseModal from "../../BaseComponents/BaseModal";
import { useFormik } from "formik";
import * as yup from "yup";
import { BaseImageURL } from "../../Api/Service";
import { validationMessages } from "../../Constant/validation";
import { RiSearchLine } from "react-icons/ri";
import { notFound } from "../../Constant";

const EditBatch = () => {
  document.title = BatchEditTitle;
  const FileRef = useRef();
  const [batchData, setBatchData] = useState([]);
  const [loader, setLoader] = useState(true);
  const { batchId } = useParams();
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [totalNumberOfRows, setTotalNumberOfRows] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [searchValue, setSearchValue] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);
  const [exportData, setExportData] = useState();
  const [btnLoader, setBtnLoader] = useState(false);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const history = useNavigate();
  const [error, setError] = useState([]);
  const [errorModal, setErrorModal] = useState(false);

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, customPageSize, columnName, sortOrder]);

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };
  const fetchData = () => {
    setLoader(true);
    const payload = {
      order: [columnName, sortOrder],
      condition: {
        id: batchId,
      },
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    listOfBatch(payload)
      .then((res) => {
        setBatchData(res?.data);
        setTotalPages(res?.data?.totalPages);
        setTotalRecords(res?.data?.totalRecordsCount);
        setTotalNumberOfRows(res?.data?.numberOfRows);
        setCurrentPage(res?.data?.currentPage);
        const courseId = res?.data?.listOfBatch[0]?.course?.id;
        setCourseIdInSessionStorage(courseId);
      })
      .catch((error) => {
        toast.error(error?.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleCheckAll = () => {
    setIsCheckedAll(!isCheckedAll);
    const updatedCheckedItems = isCheckedAll
      ? []
      : batchData?.listOfBatch?.flatMap((batch) =>
          batch?.batchAssign?.map((item) => item.candidate_id)
        );
    setCheckedItems(updatedCheckedItems);
  };

  const handleCheckItem = (id) => {
    const index = checkedItems.indexOf(id);
    if (index === -1) {
      setCheckedItems([...checkedItems, id]);
    } else {
      const updatedCheckedItems = checkedItems?.filter(
        (itemId) => itemId !== id
      );
      setCheckedItems(updatedCheckedItems);
    }
  };

  useEffect(() => {
    if (isCheckedAll && batchData?.listOfBatch) {
      const allCandidateIds = batchData?.listOfBatch?.flatMap((batch) =>
        batch.batchAssign?.map((item) => item.candidate_id)
      );
      setCheckedItems(allCandidateIds);
    } else {
      setCheckedItems([]);
    }
  }, [isCheckedAll, batchData]);

  const handleDelete = () => {
    setLoader(true);
    const payload = {
      candidate_id: checkedItems,
    };
    deleteBatch(batchId, payload)
      .then((resp) => {
        if (
          resp.statusCode === StatusCodes.ACCEPTED ||
          resp.statusCode === StatusCodes.OK ||
          resp.statusCode === StatusCodes.CREATED
        ) {
          setBatchData(resp?.data);
          toast.success(resp?.message);
          fetchData();
          setCheckedItems([]);
          setIsCheckedAll(false);
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
        setShowModal(false);
      });
  };

  const columns = useMemo(
    () => [
      {
        header: (
          <BaseCheckbox
            id="checkBoxAll"
            checked={isCheckedAll}
            onChange={handleCheckAll}
            className="custom-checkbox-class d-felx justify-content-center"
            labelClassName="custom-label-class"
          />
        ),
        cell: (cell) => (
          <BaseCheckbox
            id={`checkbox${cell.row.original.candidate_id}`}
            checked={
              checkedItems?.includes(cell.row.original.candidate_id) ||
              isCheckedAll
            }
            onChange={() => handleCheckItem(cell.row.original.candidate_id)}
            className="custom-checkbox-class taskCheckBox"
            labelClassName="custom-label-class"
          />
        ),
        enableSorting: true,
        id: "#",
        accessorKey: "id",
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: editBatchLable.can_id,
        accessorKey: editBatchLable.can_idKey,
        enableColumnFilter: false,
      },
      {
        header: editBatchLable.emp_id,
        accessorKey: editBatchLable.emp_idKey,
        enableColumnFilter: false,
      },
      {
        header: editBatchLable.candidateName,
        accessorKey: editBatchLable.candidateNameKey,
        enableColumnFilter: false,
      },
      {
        header: editBatchLable.contactNumber,
        accessorKey: editBatchLable.contactNoKey,
        enableColumnFilter: false,
      },
    ],
    [checkedItems, isCheckedAll]
  );

  const toggleImportModal = () => {
    setShowImportModal(!showImportModal);
  };

  const handleAddMOre = (batchId) => {
    history(`/addcandidate/${batchId}`);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      importData: "",
    },
    validationSchema: yup.object({
      importData: yup
        .mixed()
        .required(validationMessages.required(editBatchLable.file))
        .test(editBatchLable.fileType, editBatchLable.csvValidate, (value) => {
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
      importBatchData(formData)
        .then((resp) => {
          if (
            resp?.statusCode === StatusCodes.ACCEPTED ||
            resp?.statusCode === StatusCodes.OK ||
            resp?.statusCode === StatusCodes.CREATED
          ) {
            toast.success(resp.message);
            formik.setFieldValue(resp?.data);
            setShowImportModal(false);
            fetchData();
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
          FileRef.current.value = "";
          resetForm();
        });
    },
  });

  const hnaldeExportData = () => {
    setLoader(true);
    exportBatchData(batchId)
      .then((resp) => {
        if (
          resp?.statusCode === StatusCodes.ACCEPTED ||
          resp?.statusCode === StatusCodes.OK ||
          resp?.statusCode === StatusCodes.CREATED
        ) {
          setExportData(resp?.data);
          const filename = exportData;
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

  return (
    <div>
      {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
      <div className="py-2 px-3">
        <h5 className="f-w-600">
          {" "}
          {batchData?.listOfBatch?.length > 0 &&
            batchData?.listOfBatch[0].batch_id}
          &nbsp;-&nbsp;
          {batchallocationLabel.editBatch}
        </h5>
      </div>
      <Card>
        <CardBody>
          <div className="row justify-content-end">
            <div className="col-sm-12 col-md-auto mb-2">
              <BaseButton
                color="warning"
                className="text-white"
                onClick={() => toggleImportModal()}
              >
                {editBatchLable.import}
              </BaseButton>
            </div>
            <div className="col-sm-12 col-md-auto mb-2">
              <BaseButton color="success" onClick={hnaldeExportData}>
                {editBatchLable.export}
              </BaseButton>
            </div>
            <div className="col-sm-12 col-md-auto mb-2">
              <BaseButton onClick={() => handleAddMOre(batchId)}>
                {editBatchLable.addMore}
              </BaseButton>
            </div>
            <div className="col-sm-12 col-md-auto mb-2">
              {checkedItems?.length > 0 && (
                <BaseButton color="danger" onClick={toggleModal}>
                  {editBatchLable.delete}
                </BaseButton>
              )}
            </div>
          </div>
          <div className="pt-0">
            <div>
              {batchData?.listOfBatch?.length > 0 ? (
                batchData?.listOfBatch?.map((batch) => (
                  <div key={batch.id}>
                    {batch?.batchAssign?.length > 0 ? (
                      <TableContainer
                        totalPages={totalPages}
                        totalRecords={totalRecords}
                        totalNumberOfRows={totalNumberOfRows}
                        columns={columns}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        fetchData={handleFetchData}
                        data={searchValue ? [] : batch?.batchAssign || []}
                        isGlobalFilter={true}
                        manualPagination={true}
                        customPageSize={customPageSize}
                        setCustomPageSize={setCustomPageSize}
                        onSearch={handleSearchValueChange}
                        theadClass="table-light text-muted"
                        SearchPlaceholder={batchallocationLabel.searchBar}
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
                ))
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
        </CardBody>
      </Card>

      <BaseModal
        isOpen={showImportModal}
        toggler={toggleImportModal}
        title={editBatchLable.importFile}
        submitText={editBatchLable.upoladImage}
        disabled={btnLoader}
        loader={btnLoader}
        submit={formik.handleSubmit}
      >
        <div className="row col-12">
          {/* ReactStrap Input Is not Working so that's why i have use Input */}
          <input
            name="importData"
            type="file"
            ref={FileRef}
            accept=".csv, application/vnd.ms-excel"
            onChange={(e) => {
              formik.setFieldValue(editBatchLable.importData, e.currentTarget.files[0]);
            }}
            onBlur={formik.handleBlur}
            className={
              formik.touched.importData && formik.errors.importData
                ? "is-invalid"
                : ""
            }
          />
          {formik.touched.importData && formik.errors.importData ? (
            <div className="invalid-feedback">{formik.errors.importData}</div>
          ) : null}
        </div>
      </BaseModal>

      <BaseModal
        isOpen={showModal}
        toggler={toggleModal}
        title="Delete Confirmation"
        submitText="Yes"
        submit={() => {
          handleDelete();
        }}
      >
        {editBatchLable.deleteBody}
      </BaseModal>

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

export default EditBatch;
