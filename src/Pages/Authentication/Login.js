import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { PlaceHolderFormat } from "../../Constant/requireMessage";
import BaseInput from "../../BaseComponents/BaseInput/index";
import {
  Email,
  ForgotPassword,
  Password,
  SignIn,
  login,
  welcomeBack,
  Loading,
} from "../../Constant";
import { emailRegex, validationMessages } from "../../Constant/validation";
import { loginApi } from "../../Api/AuthApi";
import { toast } from "react-toastify";
import { StatusCodes } from "http-status-codes";
import { useNavigate } from "react-router-dom";
import BaseButton from "../../BaseComponents/BaseButton";
import { getSessionId, setItem } from "../../Constant/common";

const Login = () => {
  document.title = login;
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .required(validationMessages.required(Email))
        .matches(emailRegex, validationMessages.format(Email)),
      password: yup.string().required(validationMessages.required(Password)),
    }),
    onSubmit: (values) => {
      setLoader(true);
      loginApi(values)
        .then((resp) => {
          if (
            resp.statusCode === StatusCodes.ACCEPTED ||
            resp.statusCode === StatusCodes.OK ||
            resp.statusCode === StatusCodes.CREATED
          ) {
            toast.success(resp?.message);
            setItem("token", resp?.data?.token);
            navigate("/dashboard");
            getSessionId(resp?.data?.token);
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
    },
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-7">
          <div className="bg-img-cover"></div>
        </div>
        <div className="col-xl-5 p-0">
          <div className="login-card">
            <form
              className="theme-form login-form"
              onSubmit={loginForm.handleSubmit}
            >
              <div className="login-header text-center">
                <h4>{login}</h4>
                <h6>{welcomeBack}</h6>
              </div>
              <div className="login-social-title">
                <h5>{SignIn} With Email</h5>
              </div>
              <div className="form-group">
                <label>{Email}</label>
                <div className="input-group">
                  <BaseInput
                    name="email"
                    type="email"
                    icon={<i className="icon-email" />}
                    placeholder={PlaceHolderFormat(Email)}
                    handleChange={loginForm.handleChange}
                    handleBlur={loginForm.handleBlur}
                    value={loginForm.values.email}
                    touched={loginForm.touched.email}
                    error={loginForm.errors.email}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{Password}</label>
                <BaseInput
                  className="form-control"
                  name="password"
                  type="password"
                  icon={<i className="icon-lock" />}
                  placeholder={PlaceHolderFormat(Password)}
                  handleChange={loginForm.handleChange}
                  handleBlur={loginForm.handleBlur}
                  value={loginForm.values.password}
                  touched={loginForm.touched.password}
                  error={loginForm.errors.password}
                />
              </div>
              <div className="form-group d-flex justify-content-end">
                <a className="link">{ForgotPassword}</a>
              </div>
              <div className="form-group">
                <BaseButton
                  className="btn btn-pill btn-block d-flex align-items-center"
                  type="submit"
                  color="primary"
                  disabled={loader}
                  loader={loader}
                  children={loader ? Loading : SignIn}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
