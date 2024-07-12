import { LISTOFCLASS, VIEWCLASS, LISTOFMILESTONE, EDITMILESTONE, EDITSTATUS, EXPORTCLASS } from "./apiRoutes";
import { authData } from "./Service";

export const listOfClassApi = async (data) => {
    const response = await authData.post(LISTOFCLASS, data);
    return response?.data;
};
export const viewClassApi = async (id, data) => {
    const response = await authData.get(`${VIEWCLASS}${id}`, data);
    return response?.data;
};
export const listOfMilestoneApi = async (data) => {
    const response = await authData.post(LISTOFMILESTONE, data);
    return response?.data;
}
export const editMilestoneApi =  async (id,data) => {
    const response = await authData.put(`${EDITMILESTONE}${id}`, data);
    return response?.data;
}
export const editStatusApi = async (id,data) => {
    const response = await authData.put(`${EDITSTATUS}${id}`, data);
    return response?.data;
}
export const exportClass = async () => {
    const response = await authData.get(EXPORTCLASS);
    return response?.data;
};