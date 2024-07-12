import {
  ADDPLACEMENT,
  ADDSALARYSLIP,
  EDITPLACEMENT,
  EDITSALARYSLIP,
  LISTOFPLACMENT,
  LISTOFSALARYSLIP,
  PLACEMENTCANDIDATE,
  VIEWPLACEMENT,
} from "./apiRoutes";
import { authData } from "./Service";

export const listOfPlacement = async (data) => {
  const response = await authData.post(LISTOFPLACMENT, data);
  return response?.data;
};
export const addPlacement = async (data) => {
  const response = await authData.post(ADDPLACEMENT, data);
  return response?.data;
};
export const listOfPlacementCandidate = async (data) => {
  const response = await authData.post(PLACEMENTCANDIDATE, data);
  return response?.data;
};
export const addSalarySlip = async (data) => {
  const response = await authData.post(ADDSALARYSLIP, data);
  return response?.data;
};
export const editSalarySlip = async (id, data) => {
  const response = await authData.put(`${EDITSALARYSLIP}${id}`, data);
  return response?.data;
};
export const editPlacement = async (id, data) => {
  const response = await authData.put(`${EDITPLACEMENT}${id}`, data);
  return response?.data;
};
export const viewPlacementCandidate = async (id, data) => {
  const response = await authData.get(`${VIEWPLACEMENT}${id}`, data);
  return response?.data;
};
export const listOfSalarySlipDetail = async (data) => {
  const response = await authData.post(LISTOFSALARYSLIP, data);
  return response?.data;
};
