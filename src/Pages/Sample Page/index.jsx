import React, { Fragment, useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Form } from "reactstrap";
import Breadcrumbs from "../../CommonElements/Breadcrumbs";
import SamplePageContain from "../../Component/Sample Page";
import BaseButton from "../../BaseComponents/BaseButton";
import Spinner from "../../BaseComponents/BaseLoader";
import BaseModal from "../../BaseComponents/BaseModal";
import BaseCheckbox from "../../BaseComponents/BaseCheckbox";
import BaseRadioGroup from "../../BaseComponents/BaseRadio";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseSelect from "../../BaseComponents/BaseSelect";
import {
  InputPlaceHolder,
  validationMessages,
  emailRegex,
} from "../../Constant/validation";
import TableContainer from "../../BaseComponents/BaseTable";

const SamplePage = () => {
  const [loading, setLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(true);
  const [selectedRadio, setSelectedRadio] = useState("option3");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value);
  };

  const radioOptions = [
    { id: "radioinline1", value: "option1", label: "Option", labelSuffix: "1" },
    { id: "radioinline2", value: "option2", label: "Option", labelSuffix: "2" },
    { id: "radioinline3", value: "option3", label: "Option", labelSuffix: "3" },
  ];

  const roleType = [
    { label: "Select Role Type", value: "" },
    { label: "Vendor", value: "Vendor" },
    { label: "Employee", value: "Employee" },
    { label: "Manager", value: "Manager" },
  ];

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      email: "",
      role: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(validationMessages.required("Name")),
      role: Yup.string().required(validationMessages.required("Role")),
      email: Yup.string()
        .email(validationMessages.format("Email"))
        .matches(emailRegex, validationMessages.format("Email"))
        .required(validationMessages.required("Email")),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(true);
    },
  });

  const columns = useMemo(
    () => [
      {
        header: "About",
        accessorKey: "product_name",
        enableColumnFilter: false,
      },
      {
        header: "Is Stock",
        accessorKey: "category_name",
        enableColumnFilter: false,
      },
      {
        header: "Stock",
        accessorKey: "product_status",
        enableColumnFilter: false,
      },
      {
        header: "Orders",
        accessorKey: "code",
        enableColumnFilter: false,
      },
      {
        header: "Variants",
        accessorKey: "orders_count",
        enableColumnFilter: false,
      },
      {
        header: "Action",
        cell: (cell) => (
          <div>
            <BaseButton color="info" tooltipName="Edit">
              <i className="fa fa-pencil"></i>
            </BaseButton>
            <BaseButton color="warning" tooltipName="Delete">
              <i className="fa fa-trash "></i>
            </BaseButton>
          </div>
        ),
      },
    ],
    []
  );

  let listOfProductData = [
    {
      id: 217,
      product_name: "Thisara",
      category_name: "demo",
      product_status: "Online",
      code: "Product-80",
      thumbnail_image: "files-1716360133134.jpg",
      available_stock: 1,
      sale_rate: "400-400",
      orders_count: 2,
      total_variants: 3,
    },
    {
      id: 217,
      product_name: "Parera",
      category_name: "demo",
      product_status: "Online",
      code: "Product-80",
      thumbnail_image: "files-1716360133134.jpg",
      available_stock: 1,
      sale_rate: "400-400",
      orders_count: 2,
      total_variants: 3,
    },
    {
      id: 217,
      product_name: "Eren",
      category_name: "demo",
      product_status: "Online",
      code: "Product-80",
      thumbnail_image: "files-1716360133134.jpg",
      available_stock: 1,
      sale_rate: "400-400",
      orders_count: 2,
      total_variants: 3,
    },
    {
      id: 217,
      product_name: "Yeager",
      category_name: "demo",
      product_status: "Online",
      code: "Product-80",
      thumbnail_image: "files-1716360133134.jpg",
      available_stock: 1,
      sale_rate: "400-400",
      orders_count: 2,
      total_variants: 3,
    },
    {
      id: 217,
      product_name: "Tall",
      category_name: "demo",
      product_status: "Online",
      code: "Product-80",
      thumbnail_image: "files-1716360133134.jpg",
      available_stock: 1,
      sale_rate: "400-400",
      orders_count: 2,
      total_variants: 3,
    },
    {
      id: 217,
      product_name: "Oaks",
      category_name: "demo",
      product_status: "Online",
      code: "Product-80",
      thumbnail_image: "files-1716360133134.jpg",
      available_stock: 1,
      sale_rate: "400-400",
      orders_count: 2,
      total_variants: 3,
    },
    {
      id: 217,
      product_name: "Jonty",
      category_name: "demo",
      product_status: "Online",
      code: "Product-80",
      thumbnail_image: "files-1716360133134.jpg",
      available_stock: 1,
      sale_rate: "400-400",
      orders_count: 2,
      total_variants: 3,
    },
    {
      id: 217,
      product_name: "Lite",
      category_name: "demo",
      product_status: "Online",
      code: "Product-80",
      thumbnail_image: "files-1716360133134.jpg",
      available_stock: 1,
      sale_rate: "400-400",
      orders_count: 2,
      total_variants: 3,
    },
    {
      id: 217,
      product_name: "Yagami",
      category_name: "demo",
      product_status: "Online",
      code: "Product-80",
      thumbnail_image: "files-1716360133134.jpg",
      available_stock: 1,
      sale_rate: "400-400",
      orders_count: 2,
      total_variants: 3,
    },
    {
      id: 217,
      product_name: "Sotaru",
      category_name: "demo",
      product_status: "Online",
      code: "Product-80",
      thumbnail_image: "files-1716360133134.jpg",
      available_stock: 1,
      sale_rate: "400-400",
      orders_count: 2,
      total_variants: 3,
    },
    {
      id: 217,
      product_name: "Goju",
      category_name: "demo",
      product_status: "Online",
      code: "Product-80",
      thumbnail_image: "files-1716360133134.jpg",
      available_stock: 1,
      sale_rate: "400-400",
      orders_count: 2,
      total_variants: 3,
    },
    {
      id: 217,
      product_name: "Scale",
      category_name: "demo",
      product_status: "Online",
      code: "Product-80",
      thumbnail_image: "files-1716360133134.jpg",
      available_stock: 1,
      sale_rate: "400-400",
      orders_count: 2,
      total_variants: 3,
    },
    {
      id: 217,
      product_name: "Hellbound",
      category_name: "demo",
      product_status: "Online",
      code: "Product-80",
      thumbnail_image: "files-1716360133134.jpg",
      available_stock: 1,
      sale_rate: "400-400",
      orders_count: 2,
      total_variants: 3,
    },
    {
      id: 217,
      product_name: "Titan",
      category_name: "demo",
      product_status: "Online",
      code: "Product-80",
      thumbnail_image: "files-1716360133134.jpg",
      available_stock: 1,
      sale_rate: "400-400",
      orders_count: 2,
      total_variants: 3,
    },
    {
      id: 216,
      product_name: "Jujutsu",
      category_name: "Woman's Wear",
      product_status: "Online",
      code: "67",
      thumbnail_image: "files-1716185347221.png",
      available_stock: 23,
      sale_rate: "500-500",
      orders_count: 8,
      total_variants: 3,
    },
    {
      id: 215,
      product_name: "Kaisen",
      category_name: "Woman's Wear",
      product_status: "Online",
      code: "Product-79",
      thumbnail_image: "files-1716183464539.png",
      available_stock: 11,
      sale_rate: "40-40",
      orders_count: 3,
      total_variants: 14,
    },
    {
      id: 214,
      product_name: "Jacket",
      category_name: "Test",
      product_status: "Online",
      code: "Product-78",
      thumbnail_image: "files-1716182472723.png",
      available_stock: 22,
      sale_rate: "120-120",
      orders_count: 2,
      total_variants: 8,
    },
    {
      id: 213,
      product_name: "Jumpsuit",
      category_name: "Woman's Wear",
      product_status: "Online",
      code: "Prod-17",
      thumbnail_image: "files-1715953607585.png",
      available_stock: 10,
      sale_rate: "13-13",
      orders_count: 1,
      total_variants: 2,
    },
    {
      id: 212,
      product_name: "Readymade 3",
      category_name: "Woman's Wear",
      product_status: "Online",
      code: "102600001974",
      thumbnail_image: null,
      available_stock: 0,
      sale_rate: 110,
      orders_count: 1,
      total_variants: 1,
    },
  ];

  return (
    <Fragment>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
          return false;
        }}
      >
        {loading && <Spinner attrSpinner={{ className: "loader-2" }} />}
        <div className="page-header dash-breadcrumb">
          <Breadcrumbs parent="Pages" title="Sample Page" />
        </div>
        <SamplePageContain />
        <BaseButton color="warning" label="Add button" disabled={true} />
        <BaseButton
          color="success"
          label="Hover Me"
          tooltipName="Tooltip Hello"
        />
        <BaseButton color="primary" tooltipName="Facebook">
          <i className="fa fa-facebook m-r-5"></i>
        </BaseButton>
        <BaseButton color="primary" label="Simple" onClick={toggle} />
        <BaseModal isOpen={modal} title="Basic Modal" toggler={toggle}>
          Here your content will go
        </BaseModal>
        <BaseCheckbox
          id="solid7"
          label="Checked"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="custom-checkbox-class"
          labelClassName="custom-label-class"
        />
        <BaseRadioGroup
          name="radio1"
          options={radioOptions}
          selectedValue={selectedRadio}
          onChange={handleRadioChange}
        />
        <BaseInput
          label="hello input"
          name="name"
          type="password"
          placeholder={InputPlaceHolder("name")}
          handleChange={validation.handleChange}
          handleBlur={validation.handleBlur}
          value={validation.values.name}
          touched={validation.touched.name}
          error={validation.errors.name}
          passwordToggle={true}
        />
        <BaseSelect
          name="role"
          label="Role"
          className="select-border"
          options={roleType}
          placeholder={InputPlaceHolder("role")}
          handleChange={(field, value) => {
            validation.setFieldValue(field, value);
          }}
          handleBlur={() => validation.setFieldTouched("role", true)}
          value={validation.values.role}
          touched={validation.touched.role}
          error={validation.errors.role}
        />
        <BaseButton
          color="success"
          label="Submit"
          type="submit"
          className="mt-2 mb-5"
        />

        <TableContainer
          columns={columns}
          data={listOfProductData || []}
          isGlobalFilter={true}
          customPageSize={5}
          divClass="table-responsive mb-1"
          tableClass="mb-0 align-middle table-border table-wrap"
          theadClass="table-light text-muted text-wrap"
          SearchPlaceholder="Search Color"
          manualPagination={false}
        />
      </Form>
    </Fragment>
  );
};

export default SamplePage;
