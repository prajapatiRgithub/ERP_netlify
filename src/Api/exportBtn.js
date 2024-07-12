import { authData } from "./Service";
import { EXPORTACCREDITATIONLIST, EXPORTBATCHLIST, EXPORTPLACEMENTLIST } from "./apiRoutes";

export const exportBatchList = async () => {
  const response = await authData.get(EXPORTBATCHLIST);
  return response?.data;
};

export const exportPlacementList = async () => {
  const response = await authData.get(EXPORTPLACEMENTLIST);
  return response?.data;
};

export const exportAccreditation = async () => {
  const response = await authData.get(EXPORTACCREDITATIONLIST);
  return response?.data;
};
