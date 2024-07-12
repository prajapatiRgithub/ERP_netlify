import React, { useEffect, useMemo, useRef, useState } from "react";
import BaseInput from "../../BaseComponents/BaseInput";
import TableContainer from "../../BaseComponents/BaseTable";
import { Action, Search, notFound } from "../../Constant";
import Spinner from "../../BaseComponents/BaseLoader/index";
import * as yup from "yup";
import { useFormik } from "formik";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import { StatusCodes } from "http-status-codes";
import { toast } from "react-toastify";
import BaseButton from "../../BaseComponents/BaseButton";
import BaseSelect from "../../BaseComponents/BaseSelect";
import {
  addCategory,
  deleteCategory,
  listOfAddCategory,
  listOfCategory,
} from "../../Api/categoryApi";
import {
  SelectPlaceHolder,
  validationMessages,
} from "../../Constant/validation";
import { fileUploadApi } from "../../Api/common";
import { categoryLable } from "../../Constant/Category/category";
import BaseModal from "../../BaseComponents/BaseModal";
import { BaseImageURL } from "../../Api/Service";
import { RiEditFill, RiDeleteBinLine, RiSearchLine } from "react-icons/ri";
import { editBatchLable } from "../../Constant/BatchAllocation/batchallocation";
import { Label } from "reactstrap";
import { handleEditClick } from "../../Constant/common";
import BaseCheckbox from "../../BaseComponents/BaseCheckbox";
import { categoryTitle } from "../../Constant/title";

