import {
  ADDTOT,
  DELETETOT,
  EDITTOT,
  EXPORTTOT,
  LISTOFTOT,
  LISTOFUSERS,
  VIEWTOT,
} from "./apiRoutes";
import { authData } from "./Service";

export const listOfTot = async (data) => {
  const response = await authData.post(LISTOFTOT, data);
  return response?.data;
};
export const addTot = async (data) => {
  const response = await authData.post(ADDTOT, data);
  return response?.data;
};
export const editTot = async (id, data) => {
  const response = await authData.put(`${EDITTOT}${id}`, data);
  return response?.data;
};
export const deleteTot = async (id) => {
  const response = await authData.delete(`${DELETETOT}${id}`);
  return response?.data;
};
export const viewTot = async (id, data) => {
  const response = await authData.get(`${VIEWTOT}${id}`, data);
  return response?.data;
};
export const listOfUser = async (data) => {
  const response = await authData.post(LISTOFUSERS, data);
  return response?.data;
};
export const exportTot = async (data) => {
  const response = await authData.get(EXPORTTOT, data);
  return response?.data;
};
