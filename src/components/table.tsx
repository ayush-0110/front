import {useTable} from 'react-table';
import {useSortBy, usePagination} from 'react-table';
import React from 'react';
import {format} from 'date-fns';

function Table({columns, data, onDelete, onEdit}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: {pageIndex, pageSize},
  } = useTable({columns, data}, useSortBy, usePagination);
  return (
    <>
      {/* <div className="flex flex-col h-full">
        <div className="overflow-x-auto"> */}
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        {/* <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"> */}
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="py-2 px-4 font-medium text-gray-700 text-left"
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="py-2 px-4 text-left"
                    >
                      {cell.column.id === 'status' &&
                      cell.value === 'Active' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                          {cell.value}
                        </span>
                      ) : cell.column.id === 'status' &&
                        cell.value === 'Inactive' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
                          {cell.value}
                        </span>
                      ) : cell.column.id === 'lastLogin' ? (
                        <>
                          <div>
                            {format(new Date(cell.value), 'MMM dd, yyyy')}
                          </div>
                          <div className="text-sm text-gray-500">
                            {format(new Date(cell.value), 'hh:mm a')}
                          </div>
                        </>
                      ) : (
                        cell.render('Cell')
                      )}
                    </td>
                  ))}
                  <td>
                    <button
                      onClick={() => onEdit(row.original)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(row.original)}
                      className="bg-purple-500 hover:bg-red-700 text-white font-bold py-2 ml-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex flex-row items-center justify-between mt-4 mb-2">
          <div>
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className="px-3 ml-2 py-2 rounded text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
            >
              {'<<'}
            </button>{' '}
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="ml-2 px-3 py-2 rounded text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
            >
              {'<'}
            </button>{' '}
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="ml-2 px-3 py-2 rounded text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
            >
              {'>'}
            </button>{' '}
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className="ml-2 mr-2 px-3 py-2 rounded text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
            >
              {'>>'}
            </button>
          </div>
          <div>
            <span className="mr-4">
              Page
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
          </div>
          <div className="text-center">
            <span>
              Go to page:
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  gotoPage(page);
                }}
                className=" mx-2 px-3 py-2 border border-gray-300 rounded text-gray-700"
                style={{width: '100px'}}
              />
            </span>
            {/* <div className="flex items-center ml-4"> */}
            <span className="text-sm text-gray-700 mr-2">Items per page:</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
              }}
              className="mr-2 px-3 py-2 border border-gray-300 rounded text-gray-700"
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            {/* </div> */}
          </div>
        </div>
      </div>
      {/* </div>
      </div> */}
    </>
  );
}

export default Table;
