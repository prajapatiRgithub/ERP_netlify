import { LOGIN } from "./apiRoutes";
import { nonAuthData } from "./Service";

export const loginApi = async (data) => {
    const response = await nonAuthData.post(LOGIN, data);
    return response?.data;
  };
  
  