import { ADDCENTER, CENTERLIST, DELETECENTER, EDITCENTER } from "./apiRoutes";
import { authData } from "./Service";

export const addCenterApi = async (data) => {
    const response = await authData.post(ADDCENTER, data);
    return response?.data;
};
export const editCenterApi = async (id, data) => {
    const response = await authData.put(`${EDITCENTER}${id}`, data);
    return response?.data;
};
export const listCenterApi = async (data) => {
    const response = await authData.post(CENTERLIST, data);
    return response?.data;
};
export const deleteCenterApi = async (id) => {
    const response = await authData.delete(`${DELETECENTER}${id}`);
    return response?.data;
};

  