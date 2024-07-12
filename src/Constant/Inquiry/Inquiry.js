export const inquiry = "Inquiry";
export const Aadhar = "Aadhar Number";
export const AadharBack = "Aadhar Card Back";
export const AadharFront = "Aadhar Card Front";
export const BankPassbook = "Bank Passbook/Statement";
export const Endorse = "Endorse";
export const FatherName = "Father Name";
export const MotherName = "Mother Name";
export const Qualification = "Qualification";
export const QualificationCertificate = "Qualification Certificate";
export const batch = "Batch Id";
export const validationMsg = "File size exceeds the limit (1MB)";
export const batchTime = "Batch Time";
export const candidateName = "Candidate Name";
export const center = "Center Name";
export const courseName = "Course Name";
export const Source = "Source";
export const editInquiryErrorForFile =
  "Invalid file type. Only JPEG, JPG, PNG, and PDF files are allowed.";
export const editInquiryErrorForFileSize = "File size exceeds the limit (1MB).";
export const course = "Course Interested";
export const courseLabel = "course";
export const editInquiry = "Edit Inquiry";
export const passport = "Passport Photo";
export const reference = "Reference";
export const sector = "Sector";
export const viewFile = "View File";
export const PendingLabel = "pending";
export const errorMessageEndorse =
  "Endorse is not eligible due to below errors";
export const EndoreMessage = "Are you sure you want to endorse this candidate?";
export const hostelMessage = "Are you going to stay in Hostel?";
export const fileSizeMessage =
  "Note: All Files size must be less than or equal to 1MB.(Accepted file extension are jpg,jpeg,png,doc,docx,pdf)";
export const passportAccess = "passport_photo";
export const aadharFrontAccess = "aadharCard_front";
export const aadharBackAccess = "aadharCard_back";
export const bankAccess = "bank_passbook";
export const qualCertiAccess = "qualification_certificate";

export const allowedFileTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];
export const ACCESSOR_KEYS = {
  SERIAL_NUMBER: "serial_number",
  CANDIDATE_NAME: "candidate_name",
  CONTACT_NO: "contact_no",
  CENTER_NAME: "center.center_name",
  COURSE_NAME: "course.course_name",
  SOURCE: "source",
  REFERENCE: "reference",
  STATUS: "status",
  ACTION: "action",
};

export const radioOptions = [
  { id: "radioinline1", value: "Male", label: "Male", labelSuffix: "" },
  { id: "radioinline2", value: "Female", label: "Female", labelSuffix: "" },
  { id: "radioinline3", value: "Other", label: "Other", labelSuffix: "" },
];

export const QualificationOptions = [
  { id: 1, value: "HSC", label: "HSC" },
  { id: 2, value: "SSC", label: "SSC" },
  { id: 3, value: "Diploma", label: "Diploma" },
  { id: 4, value: "Bachelor's Degree", label: "Bachelor's Degree" },
];
export const CategoryOptions = [
  { id: 1, value: "General", label: "General" },
  { id: 2, value: "General EWS", label: "General-EWS" },
  { id: 3, value: "OBC", label: "OBC (SCBC)" },
  { id: 4, value: "SC", label: "SC" },
  { id: 5, value: "ST", label: "ST" },
];

export const StatusOptions = [
  { value: "", label: "Select Status" },
  { value: "Certified", label: "Certified" },
  { value: "Reassessment", label: "Reassessment" },
  { value: "Assessment", label: "Assessment" },
  { value: "Not Certified", label: "Not Certified" },
  { value: "Drop Out", label: "Drop Out" },
];
