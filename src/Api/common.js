import {
  LISTOFCOURSE,
  LISTOFCENTER,
  FILEUPLOAD,
  LISTOFQUALIFICATION,
  VIEWBATCH,
  LISTOFCAREER,
  LISTOFSTATE,
  LISTOFDISTRICT,
  LISTOFCITY,
  COURSELISTOFCODE,
  LISTOFCOURSECENTERRWISE,
  EDITCAREERSTATUS,
} from "./apiRoutes";
import { authData, multipartData, nonAuthData } from "./Service";

export const centerApi = async (data) => {
  const response = await nonAuthData.post(LISTOFCENTER, data);
  return response?.data;
};
export const courseApi = async (data) => {
  const response = await nonAuthData.post(LISTOFCOURSE, data);
  return response?.data;
};
export const centerWiseCourse = async (data) => {
  const response = await nonAuthData.post(LISTOFCOURSECENTERRWISE, data);
  return response?.data;
};
export const qualificationApi = async (data) => {
  const response = await nonAuthData.post(LISTOFQUALIFICATION, data);
  return response?.data;
};
export const fileUploadApi = async (data) => {
  const response = await multipartData.post(FILEUPLOAD, data);
  return response?.data;
};

export const viewBatch = async (data) => {
  const response = await authData.post(VIEWBATCH, data);
  return response?.data;
};
export const listOfState = async (data) => {
  const response = await authData.post(LISTOFSTATE, data);
  return response?.data;
};
export const listOfDistrict = async (data) => {
  const response = await authData.post(LISTOFDISTRICT, data);
  return response?.data;
};
export const listOfCity = async (data) => {
  const response = await authData.post(LISTOFCITY, data);
  return response?.data;
};

export const listOfCreer = async (data) => {
  const response = await authData.post(LISTOFCAREER, data);
  return response?.data;
};
export const listCourseCodeApi = async (data) => {
  const response = await authData.post(COURSELISTOFCODE, data);
  return response?.data;
};
export const editCareerStatus = async (id,data) => {
  const response = await authData.put(`${EDITCAREERSTATUS}${id}`, data);
  return response?.data;
};
