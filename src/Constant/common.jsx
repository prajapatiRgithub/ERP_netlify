import { batchallocationLabel } from "./BatchAllocation/batchallocation";
import { jwtDecode } from "jwt-decode";

export const getItem = (key) => {
  sessionStorage.getItem(key);
};
export const setItem = (key, value) => {
  sessionStorage.setItem(key, value);
};

export const getSessionId = (token) => {
  const decoded = jwtDecode(token);
  sessionStorage.setItem("id", decoded && decoded?.id);
  sessionStorage.setItem("name", decoded && decoded?.name);
};

export const clearItem = () => {
  sessionStorage.clear();
};
export const isAuthenticated = () => {
  return !!sessionStorage.getItem("token");
};
export const setCourseIdInSessionStorage = (courseId) => {
  sessionStorage.setItem(batchallocationLabel.courseId, courseId);
};

export const getCourseIdFromSessionStorage = () => {
  return sessionStorage.getItem(batchallocationLabel.courseId);
};

export const setClassIdInSessionStorage = (classId) => {
  sessionStorage.setItem("classID", classId);
};

export const getClassIdFromSessionStorage = () => {
  return sessionStorage.getItem("classID");
};

export const setBatchIdInSessionStorage = (batchId) => {
  sessionStorage.setItem("batchID", batchId);
};

export const getBatchIdFromSessionStorage = () => {
  return sessionStorage.getItem("batchID");
};

export const setInventoryIdInSessionStorage = (inventoryId) => {
  sessionStorage.setItem("inventoryID", inventoryId);
};

export const getInventoryIdFromSessionStorage = () => {
  return sessionStorage.getItem("inventoryID");
};

export const setStaffIdInSessionStorage = (id) => {
  sessionStorage.setItem("staffID", id);
};

export const getStaffIdFromSessionStorage = () => {
  return sessionStorage.getItem("staffID");
};

export const handleResponse = {
  dataNotFound: "Sorry! No Result Found.",
  nullData: "---",
  somethingWrong: "Something went wrong.",
  all: "All",
};

export const handleEditClick = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const tooltipconstants = {
  viewAttendace: "View Attendance",
};

export const notificationData = [
  {
    message: "Bill Approval Request",
    link: "/billApproval",
    iconClass: "font-primary",
    time: "10 min.",
  },
  {
    message: "Your Batch will expire in one week",
    link: "/batchlist",
    iconClass: "font-success",
    time: "1 hr",
  },
];

export const notificationLable = {
  allNotification: "All Reminder",
  viewAll: "View all",
  toastMessage: "Reminder deleted successfully",
  deleteBody: "Are you sure you want to delete this notification?",
  refresh: "Refresh",
  select: "Select All",
  deselect: "Deselect All",
  markAllAsRead: "Mark All as Read",
  clearAll: "Clear All",
  markSelectedRead: "Mark Selected as Read",
  clearSelected: "Clear Selected",
  noNotification: "No notifications available",
  seeMore: "See More",
  Action: "Action",
};

export const Deselect_all = "Deselect All";
export const Select_all = "Select All";

export const role = {
  trainer: "Trainer",
  staff:"Staff"
};
