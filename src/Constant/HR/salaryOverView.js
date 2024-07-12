export const Earnings = "Earnings";
export const Full = "Full";
export const Actual = "Actual";
export const Deductions = "Deductions";
export const GrossEarning = "Gross Earning";
export const TotalDeductions = "Total Deductions";
export const Adjustments = "Adjustments";
export const Payments = "Payments";
export const DueAmount = "Due Amount";
export const NetPayable =
  " Net Payable Amount (Gross Earnings - Total Deductions)";
export const StaffId = "ID 9 Regular"

export const dataEntries = [
  {
    id: 1,
    month: "July 2024",
    duration: "01 July 2024 - 31 July 2024",
    earnings: [{ label: "System Basic", full: "₹ 18,000", actual: "₹ 0" }],
    deductions: [
      { label: "Tax", full: "₹ 5,000", actual: "₹ 0" },
      { label: "Insurance", full: "₹ 2,000", actual: "₹ 0" },
    ],
    netPayable: {
      grossEarnings: "₹ 23,000",
      totalDeductions: "₹ 7,000",
      netAmount: "₹ 16,000",
    },
    adjustments: "₹ 0",
    payments: "₹ 0",
    dueAmount: "₹ 0",
  },
  {
    id: 2,
    month: "August 2024",
    duration: "01 August 2024 - 31 August 2024",
    earnings: [
      { label: "System Basic", full: "₹ 18,000", actual: "₹ 0" },
      { label: "Bonus", full: "₹ 10,000", actual: "₹ 0" },
      // Add more earnings data as needed
    ],
    deductions: [
      { label: "Tax", full: "₹ 5,000", actual: "₹ 0" },
      { label: "Insurance", full: "₹ 2,000", actual: "₹ 0" },
      // Add more deductions data as needed
    ],
    netPayable: {
      grossEarnings: "₹ 28,000",
      totalDeductions: "₹ 7,000",
      netAmount: "₹ 21,000",
    },
    adjustments: "₹ 0",
    payments: "₹ 0",
    dueAmount: "₹ 0",
  },
  {
    id: 3,
    month: "September 2024",
    duration: "01 September 2024 - 30 September 2024",
    earnings: [
      { label: "System Basic", full: "₹ 18,000", actual: "₹ 0" },
      { label: "Commission", full: "₹ 8,000", actual: "₹ 0" },
    ],
    deductions: [
      { label: "Tax", full: "₹ 5,000", actual: "₹ 0" },
      { label: "Insurance", full: "₹ 2,000", actual: "₹ 0" },
    ],
    netPayable: {
      grossEarnings: "₹ 26,000",
      totalDeductions: "₹ 7,000",
      netAmount: "₹ 19,000",
    },
    adjustments: "₹ 0",
    payments: "₹ 0",
    dueAmount: "₹ 0",
  },
  // Add more data entries as needed
];
