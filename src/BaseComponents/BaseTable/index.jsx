import React, { Fragment, useEffect, useState } from "react";
import { Col, PaginationItem, Row, Table } from "reactstrap";
import { Link } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Search, notFound } from "../../Constant";
import { handleResponse } from "../../Constant/common";

// Column Filter
const Filter = ({ column, table }) => {
  const columnFilterValue = column.getFilterValue();
  return (
    <>
      <DebouncedInput
        type="text"
        value={columnFilterValue ?? ""}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={Search}
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
};

const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
  }
};

// Global Filter
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <input
      {...props}
      value={value}
      id="search-bar-0"
      className="form-control search"
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
};

const TableContainer = ({
  columns,
  data,
  isGlobalFilter,
  isProductsFilter,
  isContactsFilter,
  isCompaniesFilter,
  isNFTRankingFilter,
  isTaskListFilter,
  hasManualPagination,
  customPageSize,
  tableClass,
  theadClass,
  trClass,
  thClass,
  divClass,
  SearchPlaceholder,
  currentPage,
  setCurrentPage,
  totalPages,
  totalRecords,
  totalNumberOfRows,
  fetchData,
  fetchSortingData,
  setCustomPageSize,
  onSearch,
  manualPagination,
  manualFiltering,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(customPageSize);
  const [onValueSearch, setOnValueSearch] = useState("");
  const [sorting, setSorting] = useState([]);

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank,
    });
    return itemRank.passed;
  };

  const table = useReactTable({
    columns,
    data: data,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const {
    getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    nextPage,
    previousPage,
    getState,
  } = table;

  useEffect(() => {
    setPageSize(customPageSize);
    setCustomPageSize(customPageSize);
  }, [customPageSize, setPageSize]);

  const handleNextPage = () => {
    fetchData(currentPage + 1);
  };

  const handlePreviousPage = () => {
    fetchData(currentPage - 1);
  };

  const handleSorting = (column) => {
    const isSorted = sorting?.find((sort) => sort.id === column.id);
    const newSorting = isSorted
      ? { id: column.id, desc: !isSorted.desc }
      : { id: column.id, desc: false };
    setSorting([newSorting]);
    const order = newSorting.desc ? "DESC" : "ASC";
    fetchSortingData(currentPage, column.id, order);
  };

  const renderPaginationItems = () => {
    const totalPages = Math.ceil(totalNumberOfRows / pageSize);
    const items = [];

    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <PaginationItem
          key={number}
          active={number === currentPage}
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(number);
          }}
        >
          {number}
        </PaginationItem>
      );
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchData(pageNumber);
  };

  const handleValueChange = (newValue) => {
    setOnValueSearch(newValue);
    if (typeof onSearch === "function") {
      onSearch(newValue);
    }
  };

  useEffect(() => {
    table.setPageSize(customPageSize);
  }, []);

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setCustomPageSize(newSize);
    table.setPageSize(newSize);
  };

  const renderPageNumbers = () => {
    const MAX_PAGES_DISPLAYED = customPageSize;
    const totalPages11 = totalPages;
    const currentPage11 = currentPage;

    let startPage = Math.max(1, currentPage11 - 2);
    let endPage = Math.min(totalPages11, startPage + MAX_PAGES_DISPLAYED - 1);

    if (endPage - startPage + 1 < MAX_PAGES_DISPLAYED) {
      startPage = Math.max(1, endPage - MAX_PAGES_DISPLAYED + 1);
    }

    const pageNumbers = [];

    if (startPage > 1) {
      pageNumbers?.push(
        <li key="ellipsisStart" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers?.push(
        <li
          key={i}
          className={currentPage11 === i ? "page-item active" : "page-item"}
        >
          <Link
            className="page-link"
            onClick={(e) => {
              e.preventDefault();
              handlePageClick(i);
            }}
          >
            {i}
          </Link>
        </li>
      );
    }

    if (endPage < totalPages11) {
      pageNumbers?.push(
        <li key="ellipsisEnd" className="page-item disabled">
          <span className="page-link">...</span>
        </li>
      );
    }

    return pageNumbers;
  };
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalRecords);
  return (
    <Fragment>
      {isGlobalFilter && (
        <Row className="mb-3">
          <form>
            <Row className="d-flex gap-2 justify-content-between align-items-center">
              <Col sm={2}>
                Items per page: &nbsp;
                <select value={pageSize} onChange={handlePageSizeChange}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                  <option value={totalRecords}>{handleResponse.all}</option>
                </select>
              </Col>
              <Col sm={3}>
                {manualFiltering ? (
                  <div
                    className={
                      isProductsFilter ||
                      isContactsFilter ||
                      isCompaniesFilter ||
                      isNFTRankingFilter
                        ? "search-box me-2 mb-2 d-inline-block"
                        : "search-box me-2 mb-2 d-inline-block col-12"
                    }
                  >
                    <DebouncedInput
                      value={onValueSearch ?? ""}
                      onChange={(value) => handleValueChange(String(value))}
                      placeholder={SearchPlaceholder}
                    />
                    <i className="bx bx-search-alt search-icon"></i>
                  </div>
                ) : (
                  <div
                    className={
                      isProductsFilter ||
                      isContactsFilter ||
                      isCompaniesFilter ||
                      isNFTRankingFilter
                        ? "search-box me-2 mb-2 d-inline-block"
                        : "search-box me-2 mb-2 d-inline-block col-12"
                    }
                  >
                    <DebouncedInput
                      value={globalFilter ?? ""}
                      onChange={(value) => setGlobalFilter(String(value))}
                      placeholder={SearchPlaceholder}
                    />
                    <i className="bx bx-search-alt search-icon"></i>
                  </div>
                )}
              </Col>
            </Row>
          </form>
        </Row>
      )}

      <div className={divClass}>
        <Table hover className={tableClass}>
          <thead className={theadClass}>
            {getHeaderGroups()?.map((headerGroup) => (
              <tr className={trClass} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={thClass}
                    onClick={() => {
                      if (header.column.columnDef.enableSorting === undefined) {
                        // Check if sorting is enabled for this column
                        handleSorting(header.column);
                      }
                    }}
                  >
                    <b>
                      {header.isPlaceholder ? null : (
                        <React.Fragment>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.enableSorting === undefined &&
                            {
                              asc: " ▲",
                              desc: " ▼",
                            }[header.column.getIsSorted()]}
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </React.Fragment>
                      )}
                    </b>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {data && data?.length > 0 ? (
              getRowModel()?.rows?.length > 0 ? (
                getRowModel()?.rows?.map((row) => {
                  return (
                    <tr key={row.id}>
                      {row.getVisibleCells()?.map((cell) => {
                        const cellValue = cell.getValue();
                        return (
                          <td key={cell.id}>
                            {cellValue === null || cellValue === ""
                              ? "-"
                              : flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center">
                    <div className="py-2">{notFound.dataNotFound}</div>
                  </td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan={columns?.length} className="text-center">
                  <div className="py-2">{notFound.dataNotFound}</div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {hasManualPagination === undefined && data?.length !== 0 && (
        <>
          {manualPagination ? (
            <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
              <div className="col-sm">
                <div className="text-muted">
                  Showing{" "}
                  <span className="fw-semibold ms-1">
                    {startIndex} to {endIndex}
                  </span>{" "}
                  of <span className="fw-semibold">{totalRecords}</span> Results
                </div>
              </div>
              <div className="col-sm-auto">
                <ul className="pagination pagination-separated pagination-sm justify-content-center justify-content-sm-start mb-0">
                  <li
                    className={
                      currentPage === 1 ? "page-item disabled" : "page-item"
                    }
                  >
                    <Link
                      className="page-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePreviousPage();
                      }}
                    >
                      <i className="fa fa-chevron-left m-r-5"></i>
                    </Link>
                  </li>
                  {renderPageNumbers()}
                  <li
                    className={
                      currentPage === totalPages
                        ? "page-item disabled"
                        : "page-item"
                    }
                  >
                    <Link
                      className="page-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleNextPage();
                      }}
                    >
                      <i className="fa fa-chevron-right m-r-5"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </Row>
          ) : (
            <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
              <div className="col-sm">
                <div className="text-muted">
                  Showing{" "}
                  <span className="fw-semibold ms-1">
                    {getState().pagination.pageSize}
                  </span>{" "}
                  of <span className="fw-semibold">{data?.length}</span> Results
                </div>
              </div>
              <div className="col-sm-auto">
                <ul className="pagination pagination-separated pagination-sm justify-content-center justify-content-sm-start mb-0">
                  <li
                    className={
                      !getCanPreviousPage() ? "page-item disabled" : "page-item"
                    }
                  >
                    <Link
                      className="page-link"
                      onClick={(e) => {
                        e.preventDefault();
                        previousPage();
                      }}
                    >
                      <i className="fa fa-chevron-left m-r-5"></i>
                    </Link>
                  </li>
                  {renderPaginationItems()}
                  <li
                    className={
                      !getCanNextPage() ? "page-item disabled" : "page-item"
                    }
                  >
                    <Link
                      className="page-link"
                      onClick={(e) => {
                        e.preventDefault();
                        nextPage();
                      }}
                    >
                      <i className="fa fa-chevron-right m-r-5"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </Row>
          )}
        </>
      )}
    </Fragment>
  );
};

export default TableContainer;
