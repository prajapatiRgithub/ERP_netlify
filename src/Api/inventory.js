import { authData } from "./Service";
import {
  ADDINVENTORY,
  DELETEINVENTORYHISTORY,
  EDITINVENTORY,
  LISTOFINVENTORY,
  STOCKTYPELIST,
  VIEWINVENTORY,
} from "./apiRoutes";

export const listofInventory = async (data) => {
  const response = await authData.post(LISTOFINVENTORY, data);
  return response?.data;
};

export const inventoryAdd = async (data) => {
  const response = await authData.post(ADDINVENTORY, data);
  return response?.data;
};

export const inventoryEdit = async (id, data) => {
  const response = await authData.put(`${EDITINVENTORY}/${id}`, data);
  return response?.data;
};

export const viewInventory = async (id, data) => {
  const response = await authData.post(`${VIEWINVENTORY}/${id}`, data);
  return response?.data;
};

export const listofStocktype = async (data) => {
  const response = await authData.post(STOCKTYPELIST, data);
  return response?.data;
};

export const DeleteInventoryHistory = async (id, data) => {
  const response = await authData.delete(
    `${DELETEINVENTORYHISTORY}/${id}`,
    data
  );
  return response?.data;
};
