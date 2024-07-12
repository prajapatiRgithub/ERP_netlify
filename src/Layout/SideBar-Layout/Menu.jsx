import {
  Bookmark,
  AlertOctagon,
  CheckSquare,
  CreditCard,
  Edit,
  FileText,
  Grid,
  Home,
  Layers,
  Server,
  Trello,
  User,
  UserPlus,
  Users,
  BookOpen,
  Pocket,
  Clipboard,
  MapPin,
  Package,
} from "react-feather";

export const MENUITEMS = [
  {
    menutitle: "Mobilization",
    Items: [
      {
        title: "Mobilization",
        icon: Home,
        type: "sub",
        active: false,
        children: [
          { path: `/dashboard`, title: "Inquiry", type: "link", icon: Grid },
          {
            path: `/batchcreation`,
            title: "Batch Creation",
            type: "link",
            icon: Edit,
          },
          {
            path: `/batchlist`,
            title: "Batch List",
            type: "link",
            icon: Server,
          },
          { path: `/candidate`, title: "Candidate", type: "link", icon: User },
          {
            path: `/attendance`,
            title: "Attendance",
            type: "link",
            icon: Users,
          },
        ],
      },
    ],
  },
  {
    menutitle: "Master",
    Items: [
      {
        title: "Master",
        icon: Layers,
        type: "sub",
        active: false,
        children: [
          { path: `/center`, title: "Center", type: "link", icon: MapPin },
          { path: `/course`, title: "Course", type: "link", icon: FileText },
          { path: `/category`, title: "Category", type: "link", icon: Trello },
          { path: `/career`, title: "Career", type: "link", icon: Users },
          { path: `/position`, title: "Position", type: "link", icon: User },
          { path: `/stock`, title: "Stock", type: "link", icon: Package },
        ],
      },
    ],
  },
  {
    menutitle: "Account",
    Items: [
      {
        title: "Account",
        icon: User,
        type: "sub",
        active: false,
        children: [
          { path: `/vendor`, title: "Vendor", type: "link", icon: User },
          { path: `/bill`, title: "Bill", type: "link", icon: CreditCard },
          {
            path: `/billApproval`,
            title: "Bill Approval",
            type: "link",
            icon: CheckSquare,
          },
          { path: `/hostel`, title: "Hostel", type: "link", icon: Home },
          { path: `/class`, title: "Class", type: "link", icon: BookOpen },
        ],
      },
    ],
  },
  {
    menutitle: "Other",
    Items: [
      {
        title: "Other",
        icon: Grid,
        type: "sub",
        active: false,
        children: [
          { path: `/staff`, title: "Staff", type: "link", icon: UserPlus },
          { path: `/tot`, title: "Tot", type: "link", icon: Bookmark },
          {
            path: `/accreditation`,
            title: "Accreditation",
            type: "link",
            icon: AlertOctagon,
          },
          {
            path: `/placement`,
            title: "Placement",
            type: "link",
            icon: Pocket,
          },
          {
            path: `/inventory`,
            title: "Inventory",
            type: "link",
            icon: Clipboard,
          },
        ],
      },
    ],
  },

  {
    menutitle: "HR",
    Items: [
      {
        title: "HR",
        icon: Grid,
        type: "sub",
        active: false,
        children: [
          { path: `/staff-leave`, title: "Staff Leave", type: "link", icon: User },
          { path: `/staffhr`, title: "Staff List", type: "link", icon: UserPlus },
        ],
      },
    ],
  },
];
