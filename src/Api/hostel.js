import { ADDHOSTEL, EDITHOSTEL, EDITSTATUSHOSTEL, EXPORTHOSTEL, LISTOFHOSTEL, VIEWHOSTEL } from "./apiRoutes";
import { authData } from "./Service";

export const listOfHostel = async (data) => {
    const response = await authData.post(LISTOFHOSTEL,data);
    return response?.data;
};
export const hostelAdd = async (data) => {
    const response = await authData.post(ADDHOSTEL,data);
    return response?.data;
};
export const hostelStatusEdit = async (id,data) => {
    const response = await authData.put(`${EDITSTATUSHOSTEL}${id}`,data);
    return response?.data;
};
export const hostelEdit = async (id,data) => {
    const response = await authData.put(`${EDITHOSTEL}${id}`,data);
    return response?.data;
};
export const viewHostel = async (id,data) => {
    const response = await authData.get(`${VIEWHOSTEL}${id}`,data);
    return response?.data;
};
export const exportHostelDetail = async () => {
    const response = await authData.get(EXPORTHOSTEL);
    return response?.data;
};