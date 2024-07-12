import AddMoreCandidate from "../Pages/BatchAllocation/AddMoreCandidate";
import BatchAllocation from "../Pages/BatchAllocation/BatchAllocation";
import BatchList from "../Pages/BatchAllocation/BatchList";
import Inquiry from "../Pages/Inquiry";
import EditBatch from "../Pages/BatchAllocation/EditBatch";
import Category from "../Pages/Category/Category";
import Candidate from "../Pages/Candidate";
import EditInquiry from "../Pages/Inquiry/EdiInquiry";
import CareerList from "../Pages/Career/CareerList";
import CenterPage from "../Pages/Center";
import CoursePage from "../Pages/Course";
import Vendor from "../Pages/Vendor/Vendor";
import Bill from "../Pages/Bill";
import BillApproval from "../Pages/Bill/BillApproval";
import Attendance from "../Pages/Attendance";
import Notification from "../Pages/Notification/notification";
import Position from "../Pages/Position/Position";
import ViewCandidate from "../Pages/Candidate/viewCandidate";
import Tot from "../Pages/Tot/Tot";
import Placement from "../Pages/Placement/Placement";
import AddPlacement from "../Pages/Placement/addPlacement";
import Staff from "../Pages/Staff";
import Accreditation from "../Pages/Accreditation";
import Hostel from "../Pages/Hostel/hostel";
import ViewHostel from "../Pages/Hostel/viewHostel";
import Class from "../Pages/Class";
import ClassDetails from "../Pages/Class/classDetails";
import Stock from "../Pages/Stock/stock";
import Inventory from "../Pages/Inventory/inventory";
import ViewInventory from "../Pages/Inventory/viewInventory";
import StaffLeave from "../Pages/Hr/StaffLeave";
import Layout from "../Pages/Hr Layout/Layout";
import SalaryOverview from "../Pages/Hr/SalaryOverview";
import HrLayout from "../Pages/Hr Layout/Layout";
import StaffHR from "../Pages/HR_Staff";
import StaffProfile from "../Pages/HR_Staff/staffProfile";

export const routes = [
  { path: `/dashboard/`, Component: <Inquiry /> },
  { path: `/batchcreation`, Component: <BatchAllocation /> },
  
  {
    path: `/batchlist`,
    title: "Batch List",
    Component: <BatchList />,
    type: "link",
  },
  {
    path: `/editbatch/:batchId`,
    title: "Batch List",
    Component: <EditBatch />,
    type: "link",
  },
  {
    path: `/addcandidate/:batchId`,
    title: "Batch List",
    Component: <AddMoreCandidate />,
    type: "link",
  },
  { path: `/editinquiry/:id`, Component: <EditInquiry /> },
  { path: `/candidate`, Component: <Candidate /> },
  { path: `/center`, Component: <CenterPage /> },
  { path: `/category`, title: "Master", Component: <Category />, type: "link" },
  { path: `/course`, Component: <CoursePage /> },
  { path: `/career`, title: "Master", Component: <CareerList />, type: "link" },
  { path: `/vendor`, title: "Master", Component: <Vendor />, type: "link" },
  { path: `/bill`, Component: <Bill />, type: "link" },
  { path: `/billApproval`, Component: <BillApproval />, type: "link" },
  { path: `/attendance`, Component: <Attendance />, type: "link" },
  { path: `/allnotificationlist`, Component: <Notification />, type: "link" },
  { path: `/position`, title: "Master", Component: <Position />, type: "link" },
  { path: `/stock`, title: "Master", Component: <Stock />, type: "link" },
  {
    path: `/viewCandidate/:candidateId`,
    title: "Batch List",
    Component: <ViewCandidate />,
    type: "link",
  },
  { path: `/tot`, title: "Other", Component: <Tot />, type: "link" },
  {
    path: `/placement`,
    title: "Other",
    Component: <Placement />,
    type: "link",
  },
  {
    path: `/addPlacement/:can_id`,
    title: "Other",
    Component: <AddPlacement />,
    type: "link",
  },
  {
    path: `/inventory`,
    title: "Other",
    Component: <Inventory />,
    type: "link",
  },
  {
    path: `/viewInventory/:invId`,
    title: "Other",
    Component: <ViewInventory />,
    type: "link",
  },
  { path: `/staff`, Component: <Staff />, type: "link" },
  { path: `/accreditation`, Component: <Accreditation />, type: "link" },
  { path: `/hostel`, Component: <Hostel />, type: "link" },
  { path: `/viewHostel/:hostelId`, Component: <ViewHostel />, type: "link" },
  { path: `/class`, Component: <Class />, type: "link" },
  { path: `/classDetails/:classId`, Component: <ClassDetails />, type: "link" },
  { path: `/staff-leave`, Component: <StaffLeave />, type: "link" },
  { path: `/layout`, Component: <Layout />, type: "link" },
  {
    path: `/salaryOverview`,
    Component: <HrLayout component={<SalaryOverview />} />,
    type: "link",
  },
  { path: `/staffhr`, Component: <StaffHR />, type: "link" },
  { path: `/staffProfile`, Component: <StaffProfile />, type: "link" },
  { path: `/staffProfile/:staffId`, Component: <StaffProfile />, type: "link" },
];