const Category = () => {
  document.title = categoryTitle;
  const FileRef = useRef();
  const [loader, setLoader] = useState(false);
  const [dltloader, setDltLoader] = useState(false);
  const [btnloader, setBtnLoader] = useState(false);
  const [category, setCategory] = useState([]);
  const [totalNumberOfRows, setTotalNumberOfRows] = useState();
  const [totalPages, setTotalPages] = useState();
  const [totalRecords, setTotalRecords] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [editId, setEditId] = useState();
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [customPageSize, setCustomPageSize] = useState(5);
  const [columnName, setColumnName] = useState("id");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [selectedImages, setSelectedImages] = useState([]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleFetchSorting = (page, id, order) => {
    setCurrentPage(page);
    setColumnName(id);
    setSortOrder(order);
  };

  const handleSearchValueChange = (value) => {
    setSearchValue(value);
  };

  const fetchData = async (id) => {
    setLoader(true);
    const payload = {
      order: [columnName, sortOrder],
      pageNumber: currentPage,
      pageSize: customPageSize,
    };
    try {
      let response;
      if (id !== null) {
        // Fetch data for editing
        response = await listOfAddCategory({
          ...payload,
          condition: {
            id: id,
          },
        });
        if (
          response?.statusCode === StatusCodes.ACCEPTED ||
          response?.statusCode === StatusCodes.OK ||
          response?.statusCode === StatusCodes.CREATED
        ) {
          setSelectedCategory(response?.data?.listOfCategoryImage[0]);
        }
      } else {
        // Fetch data for listing
        response = await listOfAddCategory(payload);
        if (
          response?.statusCode === StatusCodes.ACCEPTED ||
          response?.statusCode === StatusCodes.OK ||
          response?.statusCode === StatusCodes.CREATED
        ) {
          setCategory(response?.data?.listOfCategoryImage);
          setTotalRecords(response.data.totalRecordsCount);
          setTotalPages(response?.data?.totalPages);
          setTotalNumberOfRows(response?.data?.numberOfRows);
          setCurrentPage(response?.data?.currentPage);
        } else {
          toast.error(response?.message);
        }
      }
    } catch (error) {
      return error;
    } finally {
      setLoader(false);
    }
  };

  const fetchCategoryData = async () => {
    const payload = {
      order: [columnName, sortOrder],
      pageSize: customPageSize,
      pageNumber: currentPage,
    };
    let categoryData;
    listOfCategory(payload)
      .then((categoryResponse) => {
        if (
          categoryResponse?.statusCode === StatusCodes.ACCEPTED ||
          categoryResponse?.statusCode === StatusCodes.OK ||
          categoryResponse?.statusCode === StatusCodes.CREATED
        ) {
          categoryData = categoryResponse?.data;
          setCategoryData(
            categoryData?.listOfCategory?.map((item) => ({
              value: item?.id,
              label: item?.category_name,
              id: item?.id,
            }))
          );
        } else {
          toast.error(categoryResponse?.message);
        }
      })
      .catch((err) => {
        return err;
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      category: editId !== null ? selectedCategory?.id : "",
      descripation: editId !== null ? selectedCategory?.descripation : "",
      images: [],
    },
    validationSchema: yup.object({
      category: yup
        .string()
        .required(validationMessages.required(categoryLable.categoryName)),
      images: yup.array().min(1, categoryLable.imageError),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setBtnLoader(true);
        const formData = new FormData();
        values?.images?.forEach((image) => {
          formData.append("files", image);
        });
        const imageResponse = await fileUploadApi(formData);
        const imageUrls = imageResponse?.data?.map((image) => image);
        const payload = {
          category_id: values.category,
          category_image_title: values.category_image_title,
          category_image: imageUrls,
        };
        addCategory(payload)
          .then((resp) => {
            if (
              resp?.statusCode === StatusCodes.ACCEPTED ||
              resp?.statusCode === StatusCodes.OK ||
              resp?.statusCode === StatusCodes.CREATED
            ) {
              toast.success(resp.message);
              fetchData(null);
              setBtnLoader(false);
              handleChangeStatus(null);
              resetForm();
            } else {
              toast.error(resp.message);
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || err?.message);
          })
          .finally(() => {
            form.resetForm();
            setBtnLoader(false);
            FileRef.current.value = "";
          });
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.message);
      }
    },
  });

  const handleEdit = (id) => {
    setEditId(id);
    fetchData(id);
  };

  const handleChangeStatus = (e) => {
    if (e && e.target && e.target.files) {
      const files = e.target.files;
      const newImages = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isDuplicate = form?.values?.images?.some(
          (image) => image?.name === file?.name
        );
        if (!isDuplicate) {
          if (file.size <= 1024 * 1024) {
            newImages.push(file);
          } else {
            toast.error(editBatchLable.errorSizeImage);
          }
        }
      }
      form?.setFieldValue("images", [...form?.values?.images, ...newImages]);
    }
  };

  const columns = useMemo(
    () => [
      {
        header: "Sr No",
        accessorKey: "serial_number",
        cell: (cell) => cell.row.index + 1,
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: categoryLable.categoryName,
        accessorKey: categoryLable.categoryNameKey,
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
                  handleEdit(cell?.row?.original?.id);
                  handleEditClick();
                }}
                title="Edit"
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
    fetchCategoryData();
    fetchData(null);
  }, [currentPage, customPageSize, columnName, sortOrder]);

  const handleDeleteImage = () => {
    toggleModal();
  };

  const handleDeleteSelectedImages = () => {
    setDltLoader(true);
    const payload = {
      categoryImageId: selectedImages,
    };

    deleteCategory(payload)
      .then((response) => {
        if (
          response?.statusCode === StatusCodes.ACCEPTED ||
          response?.statusCode === StatusCodes.OK ||
          response?.statusCode === StatusCodes.CREATED
        ) {
          const updatedCategoryImages = selectedCategory?.categoryImage?.filter(
            (image) => !selectedImages?.includes(image?.id)
          );

          // Update state after successful deletion
          setSelectedCategory({
            ...selectedCategory,
            categoryImage: updatedCategoryImages,
          });

          if (updatedCategoryImages.length === 0) {
            setCategory(
              category?.filter((cat) => cat?.id !== selectedCategory?.id)
            );
          }

          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
      })
      .finally(() => {
        setDltLoader(false);
        setShowModal(false);
        setSelectedImages([]);
      });
  };

  const handleFetchData = (page) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (imageId) => {
    if (selectedImages?.includes(imageId)) {
      setSelectedImages(selectedImages?.filter((id) => id !== imageId));
    } else {
      setSelectedImages([...selectedImages, imageId]);
    }
  };

  return (
    <>
      <div className="px-3">
        <h5 className="f-w-600">{categoryLable.category}</h5>
      </div>
      <div className="card p-4 rounded mb-0 mx-3">
        <form onSubmit={form.handleSubmit} className="d-flex flex-column">
          <div className="row">
            <div className="col-lg-4">
              <BaseSelect
                name="category"
                label={categoryLable.categoryName}
                options={categoryData}
                placeholder={SelectPlaceHolder(categoryLable.category)}
                handleChange={(field, value) => {
                  form.setFieldValue(field, value);
                }}
                handleBlur={() =>
                  form.setFieldTouched(categoryLable.categoryforname, true)
                }
                value={form.values.category}
                touched={form.touched.category}
                error={form.errors.category}
              />
            </div>
            <div className="col-lg-4 col-md-6 mb-3">
              <BaseInput
                name="descripation"
                type="text"
                label={categoryLable.description}
                placeholder={PlaceHolderFormat(categoryLable.description)}
                value={form.values.descripation}
                handleBlur={form.handleBlur}
                handleChange={form.handleChange}
              />
            </div>
            <div className="col-lg-4">
              {/* ReactStrap Input Is not Working so that's why i have use Input */}
              <Label className="d-block">{editBatchLable.imageUpload}</Label>
              <input
                type="file"
                accept="image/*"
                ref={FileRef}
                onChange={handleChangeStatus}
                multiple
              />
              {form.errors.images && (
                <div className="text-danger">{form.errors.images}</div>
              )}
            </div>
          </div>

          <div className="mt-2 row">
            {form?.values?.images &&
              form?.values?.images?.map((image, index) => (
                <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-3">
                  <div className="card preview-images">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      className="card-img-top img-size"
                    />
                  </div>
                </div>
              ))}
          </div>

          <div className="row mt-3">
            <div className="col-lg-2"></div>
            <div className="col-lg-10 row">
              {selectedCategory &&
                selectedCategory?.categoryImage?.length > 0 &&
                selectedCategory?.categoryImage?.map((image, index) => (
                  <div key={index} className="col-lg-3 mx-1 card">
                    <div className="image-containers">
                      <img
                        className="img"
                        src={`${BaseImageURL}${image.category_image}`}
                        alt="Not Found"
                      />
                      <div className="delete-buttons">
                        <BaseCheckbox
                          id={`checkbox-${image.id}`}
                          type="checkbox"
                          onChange={() => handleCheckboxChange(image.id)}
                          checked={selectedImages?.includes(image.id)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              {selectedImages?.length > 0 && (
                <div className="col-lg-3 mx-1 img-dlt d-flex align-items-end justify-content-start">
                  <RiDeleteBinLine
                    color="danger"
                    className="fs-3 RiDeleteBtn"
                    onClick={() => handleDeleteImage()}
                    title="Delete Image"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-12 d-flex align-items-end justify-content-end">
            <BaseButton
              className="btn btn-pill btn-primary mt-3"
              type="submit"
              children="Submit"
              disabled={btnloader}
              loader={btnloader}
            />
          </div>
        </form>
      </div>
      <div className="col-6 py-2 px-3">
        <h5 className="f-w-600">{categoryLable.categoryList}</h5>
      </div>
      <div className="card mx-3">
        <div className="card-body text-center">
          {loader && <Spinner attrSpinner={{ className: "loader-2" }} />}
          {category && category?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              currentPage={currentPage}
              fetchData={handleFetchData}
              setCurrentPage={setCurrentPage}
              setCustomPageSize={setCustomPageSize}
              fetchSortingData={handleFetchSorting}
              customPageSize={customPageSize}
              columns={columns}
              data={searchValue ? [] : category || []}
              isGlobalFilter={true}
              onSearch={handleSearchValueChange}
              tableClass="table table-bordered text-center"
              SearchPlaceholder={Search}
              manualPagination={true}
            />
          )}
          {!loader && !category && (
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
          isOpen={showModal}
          toggler={toggleModal}
          title={categoryLable.dltTitle}
          submitText={categoryLable.yes}
          disabled={dltloader}
          loader={dltloader}
          submit={() => {
            handleDeleteSelectedImages();
          }}
        >
          {categoryLable.deleteBoady}
        </BaseModal>
      </div>
    </>
  );
};

export default Category;
