import {
  ADDBILL,
  EDITBILL,
  EDITBILLSTATUS,
  LISTOFBILL,
  LISTOFSERVICE,
  LISTOFUSERS,
  LISTOFVENDORNAME,
  VIEWBILL,
  VIEWVENDORDETAIL,
} from "./apiRoutes";
import { authData } from "./Service";

export const addBillApi = async (data) => {
  const response = await authData.post(ADDBILL, data);
  return response?.data;
};
export const editBillApi = async (id, data) => {
  const response = await authData.put(`${EDITBILL}${id}`, data);
  return response?.data;
};
export const listBillApi = async (data) => {
  const response = await authData.post(LISTOFBILL, data);
  return response?.data;
};
export const listServiceApi = async (data) => {
  const response = await authData.post(LISTOFSERVICE, data);
  return response?.data;
};
export const listVendorNameApi = async (data) => {
  const response = await authData.post(LISTOFVENDORNAME, data);
  return response?.data;
};
export const listUsersApi = async (data) => {
  const response = await authData.post(LISTOFUSERS, data);
  return response?.data;
};
export const changeStatusApi = async (id, data) => {
  const response = await authData.put(`${EDITBILLSTATUS}${id}`, data);
  return response?.data;
};
export const viewBillApi = async (id) => {
  const response = await authData.get(`${VIEWBILL}${id}`);
  return response?.data;
};
export const viewVendorNameApi = async (id) => {
  const response = await authData.get(`${VIEWVENDORDETAIL}${id}`);
  return response?.data;
};
