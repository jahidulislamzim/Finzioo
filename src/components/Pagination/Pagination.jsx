import React from 'react';
import Button from '../Button/Button';
import './Pagination.scss';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onNext, 
  onPrev, 
  onGoToPage,
  hasNextPage, 
  hasPrevPage,
  loading 
}) => {
  // Don't show pagination if there's only one page and we're not loading
  if (totalPages <= 1 && !loading) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <Button
          key={i}
          btnType={currentPage === i ? 'primary' : 'secondary'}
          className={`page-num ${currentPage === i ? 'active' : ''}`}
          onClick={() => onGoToPage(i)}
          disabled={loading}
          iconOnly={true}
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  return (
    <div className="pagination-container">
      <Button 
        onClick={() => onGoToPage(1)} 
        disabled={currentPage === 1 || loading} 
        btnType="secondary"
        className="pagination-nav-btn"
        iconOnly={true}
        title="First Page"
      >
        <i className="fat fa-chevron-double-left"></i>
      </Button>

      <Button 
        onClick={onPrev} 
        disabled={!hasPrevPage || loading} 
        btnType="secondary"
        className="pagination-nav-btn"
        iconOnly={true}
        title="Previous Page"
      >
        <i className="fat fa-chevron-left"></i>
      </Button>
      
      <div className="page-numbers">
        {renderPageNumbers()}
      </div>

      <Button 
        onClick={onNext} 
        disabled={!hasNextPage || loading} 
        btnType="secondary"
        className="pagination-nav-btn"
        iconOnly={true}
        title="Next Page"
      >
        <i className="fat fa-chevron-right"></i>
      </Button>

      <Button 
        onClick={() => onGoToPage(totalPages)} 
        disabled={currentPage === totalPages || loading} 
        btnType="secondary"
        className="pagination-nav-btn"
        iconOnly={true}
        title="Last Page"
      >
        <i className="fat fa-chevron-double-right"></i>
      </Button>
    </div>
  );
};

export default Pagination;
