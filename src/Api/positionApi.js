import { ADDPOSITION, DELETEPOSITION, EDITPOSITION, LISTOFPOSITION } from "./apiRoutes";
import { authData } from "./Service";

export const addPositionApi = async (data) => {
    const response = await authData.post(ADDPOSITION, data);
    return response?.data;
};
export const listOfPositionApi = async (data) => {
    const response = await authData.post(LISTOFPOSITION, data);
    return response?.data;
};
export const editPositionApi = async (id, data) => {
const response = await authData.put(`${EDITPOSITION}/${id}`, data);
return response?.data;
};
export const deletePositionApi = async (id) => {
const response = await authData.delete(`${DELETEPOSITION}/${id}`);
return response?.data;
};