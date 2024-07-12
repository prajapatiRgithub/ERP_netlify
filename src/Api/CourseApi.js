import { ADDCOURSE, EDITCOURSE, DELETECOURSE, COURSELIST, COURSEVIEW } from "./apiRoutes";
import { authData } from "./Service";

export const addCourseApi = async (data) => {
    const response = await authData.post(ADDCOURSE, data);
    return response?.data;
};
export const editCourseApi = async (id, data) => {
    const response = await authData.put(`${EDITCOURSE}${id}`, data);
    return response?.data;
};
export const listCourseApi = async (data) => {
    const response = await authData.post(COURSELIST, data);
    return response?.data;
};
export const viewCourseApi = async (id) => {
    const response = await authData.get(`${COURSEVIEW}${id}`);
    return response?.data;
};
export const deleteCourseApi = async (id) => {
    const response = await authData.delete(`${DELETECOURSE}${id}`);
    return response?.data;
};

  