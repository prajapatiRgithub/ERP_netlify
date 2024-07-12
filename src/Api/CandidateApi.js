import { ADDPLACEMENT, CANDIDATESTATUS, FILTEROFCANDIDATE, VIEWCANDIDATEDETAILS } from "./apiRoutes";
import { authData } from "./Service";

export const changeStatusApi = async (id, data) => {
    const response = await authData.put(`${CANDIDATESTATUS}${id}`, data);
    return response?.data;
};

export const listCandidateApi = async (data) => {
    const response = await authData.post(FILTEROFCANDIDATE, data);
    return response?.data;
};
export const addPlacement = async (data) => {
    const response = await authData.post(ADDPLACEMENT, data);
    return response?.data;
};
export const viewOfCandidate = async(id,data) => {
    const response = await authData.get(`${VIEWCANDIDATEDETAILS}${id}`, data);
    return response?.data;
}
  
  