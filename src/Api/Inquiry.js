import { EDITINQUIRY, ENDORSE, INQUIRY, LISTOFINQUIRY, VIEWCANDIDATE } from "./apiRoutes";
import { authData } from "./Service";

export const addInquiry = async (data) => {
    const response = await authData.post(INQUIRY, data);
    return response?.data;
};
export const editInquiryApi = async (id, data) => {
    const response = await authData.put(`${EDITINQUIRY}${id}`, data);
    return response?.data;
};
  
export const listInquiryApi = async (data) => {
    const response = await authData.post(LISTOFINQUIRY, data);
    return response?.data;
};
export const endorseApi = async (id) => {
    const response = await authData.put(`${ENDORSE}${id}`);
    return response?.data;
};
export const viewCnadidateData = async (id,data) => {
    const response = await authData.get(`${VIEWCANDIDATE}${id}`, data);
    return response?.data;
};



  
  