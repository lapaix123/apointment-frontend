// src/components/Pagination.jsx
import React from 'react';
import ReactPaginate from 'react-paginate';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (data) => {
    onPageChange(data.selected + 1);
  };

  return (
    <ReactPaginate
      previousLabel={'«'}
      nextLabel={'»'}
      breakLabel={'...'}
      breakClassName={'break-me'}
      pageCount={totalPages}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageClick}
      containerClassName={'pagination'}
      activeClassName={'active'}
      initialPage={currentPage - 1}
    />
  );
};

export default Pagination;
