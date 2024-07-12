import React, { useState } from "react";
import moment from "moment";
import "../../../src/hr.css";
import {
  RiArrowRightSLine,
  RiArrowLeftSLine,
  RiSearchLine,
} from "react-icons/ri";
import BaseInput from "../../BaseComponents/BaseInput";
import BaseModal from "../../BaseComponents/BaseModal";

const StaffLeave = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [presentModal, setPresentModal] = useState(false);
  const [paidLeaveModal, setPaidLeaveModal] = useState(false);
  const [compModal, setCompModal] = useState(false);
  const [logModal, setLogModal] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [halfDayModal, setHalfDayModal] = useState(false);

  const incrementDate = () => {
    setSelectedDate(moment(selectedDate).add(1, "days").toDate());
  };

  return (
    <div>
      <div>
        <div className="px-3">
          <h5 className="f-w-600">Attendance Summary</h5>
        </div>
        <div className="card pt-3 mx-3">
          <div className="attendance-summary container">
            {/* Staff Date to data  */}

            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card p-3">
                    <div className="card-body d-md-flex d-block justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <RiArrowLeftSLine className="fs-4" />
                        <span className="mx-3">
                          {moment(selectedDate).format("DD MMM YYYY")} |{" "}
                          {moment(selectedDate).format("dddd").toUpperCase()}
                        </span>
                        <RiArrowRightSLine
                          className="fs-4"
                          onClick={incrementDate}
                        />
                        <BaseInput
                          type="date"
                          name="date"
                          className="form-control w-25 mx-3"
                          value={moment(selectedDate).format("YYYY-MM-DD")}
                        />
                      </div>
                      <div className="d-flex flex-grow-1 flex-wrap justify-content-lg-end justify-content-start">
                        <div className="text-center me-3 mb-3 mb-lg-0 flex-grow-1">
                          <div>Total Staff</div>
                          <div>
                            <strong>13</strong>
                          </div>
                        </div>
                        <div className="text-center me-3 mb-3 mb-lg-0 flex-grow-1">
                          <div>Present</div>
                          <div>
                            <strong>6</strong>
                          </div>
                        </div>
                        <div className="text-center me-3 mb-3 mb-lg-0 flex-grow-1">
                          <div>Absent</div>
                          <div>
                            <strong>1</strong>
                          </div>
                        </div>
                        <div className="text-center me-3 mb-3 mb-lg-0 flex-grow-1">
                          <div>Half Day</div>
                          <div>
                            <strong>0</strong>
                          </div>
                        </div>
                        <div className="text-center me-3 mb-3 mb-lg-0 flex-grow-1">
                          <div>Comp Off</div>
                          <div>
                            <strong>2</strong>
                          </div>
                        </div>
                        <div className="text-center mb-3 mb-lg-0 flex-grow-1">
                          <div>Paid Leave</div>
                          <div>
                            <strong>0</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Section  */}

            <div className="d-flex flex-grow-1 justify-content-end">
              <div className="col-4 d-flex justify-content-end">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <RiSearchLine className="fs-size" />
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control fs-8"
                    placeholder="Search Staff"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Staff Listing Section */}
          <div className="staff-list container">
            <div className="card mt-2">
              <div className="card-body row">
                <div className="info col-lg-4">
                  <h6>
                    Deepak Kumar <small>D18</small>
                  </h6>
                  <div>0:00 Hrs</div>
                  <div>10:25 AM - NA</div>
                  <div>
                    <a
                      className="text-primary"
                      onClick={() => setNoteModal(true)}
                    >
                      Add Note
                    </a>{" "}
                    |{" "}
                    <a
                      className="text-primary"
                      onClick={() => setLogModal(true)}
                    >
                      View Logs
                    </a>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="row">
                    <div
                      className="col-md-3 grid-item border bg-success active px-3"
                      onClick={() => setPresentModal(true)}
                    >
                      P | 10:25 AM - NA
                    </div>
                    <div
                      className="col-md-4 grid-item border px-3"
                      onClick={() => setHalfDayModal(true)}
                    >
                      HD | Half Day
                    </div>
                    <div
                      className="col-md-4 grid-item border px-3"
                      onclick="toggleDangerClass(this)"
                    >
                      A | Absent
                    </div>
                    <div
                      className="col-md-4 grid-item border px-3"
                      onClick={() => setCompModal(true)}
                    >
                      CO | Comp Off
                    </div>
                    <div
                      className="col-md-4 grid-item border px-3"
                      onClick={() => setPaidLeaveModal(true)}
                    >
                      L | Paid Leave
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mt-2">
              <div className="card-body row">
                <div className="info col-lg-4">
                  <h6>
                    Priya Sharma <small>D19</small>
                  </h6>
                  <div>0:00 Hrs</div>
                  <div>10:25 AM - NA</div>
                  <div>
                    <a
                      className="text-primary"
                      onClick={() => setNoteModal(true)}
                    >
                      Add Note
                    </a>{" "}
                    |{" "}
                    <a
                      className="text-primary"
                      onClick={() => setLogModal(true)}
                    >
                      View Logs
                    </a>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="row">
                    <div
                      className="col-md-3 grid-item border bg-success active px-3"
                      onClick={() => setPresentModal(true)}
                    >
                      P | 10:25 AM - NA
                    </div>
                    <div
                      className="col-md-4 grid-item border px-3"
                      onClick={() => setHalfDayModal(true)}
                    >
                      HD | Half Day
                    </div>
                    <div
                      className="col-md-4 grid-item border px-3"
                      onclick="toggleDangerClass(this)"
                    >
                      A | Absent
                    </div>
                    <div
                      className="col-md-4 grid-item border px-3"
                      onClick={() => setCompModal(true)}
                    >
                      CO | Comp Off
                    </div>
                    <div
                      className="col-md-4 grid-item border px-3"
                      onClick={() => setPaidLeaveModal(true)}
                    >
                      L | Paid Leave
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mt-2">
              <div className="card-body row">
                <div className="info col-lg-4">
                  <h6>
                    Prachi Rathod <small>D21</small>
                  </h6>
                  <div className="text-danger">Not Marked</div>
                  {/* <div>10:25 AM - NA</div> */}
                  <div>
                    <a
                      className="text-primary"
                      onClick={() => setNoteModal(true)}
                    >
                      Add Note
                    </a>{" "}
                    |{" "}
                    <a
                      className="text-primary"
                      onClick={() => setLogModal(true)}
                    >
                      View Logs
                    </a>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="row">
                    <div
                      className="col-md-3 grid-item border px-3"
                      data-bs-toggle="modal"
                      data-bs-target="#attendanceModal"
                    >
                      P | 10:25 AM - NA
                    </div>
                    <div
                      className="col-md-4 grid-item border px-3"
                      data-bs-toggle="modal"
                      data-bs-target="#halfModal"
                    >
                      HD | Half Day
                    </div>
                    <div
                      className="col-md-4 grid-item border deactive bg-danger px-3"
                      onclick="toggleDangerClass(this)"
                    >
                      A | Absent
                    </div>
                    <div
                      className="col-md-4 grid-item border px-3"
                      data-bs-toggle="modal"
                      data-bs-target="#compModal"
                    >
                      CO | Comp Off
                    </div>
                    <div className="col-md-4 grid-item border px-3">
                      L | Paid Leave
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mt-2">
              <div className="card-body row">
                <div className="info col-lg-4">
                  <h6>
                    Amit Kumar <small>D22</small>
                  </h6>
                  <div>0:00 Hrs</div>
                  <div>10:25 AM - NA</div>
                  <div>
                    <a
                      className="text-primary"
                      onClick={() => setNoteModal(true)}
                    >
                      Add Note
                    </a>{" "}
                    |{" "}
                    <a
                      className="text-primary"
                      onClick={() => setLogModal(true)}
                    >
                      View Logs
                    </a>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="row">
                    <div
                      className="col-md-3 grid-item border bg-success active px-3"
                      onClick={() => setPresentModal(true)}
                    >
                      P | 10:25 AM - NA
                    </div>
                    <div
                      className="col-md-4 grid-item border px-3"
                      onClick={() => setHalfDayModal(true)}
                    >
                      HD | Half Day
                    </div>
                    <div
                      className="col-md-4 grid-item border px-3"
                      onclick="toggleDangerClass(this)"
                    >
                      A | Absent
                    </div>
                    <div
                      className="col-md-4 grid-item border px-3"
                      onClick={() => setCompModal(true)}
                    >
                      CO | Comp Off
                    </div>
                    <div
                      className="col-md-4 grid-item border px-3"
                      onClick={() => setPaidLeaveModal(true)}
                    >
                      L | Paid Leave
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Half Modal  */}
          <BaseModal
            isOpen={halfDayModal}
            toggler={() => setHalfDayModal(false)}
            title="Half Day"
            submitText="Submit"
          >
            <form id="attendanceForm">
              <div className="row">
                <div className="col-lg-12 mt-2">
                  <label htmlFor="inTime">In Time</label>
                  <div className="input-group">
                    <input
                      type="time"
                      name="inTime"
                      id="inTime"
                      className="form-control"
                      required=""
                    />
                  </div>
                </div>
                <div className="col-lg-12 mt-2">
                  <label htmlFor="outTime">Out Time</label>
                  <div className="input-group">
                    <input
                      type="time"
                      name="outTime"
                      id="outTime"
                      className="form-control"
                      required=""
                    />
                  </div>
                </div>
              </div>
            </form>
          </BaseModal>
          {/* Paid Leave  */}
          <BaseModal
            isOpen={paidLeaveModal}
            toggler={() => setPaidLeaveModal(false)}
            title="Paid Leave"
            submitText="Submit"
          >
            <form>
              <div className="form-group">
                <div className="form-check d-flex justify-content-between mt-2">
                  <div>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="leaveOption"
                      id="weeklyOff"
                      defaultValue="weeklyOff"
                    />
                    <label className="form-check-label" htmlFor="weeklyOff">
                      Weekly Off
                    </label>
                  </div>
                  <span className="text-muted">0.00 Left</span>
                </div>
                <div className="form-check d-flex justify-content-between mt-2">
                  <div>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="leaveOption"
                      id="compOffLeave"
                      defaultValue="compOffLeave"
                    />
                    <label className="form-check-label" htmlFor="compOffLeave">
                      Comp Off Leave
                    </label>
                  </div>
                  <span className="text-muted">0.00 Left</span>
                </div>
                <div className="form-check d-flex justify-content-between mt-2">
                  <div>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="leaveOption"
                      id="other"
                      defaultValue="other"
                    />
                    <label className="form-check-label" htmlFor="other">
                      Other
                    </label>
                  </div>
                  <span className="text-muted">0.00 Left</span>
                </div>
              </div>
            </form>
          </BaseModal>
          {/* Logs Modal  */}

          <BaseModal
            isOpen={logModal}
            toggler={() => setLogModal(false)}
            title="View Logs"
            submitText="Submit"
            hasSubmitButton={false}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-12 mt-2">
                  <div className="log-card">
                    <div className="log-card-body">
                      <p className="log-card-text">
                        Present added at 02:00 PM on 04/12/2024
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 mt-2">
                  <div className="log-card">
                    <div className="log-card-body">
                      <p className="log-card-text">
                        Present added at 02:00 PM on 04/12/2024
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 mt-2">
                  <div className="log-card">
                    <div className="log-card-body">
                      <p className="log-card-text">
                        Present added at 02:00 PM on 04/12/2024
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BaseModal>

          {/* Add Note  */}
          <BaseModal
            isOpen={noteModal}
            toggler={() => setNoteModal(false)}
            title="Add Note"
            submitText="Submit"
          >
            <form id="attendanceForm">
              <div className="row">
                <div className="col-lg-12 mt-2">
                  <label htmlFor="outTime">Note</label>
                  <div className="input-group">
                    <textarea
                      type="text"
                      name="outTime"
                      id="outTime"
                      className="form-control"
                      placeholder="Enter Note"
                      required=""
                      defaultValue={""}
                    />
                  </div>
                </div>
              </div>
            </form>
          </BaseModal>

          {/* Comp Modal  */}
          <BaseModal
            isOpen={compModal}
            toggler={() => setCompModal(false)}
            title="Comp Modal"
            submitText="Submit"
          >
            <form id="attendanceForm">
              <div className="row">
                <div className="col-lg-12">
                  <label htmlFor="inTime">Worked Holiday</label>
                  <select
                    className="form-select digits"
                    id="exampleFormControlSelect9"
                  >
                    <option disabled selected>
                      Select Worked Holiday
                    </option>
                    <option>3rd Jan 2024</option>
                    <option>7th Jan 2024</option>
                    <option>12th Apr 2024</option>
                  </select>
                </div>
                <div className="col-lg-12 mt-2">
                  <label htmlFor="outTime">Enter Compensation Day</label>
                  <div className="input-group">
                    <input
                      type="date"
                      name="leave_day"
                      id="leave_day"
                      className="form-control"
                      defaultValue="04-07-2024"
                    />
                  </div>
                </div>
              </div>
            </form>
          </BaseModal>

          {/* Present Modal  */}
          <BaseModal
            isOpen={presentModal}
            toggler={() => setPresentModal(false)}
            title="Present Thursday"
            submitText="Submit"
          >
            <form id="attendanceForm">
              <div className="row">
                <div className="col-lg-12 mt-2">
                  <label htmlFor="inTime">In Time</label>
                  <div className="input-group">
                    <input
                      type="time"
                      name="inTime"
                      id="inTime"
                      className="form-control"
                      required=""
                    />
                  </div>
                </div>
                <div className="col-lg-12 mt-2">
                  <label htmlFor="outTime">Out Time</label>
                  <div className="input-group">
                    <input
                      type="time"
                      name="outTime"
                      id="outTime"
                      className="form-control"
                      required=""
                    />
                  </div>
                </div>
              </div>
            </form>
          </BaseModal>
        </div>
      </div>
    </div>
  );
};

export default StaffLeave;
