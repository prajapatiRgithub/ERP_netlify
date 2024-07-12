import React, { useState } from "react";
import {
  RiCalendarLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
} from "react-icons/ri";
import {
  Actual,
  Adjustments,
  dataEntries,
  Deductions,
  DueAmount,
  Earnings,
  Full,
  GrossEarning,
  NetPayable,
  Payments,
  TotalDeductions,
} from "../../Constant/HR/salaryOverView";

const SalaryOverview = () => {
 

  const [openDetailsId, setOpenDetailsId] = useState(null);

  const toggleDetails = (id) => {
    setOpenDetailsId(openDetailsId === id ? null : id);
    setActiveMonth(activeMonth === id ? null : id);
  };
  const [activeMonth, setActiveMonth] = useState(null);
  return (
    <>
      <div className="container mt-4">
        {dataEntries?.map((entry) => (
          <div
            key={entry.id}
            className="staff-card border month-card p-2 mt-1 mb-3"
          >
            <div
              className="d-flex justify-content-between align-items-center px-2"
              onClick={() => toggleDetails(entry.id)}
            >
              <div className="d-flex align-items-center gap-4 ml-4 custom-new">
                <RiCalendarLine className="fs-5" />
                <div className="ml-4">
                  <h5>{entry.month}</h5>
                  <span className="text-muted">{`Duration: ${entry.duration}`}</span>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="mx-4">
                  <h5>{DueAmount}</h5>
                  <span className="text-muted">{entry.dueAmount}</span>
                </div>
                {activeMonth === entry.id ? (
                  <RiArrowUpSLine className="ml-2 fs-3" />
                ) : (
                  <RiArrowDownSLine className="ml-2 fs-3" />
                )}
              </div>
            </div>

            {activeMonth === entry.id && (
              <div
                id={`${entry.month.toLowerCase().replace(" ", "-")}-details`}
                className="details"
              >
                <div className="card-body">
                  <div
                    id={`${entry.month
                      .toLowerCase()
                      .replace(" ", "-")}-details`}
                    className="details"
                  >
                    <div className="card-body">
                      <div className="customTop">
                        <div className="row border-bottom mt-2">
                          <div className="col-3">
                            <h6>{Earnings}</h6>
                          </div>
                          <div className="col-2">
                            <h6>{Full}</h6>
                          </div>
                          <div className="col-2">
                            <h6>{Actual}</h6>
                          </div>
                          <div className="col-3">
                            <h6>{Deductions}</h6>
                          </div>
                          <div className="col-2">
                            <h6>{Actual}</h6>
                          </div>
                        </div>
                        {entry?.earnings?.map((earning, index) => (
                          <div key={index} className="row">
                            <div className="col-3">
                              <p>{earning.label}</p>
                            </div>
                            <div className="col-2">
                              <p>{earning.full}</p>
                            </div>
                            <div className="col-2">
                              <p>{earning.actual}</p>
                            </div>

                            <div className="col-3">
                              {/* Placeholder for deductions */}
                              <p></p>
                            </div>
                            <div className="col-2">
                              <p>{earning.actual}</p>
                            </div>
                          </div>
                        ))}
                        <div className="row">
                          <div className="col-3">
                            <p>{GrossEarning}</p>
                          </div>
                          <div className="col-2">
                            <p></p>
                          </div>
                          <div className="col-2">
                            <p>{entry.grossEarning}</p>
                          </div>
                          <div className="col-3">
                            <p>{TotalDeductions}</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-bottom" />
                      <div className="customNet">
                        <div className="row mt-1">
                          <div className="col-5">
                            <h6>{NetPayable}</h6>
                          </div>
                          <div className="col-3 text-end">
                            <p>{"28 Payable Days"}</p>
                          </div>
                          <div className="col-3 text-end mr-4">
                            <p>{entry.netPayableAmount}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-5">
                            <h6>{Adjustments}</h6>
                          </div>
                          <div className="col-6 text-end">
                            <p>{entry.adjustments}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-5">
                            <h6>{Payments}</h6>
                          </div>
                          <div className="col-6 text-end">
                            <p>{entry.payments}</p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-7">
                            <h6>
                              {DueAmount}: {entry.dueAmount}
                            </h6>
                          </div>
                          <div className="col-4 text-right">
                            {/* Placeholder for additional details */}
                            <p></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default SalaryOverview;
