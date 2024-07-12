import { authData } from "./Service";
import { LISTOFNOTIFICATION, MARKASREAD, CLEARNOTIFICATION } from "./apiRoutes";

export const listOfNotificationApi = async () => {
    const response = await authData.get(LISTOFNOTIFICATION);
    return response?.data;
};

export const markAsReadApi = async (data) => {
    const response = await authData.put(MARKASREAD, data);
    return response?.data;
};

export const clearNotificationApi = async (data) => {
    const response = await authData.delete(CLEARNOTIFICATION, {data});
    return response?.data;
};