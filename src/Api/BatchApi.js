import {
  ADDBATCH,
  CANDIDATELIST,
  CANDIDATESATUTS,
  CENTERWISECOURSEQPCODE,
  COURSELIST,
  COURSELISTOFCODE,
  DELETEBATCH,
  EDITBATCH,
  EXPORTBATCHDATA,
  FILTERATTENDANCE,
  IMPORTATTENDANCE,
  IMPORTBATCHDATA,
  LISTATTENDANCE,
  LISTOFBATCH,
  LISTOFCANDIDATE,
  LISTOFCANDIDATEFORFILTER,
} from "./apiRoutes";
import { authData, multipartDataWithToken } from "./Service";

export const listOfCourse = async (data) => {
  const response = await authData.post(COURSELIST, data);
  return response?.data;
};
export const courseCodeList = async (data) => {
  const response = await authData.post(COURSELISTOFCODE, data);
  return response?.data;
};
export const courseCodeQPList = async (data) => {
  const response = await authData.post(CENTERWISECOURSEQPCODE, data);
  return response?.data;
};

export const candidateList = async (data) => {
  const response = await authData.post(LISTOFCANDIDATE, data);
  return response?.data;
};
export const AddBatch = async (data) => {
  const response = await authData.post(ADDBATCH, data);
  return response?.data;
};
export const listOfBatch = async (data) => {
  const response = await authData.post(LISTOFBATCH, data);
  return response?.data;
};
export const editBatch = async (id, data) => {
  const response = await authData.put(`${EDITBATCH}/${id}`, data);
  return response?.data;
};
export const deleteBatch = async (id, data) => {
  const response = await authData.put(`${DELETEBATCH}/${id}`, data);
  return response?.data;
};

export const ListOfCandidate = async (data) => {
  const response = await authData.post(CANDIDATELIST, data);
  return response?.data;
};
export const candidateSatuts = async (Id, data) => {
  const response = await authData.put(`${CANDIDATESATUTS}${Id}`, data);
  return response?.data;
};

export const importBatchData = async (data) => {
  const response = await multipartDataWithToken.post(IMPORTBATCHDATA, data);
  return response?.data;
};
export const importAttendanceData = async (data) => {
  const response = await multipartDataWithToken.post(IMPORTATTENDANCE, data);
  return response?.data;
};
export const listAttendanceData = async (data) => {
  const response = await authData.post(LISTATTENDANCE, data);
  return response?.data;
};
export const filterAttendanceData = async (data) => {
  const response = await authData.post(FILTERATTENDANCE, data);
  return response?.data;
};
export const listCandidateFilter = async (data) => {
  const response = await authData.post(LISTOFCANDIDATEFORFILTER, data);
  return response?.data;
};
export const exportBatchData = async (Id, data) => {
  const response = await authData.post(`${EXPORTBATCHDATA}${Id}`, data);
  return response?.data;
};
