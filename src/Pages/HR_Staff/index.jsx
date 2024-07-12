import React, { useMemo, useState } from 'react'
import { hrEnums } from '../../Constant/HR_Staff/hrEnums'
import { RiEyeLine } from 'react-icons/ri';
import TableContainer from '../../BaseComponents/BaseTable';
import { Search } from '../../Constant';
import { useNavigate } from 'react-router-dom';
import { setStaffIdInSessionStorage } from '../../Constant/common';

const StaffHR = () => {
    const [searchValue, setSearchValue] = useState("");
    const [customPageSize, setCustomPageSize] = useState(5);
    const setCurrentPage=1;
    const currentPage=1;
    const totalNumberOfRows=5;
    const totalPages = 1;
    const totalRecords = 5;

    const navigate= useNavigate();
    
    const handleSearchValueChange = (value) => {
        setSearchValue(value);
      };
    
      const handleFetchData = (page) => {
        setCurrentPage(page);
      };
    
      const handleFetchSorting = (page, id, order) => {
        setCurrentPage(page);
      };

    const handleView = (id) =>{
        setStaffIdInSessionStorage(id);
        navigate(`/staffProfile/${id}`, { state: 
          { viewProfileMode: true, viewGeneralMode: true, viewPersonalMode: true, viewEmploymentMode: true, viewBankMode: true } });
    }

    const handleAdd = () => {
      navigate('/staffProfile', { state: 
        { viewProfileMode: false, viewGeneralMode: false, viewPersonalMode: false, viewEmploymentMode: false, viewBankMode: false } });
      };

    const classColumns = useMemo(
        () => [
          {
            header: hrEnums.SR_NO,
            accessorKey: "serial_number",
            cell: (cell) => cell.row.index + 1,
            enableColumnFilter: false,
          },
          {
            header: hrEnums.STAFF_NAME,
            accessorKey: "staff_name",
            enableColumnFilter: false,
          },
          {
            header: hrEnums.CONTACT_NO,
            accessorKey: "contact",
            enableColumnFilter: false,
          },
          {
            header: hrEnums.EMAIL_ID,
            accessorKey: "email_id",
            enableColumnFilter: false,
          },
          {
            header: hrEnums.JOINING_DATE,
            accessorKey: "joining_date",
            enableColumnFilter: false,
          },
          {
            header: hrEnums.ACTION,
            accessorKey: "action",
            enableColumnFilter: false,
            cell: (cell) => (
              <div className="d-flex justify-content-center icon">
                <RiEyeLine
                  className="fs-5 mx-2 text-success"
                  onClick={() => handleView(cell.row.original.id)}
                  title={hrEnums.VIEW}
                />
              </div>
            ),
          },
        ],
        []
      );
      
    return (
        <div>
        <div className="container-fluid">
        <div className="page-header dash-breadcrumb py-3">
          <div className="row">
            <div className="col-6">
              <h5 className="f-w-600">{hrEnums.STAFF}</h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <button onClick={handleAdd} className="btn btn-pill btn-primary mx-2">
                  {hrEnums.ADD} {hrEnums.STAFF}
              </button>
            </div>
          </div>
        </div>
      </div>
        <div className="card mx-3">
          <div className="card-body text-center">
          {hrEnums.classData && hrEnums.classData?.length > 0 && (
            <TableContainer
              totalPages={totalPages}
              totalRecords={totalRecords}
              totalNumberOfRows={totalNumberOfRows}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              fetchData={handleFetchData}
              customPageSize={customPageSize}
              setCustomPageSize={setCustomPageSize}
              fetchSortingData={handleFetchSorting}
              columns={classColumns}
              data={searchValue ? [] : hrEnums.classData || []}
              manualPagination={true}
              SearchPlaceholder={Search}
              onSearch={handleSearchValueChange}
              isGlobalFilter={true}
              tableClass="table table-bordered text-center"
            />
          )}
          </div>
        </div>
      </div>
    )
}

export default StaffHR